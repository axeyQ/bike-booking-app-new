'use client';

import Link from 'next/link';

export function Footer() {
  return (
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
              <li><Link href="/customer/bikes" className="text-gray-400 hover:text-white transition-colors">Browse Bikes</Link></li>
              <li><Link href="/auth/sign-in" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/auth/sign-up" className="text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
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
  );
}