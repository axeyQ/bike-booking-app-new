'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { showSuccess, showError } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd save these to the database via your Convex API
      // For this example, we'll just show a success message
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await user.signOut();
      router.push('/');
    } catch (error) {
      showError('Failed to sign out');
      console.error(error);
    }
  };
  
  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and preferences
        </p>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      value={user.firstName || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Managed through your account settings
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      value={user.lastName || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Managed through your account settings
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    value={user.primaryEmailAddress?.emailAddress || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Managed through your account settings
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 rounded-md border border-gray-200 p-2 min-h-[80px]"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size="sm" className="mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Booking Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Booking Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Payment Method</h3>
                        <p className="text-sm text-gray-500">Add your preferred payment method</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Notification Preferences</h3>
                        <p className="text-sm text-gray-500">Configure booking notifications</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Account</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => window.open('https://accounts.clerk.dev/user/account', '_blank')}
                    className="flex items-center space-x-3 w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Account Settings</h3>
                      <p className="text-xs text-gray-500">Update your account details</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => window.open('https://accounts.clerk.dev/user/security', '_blank')}
                    className="flex items-center space-x-3 w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Shield className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Security</h3>
                      <p className="text-xs text-gray-500">Manage your password and security</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full text-left py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">Sign Out</h3>
                      <p className="text-xs">Log out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Booking Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-blue-600 mb-1">Total Bookings</h3>
                    <p className="text-3xl font-bold text-blue-700">3</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <h3 className="text-xs font-medium text-green-600 mb-1">Completed</h3>
                      <p className="text-2xl font-bold text-green-700">2</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <h3 className="text-xs font-medium text-yellow-600 mb-1">Upcoming</h3>
                      <p className="text-2xl font-bold text-yellow-700">1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}