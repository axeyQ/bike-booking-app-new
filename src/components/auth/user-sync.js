'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }
    
    const handleSync = async () => {
      try {
        console.log('Syncing user data to Convex...');
        await syncUser({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.emailAddresses[0]?.emailAddress || '',
        });
        console.log('User sync successful');
      } catch (error) {
        console.error('Error syncing user data:', error);
      }
    };
    
    handleSync();
  }, [isLoaded, isSignedIn, user, syncUser]);
  
  // This component doesn't render anything
  return null;
}