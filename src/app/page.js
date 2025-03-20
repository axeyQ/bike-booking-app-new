'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Bike Booking
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Welcome, {user.firstName}</span>
                <Link href="/customer/bikes">
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="flex flex-col md:flex-row items-center py-16 md:py-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Book Your Perfect Ride
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Find and book the perfect bike for your next adventure.
                Browse our selection of bikes and book with just a few clicks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/customer/bikes">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Bikes
                  </Button>
                </Link>
                
                <Link href="/auth/sign-in">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 md:pl-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl p-2">
                <div className="rounded-lg overflow-hidden shadow-xl bg-white">
                  <div className="h-64 bg-gradient-to-r from-blue-500 to-cyan-400 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
                      Premium Bike Selection
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Features Section */}
          <motion.div 
            className="py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy Booking",
                  description: "Simple and fast booking process that takes just a few clicks."
                },
                {
                  title: "Quality Bikes",
                  description: "Well-maintained bikes for a smooth and enjoyable ride."
                },
                {
                  title: "Flexible Options",
                  description: "Hourly, daily, or weekly rentals to suit your needs."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div 
            className="py-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Sign up today and get access to our premium bike selection.
            </p>
            
            <Link href="/auth/sign-up">
              <Button size="lg">
                Create Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bike Booking</h3>
              <p className="text-gray-400">
                The premier platform for bike rentals.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/customer/bikes" className="text-gray-400 hover:text-white">Browse Bikes</Link></li>
                <li><Link href="/auth/sign-in" className="text-gray-400 hover:text-white">Sign In</Link></li>
                <li><Link href="/auth/sign-up" className="text-gray-400 hover:text-white">Create Account</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                contact@bikebooking.com<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Bike Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}