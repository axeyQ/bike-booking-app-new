import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Custom hook for getting a booking by ID
export function useBookingById(bookingId) {
  return useQuery(api.bookings.getById, bookingId ? { bookingId } : null);
}

// Custom hook for getting bookings by user ID
export function useBookingsByUserId(userId) {
  return useQuery(api.bookings.getByUserId, userId ? { userId } : null);
}

// Custom hook for getting bookings by bike ID
export function useBookingsByBikeId(bikeId) {
  return useQuery(api.bookings.getByBikeId, bikeId ? { bikeId } : null);
}

// Main bookings hook
export function useBookings() {
  // Queries
  const allBookings = useQuery(api.bookings.getAll);
  
  // Mutations
  const createBooking = useMutation(api.bookings.create);
  const updateBookingStatus = useMutation(api.bookings.updateStatus);
  const updateBooking = useMutation(api.bookings.update);
  const cancelBooking = useMutation(api.bookings.cancel);
  
  return {
    // Data
    allBookings,
    
    // Functions
    createBooking,
    updateBookingStatus,
    updateBooking,
    cancelBooking,
  };
}