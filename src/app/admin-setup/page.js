'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';

export default function AdminSetupPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [setupKey, setSetupKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Convex mutations
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);
  const setAdminStatus = useMutation(api.users.setupInitialAdmin);

  // Handle sync user
  const handleSyncUser = async () => {
    if (!isSignedIn || !user) {
      setMessage('You must be signed in to sync your user');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setMessage('');
    
    try {
      await createOrUpdateUser({
        clerkId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || "",
        isAdmin: false,
      });
      
      setMessage('User successfully synced to Convex database');
      setMessageType('success');
    } catch (error) {
      console.error('Error syncing user:', error);
      setMessage(`Error: ${error.message || 'Failed to sync user'}`);
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle make admin
  const handleMakeAdmin = async () => {
    if (!isSignedIn || !user) {
      setMessage('You must be signed in to become an admin');
      setMessageType('error');
      return;
    }

    if (!setupKey) {
      setMessage('Setup key is required');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setMessage('');
    
    try {
      await setAdminStatus({
        email: user.primaryEmailAddress?.emailAddress || "",
        setupKey: setupKey,
      });
      
      setMessage('User has been set as admin successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error setting admin status:', error);
      setMessage(`Error: ${error.message || 'Failed to set admin status'}`);
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Setup Utility</h1>
        
        <div className="space-y-6">
          {!isSignedIn ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600">
                  Please sign in to use the admin setup utility.
                </p>
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => window.location.href = '/auth/sign-in'}>
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Current User</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.primaryEmailAddress?.emailAddress}
                    </p>
                    <p>
                      <span className="font-medium">Clerk ID:</span> {user.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sync User to Convex</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    If your user isn`&apos;`t showing up in Convex, use this button to manually sync it.
                  </p>
                  <Button 
                    onClick={handleSyncUser} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? <Loader size="sm" className="mr-2" /> : null}
                    Sync User to Convex
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Make User Admin</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter the setup key to promote your user to admin status.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Setup Key</label>
                    <Input
                      type="password"
                      value={setupKey}
                      onChange={(e) => setSetupKey(e.target.value)}
                      placeholder="Enter setup key"
                    />
                    <p className="text-xs text-gray-500">
                      Default key for this demo is: `&quot;`admin-setup-2024`&quot;`
                    </p>
                  </div>
                  <Button 
                    onClick={handleMakeAdmin} 
                    disabled={isProcessing || !setupKey}
                    className="w-full"
                  >
                    {isProcessing ? <Loader size="sm" className="mr-2" /> : null}
                    Make Admin
                  </Button>
                </CardContent>
              </Card>
              
              {message && (
                <div className={`p-4 rounded-md ${
                  messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}