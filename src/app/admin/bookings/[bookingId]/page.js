'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBookingById } from '@/hooks/use-bookings';
import { useBikeById } from '@/hooks/use-bikes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { useBookings } from '@/hooks/use-bookings';
import { BOOKING_STATUSES } from '@/lib/constants';
import { formatDate, formatDateTime, formatPrice, calculateDuration } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  User,
  Bike,
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function BookingDetailsPage({ params }) {
  const bookingId = params.bookingId;
  const booking = useBookingById(bookingId);
  const { updateBookingStatus } = useBookings();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get bike details if we have the booking
  const bike = useBikeById(booking?.bikeId);
  
  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
      showSuccess(`Booking status updated to ${BOOKING_STATUSES[newStatus].label}`);
    } catch (error) {
      showError('Failed to update booking status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!booking || !bike) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  // Calculate duration
  const { hours, days } = calculateDuration(booking.startTime, booking.endTime);
  
  // Get status details
  const statusInfo = BOOKING_STATUSES[booking.status] || {
    label: booking.status,
    color: 'bg-gray-100 text-gray-800',
    icon: 'info',
  };
  
  // Determine available actions based on current status
  const canConfirm = booking.status === 'pending';
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const canComplete = booking.status === 'confirmed';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/bookings" className="mr-4">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        
        <Badge
          variant="outline"
          className={statusInfo.color}
        >
          {statusInfo.label}
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Booking Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Booking Period</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {days > 0 ? `${days} days` : ''} 
                    {days > 0 && hours % 24 > 0 ? ' and ' : ''}
                    {hours % 24 > 0 ? `${hours % 24} hours` : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(booking.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-sm text-gray-600">
                    ID: {booking.userId}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {booking.notes && (
              <div className="flex items-start space-x-3">
                <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Bike Info */}
        <Card>
          <CardHeader>
            <CardTitle>Bike Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 mb-4">
              {bike.images && bike.images.length > 0 ? (
                <img
                  src={bike.images[0]}
                  alt={bike.name}
                  className="object-cover rounded-md w-full h-44"
                />
              ) : (
                <div className="bg-gray-200 rounded-md w-full h-44 flex items-center justify-center">
                  <Bike className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold">{bike.name}</h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {bike.type}</p>
              <p><span className="font-medium">Brand:</span> {bike.specifications?.brand || 'N/A'}</p>
              <p><span className="font-medium">Model:</span> {bike.specifications?.model || 'N/A'}</p>
              <p><span className="font-medium">Hourly Rate:</span> {formatPrice(bike.pricePerHour)}</p>
              <p><span className="font-medium">Daily Rate:</span> {formatPrice(bike.pricePerDay)}</p>
            </div>
            
            <Link href={`/admin/bikes/${bike._id}`} className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">
                View Bike Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {canConfirm && (
                <Button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Booking
                </Button>
              )}
              
              {canComplete && (
                <Button
                  onClick={() => handleStatusChange('completed')}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
              
              {canCancel && (
                <Button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center border-red-300 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
              )}
            </div>
            
            {booking.status === 'cancelled' && (
              <div className="flex items-center p-4 rounded-md bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  This booking has been cancelled and cannot be modified further.
                </p>
              </div>
            )}
            
            {booking.status === 'completed' && (
              <div className="flex items-center p-4 rounded-md bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">
                  This booking has been completed successfully.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}