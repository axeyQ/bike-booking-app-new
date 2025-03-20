'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { redirect } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export default function CustomerLayout({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // Show loading state while checking authentication
  if (!isLoaded || (isSignedIn && currentUser === undefined)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader size="lg" className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    redirect('/auth/sign-in');
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}