'use client';

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

// This component handles syncing the Clerk user to our Convex database
export function ClerkConvexAdapter({ children }) {
  const { user, isSignedIn } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);
  
  // When a user is authenticated, save their info to our Convex database
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
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
  }, [isSignedIn, user, createOrUpdateUser]);
  
  return children;
}