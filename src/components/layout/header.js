'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CUSTOMER_NAVIGATION } from '@/lib/constants';

export function Header() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  
  const isCustomerSection = pathname.startsWith('/customer');
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Bike Booking
          </span>
        </Link>
        
        {/* Navigation */}
        {isSignedIn && isCustomerSection && (
          <nav className="hidden md:flex items-center space-x-6">
            {CUSTOMER_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors",
                  pathname === item.href && "text-blue-600 font-medium"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
        
        {/* Auth Buttons or User Menu */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:inline-block">
                {user.firstName}
              </span>
              <UserButton afterSignOutUrl="/" />
              
              {!isCustomerSection && (
                <Link href="/customer/bikes">
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
  );
}