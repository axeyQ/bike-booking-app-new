'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { redirect } from 'next/navigation';
import { ADMIN_NAVIGATION } from '@/lib/constants';
import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';

// Icon imports
import { 
  LayoutDashboard,
  Bike,
  Calendar,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

// Map navigation items to icons
const getIcon = (icon) => {
  const icons = {
    'home': LayoutDashboard,
    'bike': Bike,
    'calendar': Calendar,
    'bar-chart-2': BarChart2,
    'settings': Settings,
  };
  
  const IconComponent = icons[icon];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

export default function AdminLayout({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = useQuery(api.users.isCurrentUserAdmin);
  const currentUser = useQuery(api.users.getCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Show loading state while checking authentication
  if (!isLoaded || (isSignedIn && (isAdmin === undefined || currentUser === undefined))) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader size="lg" className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking admin permissions...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    redirect('/auth/sign-in');
    return null;
  }

  // Redirect to customer dashboard if not an admin
  if (isLoaded && isAdmin === false) {
    redirect('/customer/bikes');
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Admin Portal
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {ADMIN_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {getIcon(item.icon)}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <Link
                href="/"
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b h-16 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn("md:hidden", sidebarOpen && "hidden")}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="ml-auto flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
                View Customer Site
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}