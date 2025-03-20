'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export default function CustomerLayout({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  
  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
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