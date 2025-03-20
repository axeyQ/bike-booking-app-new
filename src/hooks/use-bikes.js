import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Custom hook for getting a specific bike by ID
export function useBikeById(bikeId) {
  return useQuery(api.bikes.getById, bikeId ? { bikeId } : null);
}

// Custom hook for getting available bikes for a time period
export function useAvailableBikes(startTime, endTime) {
  return useQuery(
    api.bikes.getAvailable, 
    startTime && endTime ? { startTime, endTime } : null
  );
}

// Main bikes hook
export function useBikes() {
  // Queries
  const allBikes = useQuery(api.bikes.getAll);
  
  // Mutations
  const createBike = useMutation(api.bikes.create);
  const updateBike = useMutation(api.bikes.update);
  const deleteBike = useMutation(api.bikes.remove);
  
  return {
    // Data
    allBikes,
    
    // Functions
    createBike,
    updateBike,
    deleteBike,
  };
}