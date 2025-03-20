'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useBookingById } from '@/hooks/use-bookings';
import { useBikeById } from '@/hooks/use-bikes';
import { Card, CardContent } from '@/components/ui/card';
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
  MapPin,
} from 'lucide-react';

export default function BookingDetailsPage({ params }) {
  const bookingId = params.bookingId;
  const { user } = useUser();
  const booking = useBookingById(bookingId);
  const { cancelBooking } = useBookings();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get bike details if we have the booking
  const bike = useBikeById(booking?.bikeId);
  
  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await cancelBooking({ 
        bookingId,
        reason: 'Cancelled by customer'
      });
      showSuccess('Booking cancelled successfully!');
    } catch (error) {
      showError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state
  if (!booking || !bike || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  // Check if this booking belongs to the current user
  if (booking.userId !== user.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/customer/bookings" className="mr-4">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-red-600 mb-4">
            You don`&apos;`t have permission to view this booking.
          </p>
          <Link href="/customer/bookings">
            <Button>View Your Bookings</Button>
          </Link>
        </div>
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
  
  // Check if booking can be cancelled (only if status is pending or confirmed and start time is > 24h away)
  const canCancelBooking = () => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return false;
    }
    
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return booking.startTime - now > twentyFourHours;
  };
  
  // Get status-specific information for the user
  const getStatusInfo = () => {
    switch(booking.status) {
      case 'pending':
        return {
          title: 'Booking Pending Confirmation',
          message: 'Your booking is waiting for approval from the administrator. We\'ll notify you once it\'s confirmed.',
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        };
      case 'confirmed':
        return {
          title: 'Booking Confirmed',
          message: 'Your booking has been confirmed. Please arrive on time for pick-up.',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: 'bg-green-50 text-green-700 border-green-200',
        };
      case 'completed':
        return {
          title: 'Booking Completed',
          message: 'This booking has been completed. Thank you for choosing our service!',
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'cancelled':
        return {
          title: 'Booking Cancelled',
          message: 'This booking has been cancelled. You can make a new booking at any time.',
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          color: 'bg-red-50 text-red-700 border-red-200',
        };
      default:
        return {
          title: 'Booking Information',
          message: 'Here are your booking details.',
          icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };
  
  const statusDetails = getStatusInfo();
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center">
          <Link href="/customer/bookings" className="mr-4">
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
      </motion.div>
      
      {/* Status Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={`border rounded-lg p-4 flex items-start ${statusDetails.color}`}>
          {statusDetails.icon}
          <div className="ml-3">
            <h3 className="font-semibold">{statusDetails.title}</h3>
            <p className="text-sm mt-1">{statusDetails.message}</p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Booking Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
                    <p className="mt-1">#{booking._id.slice(-6)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Booking Date</h3>
                    <p className="mt-1">{formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rental Period</h3>
                    <p className="mt-1">
                      {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {days > 0 ? `${days} days` : ''} 
                      {days > 0 && hours % 24 > 0 ? ' and ' : ''}
                      {hours % 24 > 0 ? `${hours % 24} hours` : ''}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Price</h3>
                    <p className="mt-1 text-lg font-semibold text-blue-600">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
              
              {booking.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                  <p className="mt-1 whitespace-pre-line">{booking.notes}</p>
                </div>
              )}
              
              {canCancelBooking() && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleCancelBooking}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader size="sm" className="mr-2" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Cancel Booking
                  </Button>
                  <p className="mt-2 text-xs text-gray-500">
                    You can cancel this booking up to 24 hours before the start time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Pickup Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pickup Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Pickup Location</h3>
                    <p className="text-gray-600">123 Main Street, City Center</p>
                    <p className="text-gray-600">Open 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Important Information</h3>
                    <ul className="text-gray-600 list-disc ml-5 mt-1 space-y-1">
                      <li>Please bring a valid ID for verification.</li>
                      <li>A security deposit may be required at pickup.</li>
                      <li>Helmets are provided free of charge.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Bike Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Bike Information</h2>
              
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {bike.images && bike.images.length > 0 ? (
                  <img
                    src={bike.images[0]}
                    alt={bike.name}
                    className="rounded-md object-cover w-full h-48"
                  />
                ) : (
                  <div className="rounded-md bg-gray-100 w-full h-48 flex items-center justify-center">
                    <Bike className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{bike.name}</h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">{bike.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span>{bike.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span>{formatPrice(bike.pricePerHour)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span>{formatPrice(bike.pricePerDay)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href={`/customer/bikes/${bike._id}`}>
                  <Button variant="outline" className="w-full">
                    View Bike Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}