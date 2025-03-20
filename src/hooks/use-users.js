import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

// Custom hook for getting a user by Clerk ID
export function useUserByClerkId(clerkId) {
  return useQuery(api.users.getByClerkId, clerkId ? { clerkId } : null);
}

// Main users hook
export function useUsers() {
  const { user } = useUser();
  const clerkId = user?.id;
  
  // Queries
  const allUsers = useQuery(api.users.getAll);
  
  const currentUser = useQuery(
    api.users.getByClerkId, 
    clerkId ? { clerkId } : null
  );
  
  const isAdmin = useQuery(
    api.users.isAdmin, 
    clerkId ? { clerkId } : null
  );
  
  // Mutations
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);
  const setAdminStatus = useMutation(api.users.setAdminStatus);
  const updateProfile = useMutation(api.users.updateProfile);
  
  return {
    // Data
    currentUser,
    allUsers,
    isAdmin,
    
    // Functions
    createOrUpdateUser,
    setAdminStatus,
    updateProfile,
  };
}