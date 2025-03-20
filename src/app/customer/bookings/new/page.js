'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useBikeById } from '@/hooks/use-bikes';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { TIME_SLOTS } from '@/lib/constants';
import { formatPrice, calculatePrice, showSuccess, showError } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { createBooking } = useBookings();
  
  // Get bike ID from query params
  const bikeId = searchParams.get('bikeId');
  const bike = useBikeById(bikeId);
  
  // Form state
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(TIME_SLOTS[0].id); // Default to 1 hour
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationUnit, setDurationUnit] = useState('minutes'); // minutes, hours, days
  const [customDuration, setCustomDuration] = useState(1);
  
  // Calculated values
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Update end timestamp and price when inputs change
  useEffect(() => {
    if (!bike || !startDate) return;
    
    try {
      // Calculate start timestamp
      const [hours, minutes] = startTime.split(':').map(Number);
      const startTimestamp = new Date(startDate);
      startTimestamp.setHours(hours, minutes, 0, 0);
      
      // Calculate end timestamp based on duration
      let durationMs;
      if (durationUnit === 'custom') {
        const customDurationMinutes = customDuration * 60; // Convert hours to minutes
        durationMs = customDurationMinutes * 60 * 1000;
      } else {
        durationMs = duration * 60 * 1000; // Convert minutes to milliseconds
      }
      
      const endTimestamp = new Date(startTimestamp.getTime() + durationMs);
      setEndTimestamp(endTimestamp.getTime());
      
      // Calculate price
      const price = calculatePrice(
        startTimestamp.getTime(),
        endTimestamp.getTime(),
        bike.pricePerHour,
        bike.pricePerDay
      );
      setTotalPrice(price);
    } catch (error) {
      console.error('Error calculating booking details:', error);
    }
  }, [bike, startDate, startTime, duration, durationUnit, customDuration]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !bike || !startDate || !startTime || !endTimestamp) {
      showError('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate start timestamp
      const [hours, minutes] = startTime.split(':').map(Number);
      const startTimestamp = new Date(startDate);
      startTimestamp.setHours(hours, minutes, 0, 0);
      
      // Create booking
      await createBooking({
        bikeId: bike._id,
        userId: user.id,
        startTime: startTimestamp.getTime(),
        endTime: endTimestamp,
        totalPrice,
        notes,
      });
      
      showSuccess('Booking created successfully!');
      router.push('/customer/bookings');
    } catch (error) {
      showError(error.message || 'Failed to create booking');
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle duration change
  const handleDurationChange = (e) => {
    const value = e.target.value;
    
    if (value === 'custom') {
      setDurationUnit('custom');
    } else {
      setDuration(parseInt(value));
      setDurationUnit('minutes');
    }
  };
  
  // Format duration display
  const formatDuration = (minutes) => {
    const hours = minutes / 60;
    if (hours < 1) return `${minutes} minutes`;
    if (hours === 1) return '1 hour';
    if (hours < 24) return `${hours} hours`;
    
    const days = hours / 24;
    if (days === 1) return '1 day';
    return `${days} days`;
  };
  
  // If bike is not found or loading
  if (!bike) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  // If bike is not available
  if (!bike.isAvailable) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/customer/bikes" className="mr-4">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Book a Bike</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            This bike is currently unavailable
          </h2>
          <p className="text-red-600 mb-4">
            Please browse our other available bikes.
          </p>
          <Link href="/customer/bikes">
            <Button>Browse Other Bikes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <Link href={`/customer/bikes/${bike._id}`} className="mr-4">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Book a Bike</h1>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date*
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 rounded-md border border-gray-200 p-2"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time*
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full pl-10 rounded-md border border-gray-200 p-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration*
                    </label>
                    <select
                      value={durationUnit === 'custom' ? 'custom' : duration}
                      onChange={handleDurationChange}
                      className="w-full rounded-md border border-gray-200 p-2"
                      required
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.label}
                        </option>
                      ))}
                      <option value="custom">Custom Duration</option>
                    </select>
                    
                    {durationUnit === 'custom' && (
                      <div className="mt-2 flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="72"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                          className="w-20 rounded-md border border-gray-200 p-2 mr-2"
                        />
                        <span>hours</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-md border border-gray-200 p-2 min-h-[100px]"
                      placeholder="Any special requests or additional information..."
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !startDate || !startTime}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sticky top-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                
                <div className="flex items-center mb-4">
                  {bike.images && bike.images.length > 0 ? (
                    <img
                      src={bike.images[0]}
                      alt={bike.name}
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{bike.name}</h4>
                    <p className="text-sm text-gray-500">{bike.type}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span>{formatPrice(bike.pricePerHour)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span>{formatPrice(bike.pricePerDay)}</span>
                  </div>
                  
                  {startDate && startTime && endTimestamp && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start:</span>
                        <span>
                          {new Date(startDate + 'T' + startTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">End:</span>
                        <span>{new Date(endTimestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span>
                          {durationUnit === 'custom' 
                            ? `${customDuration} hour${customDuration > 1 ? 's' : ''}` 
                            : formatDuration(duration)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Price:</span>
                    <span className="text-lg text-blue-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Booking Information</p>
                        <p className="mt-1">
                          Your booking will be confirmed upon submission. You can cancel
                          or modify your booking up to 24 hours before the start time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Info icon component
function InfoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}