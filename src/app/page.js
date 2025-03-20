'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Bike Booking</h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span>Welcome, {user.firstName}</span>
                <Link 
                  href="/customer/bikes" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Browse Bikes
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/sign-in" 
                  className="text-blue-500 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Discover the Freedom of Two Wheels
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Explore our wide range of bikes for rent - from mountain bikes for adventure to comfortable city cruisers.
              </p>
              <div className="mt-8">
                <Link 
                  href="/customer/bikes" 
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-md"
                >
                  Browse Bikes
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-300">
                {/* This would be a hero image */}
                <div className="h-80 w-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl">
                  Bike Hero Image
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900">Easy Booking</h3>
              <p className="mt-2 text-gray-600">
                Reserve your bike in minutes with our simple booking system.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900">Quality Bikes</h3>
              <p className="mt-2 text-gray-600">
                All our bikes are regularly maintained and ready for your adventure.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900">Flexible Rentals</h3>
              <p className="mt-2 text-gray-600">
                Rent by the hour, day, or week - whatever suits your needs.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold">Bike Booking</h3>
              <p className="mt-2 text-gray-400">Your premier bike rental service</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-gray-400">Contact Us</h4>
              <p className="mt-2 text-gray-400">contact@bikebooking.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bike Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}