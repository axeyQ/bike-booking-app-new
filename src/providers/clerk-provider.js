'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function AuthProvider({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}

// This component handles syncing the Clerk user to our Convex database
export function ClerkConvexAdapter({ children }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);
  
  // When a user is authenticated, save their info to our Convex database
  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user && !isLoading) {
        try {
          await createOrUpdateUser({
            clerkId: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || "",
            // Default to false for isAdmin - you can change this in the admin panel
            isAdmin: false,
          });
          console.log("User synced with Convex");
        } catch (error) {
          console.error("Error syncing user with Convex:", error);
        }
      }
    };
    
    syncUser();
  }, [isAuthenticated, user, isLoading, createOrUpdateUser]);
  
  return children;
}