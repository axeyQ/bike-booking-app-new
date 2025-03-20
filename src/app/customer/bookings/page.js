'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useBookings } from '@/hooks/use-bookings';
import { useBikes } from '@/hooks/use-bikes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { BOOKING_STATUSES } from '@/lib/constants';
import { formatDate, formatDateTime, formatPrice } from '@/lib/utils';
import {
  Calendar,
  Filter,
  Eye,
  XCircle,
  Clock,
  Bike,
  AlertTriangle,
} from 'lucide-react';

export default function CustomerBookingsPage() {
  const { user } = useUser();
  const { allBookings, cancelBooking } = useBookings();
  const { allBikes } = useBikes();
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter bookings when data or filters change
  useEffect(() => {
    if (!allBookings || !user) return;
    
    // Get user's bookings
    let userBookings = allBookings.filter(booking => booking.userId === user.id);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      userBookings = userBookings.filter(booking => booking.status === statusFilter);
    }
    
    // Sort by start time (newest first)
    userBookings.sort((a, b) => b.startTime - a.startTime);
    
    setFilteredBookings(userBookings);
  }, [allBookings, user, statusFilter]);
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await cancelBooking({ 
        bookingId,
        reason: 'Cancelled by customer'
      });
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get bike name
  const getBikeName = (bikeId) => {
    if (!allBikes) return 'Loading...';
    const bike = allBikes.find(bike => bike._id === bikeId);
    return bike ? bike.name : 'Unknown bike';
  };
  
  // Get bike image
  const getBikeImage = (bikeId) => {
    if (!allBikes) return null;
    const bike = allBikes.find(bike => bike._id === bikeId);
    return bike && bike.images && bike.images.length > 0 ? bike.images[0] : null;
  };
  
  // Check if booking can be cancelled (only if status is pending or confirmed and start time is > 24h away)
  const canCancelBooking = (booking) => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return false;
    }
    
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return booking.startTime - now > twentyFourHours;
  };
  
  // Check if a booking is upcoming
  const isUpcomingBooking = (booking) => {
    return booking.startTime > Date.now() && booking.status !== 'cancelled';
  };
  
  // Loading state
  if (!allBookings || !allBikes || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  // Group bookings
  const upcomingBookings = filteredBookings.filter(isUpcomingBooking);
  const pastBookings = filteredBookings.filter(booking => !isUpcomingBooking(booking));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="mt-2 text-gray-600">
              Manage your bike rental bookings
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-200 p-2"
            >
              <option value="all">All Statuses</option>
              {Object.entries(BOOKING_STATUSES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <Link href="/customer/bikes">
              <Button>
                Book a Bike
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* No bookings state */}
      {filteredBookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold">No bookings found</h3>
          <p className="text-gray-500 mt-2 mb-6">
            {statusFilter === 'all' 
              ? "You haven't made any bookings yet." 
              : `You don't have any ${BOOKING_STATUSES[statusFilter]?.label.toLowerCase()} bookings.`}
          </p>
          <Link href="/customer/bikes">
            <Button>Browse Available Bikes</Button>
          </Link>
        </motion.div>
      )}
      
      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Upcoming Bookings</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <Badge
                        variant="outline"
                        className={BOOKING_STATUSES[booking.status]?.color}
                      >
                        {BOOKING_STATUSES[booking.status]?.label || booking.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        #{booking._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="flex mb-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                        {getBikeImage(booking.bikeId) ? (
                          <img
                            src={getBikeImage(booking.bikeId)}
                            alt="Bike"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Bike className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{getBikeName(booking.bikeId)}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-600">
                        {formatPrice(booking.totalPrice)}
                      </span>
                      
                      <div className="flex gap-2">
                        <Link href={`/customer/bookings/${booking._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                        
                        {canCancelBooking(booking) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={isLoading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Past Bookings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Booking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Bike</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastBookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b"
                  >
                    <td className="px-4 py-4 text-sm">#{booking._id.slice(-6)}</td>
                    <td className="px-4 py-4 text-sm">{getBikeName(booking.bikeId)}</td>
                    <td className="px-4 py-4 text-sm">{formatDate(booking.startTime)}</td>
                    <td className="px-4 py-4 text-sm">{formatPrice(booking.totalPrice)}</td>
                    <td className="px-4 py-4 text-sm">
                      <Badge
                        variant="outline"
                        className={BOOKING_STATUSES[booking.status]?.color}
                      >
                        {BOOKING_STATUSES[booking.status]?.label || booking.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Link href={`/customer/bookings/${booking._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}