'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter, usePathname } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export function UserProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // Convex operations
  const createUser = useMutation(api.users.createUser);
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // Check and create user if needed
  useEffect(() => {
    const syncUser = async () => {
      // Only sync when Clerk is loaded and the user is signed in
      if (!isLoaded || !isSignedIn || !user) return;
      
      // If we already have a user record in Convex, no need to create one
      if (currentUser !== undefined && currentUser !== null) return;
      
      try {
        console.log('Syncing user to Convex:', user.id);
        await createUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        console.log('User synced successfully');
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };
    
    syncUser();
  }, [isLoaded, isSignedIn, user, currentUser, createUser]);
  
  // Show loading state while checking auth
  if (isLoaded && isSignedIn && currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }
  
  return children;
}