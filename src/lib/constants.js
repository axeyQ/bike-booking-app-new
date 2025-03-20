/**
 * Application constants
 */

// Bike types
export const BIKE_TYPES = [
    { id: 'mountain', label: 'Mountain Bike' },
    { id: 'road', label: 'Road Bike' },
    { id: 'city', label: 'City Bike' },
    { id: 'hybrid', label: 'Hybrid Bike' },
    { id: 'electric', label: 'Electric Bike' },
    { id: 'folding', label: 'Folding Bike' },
    { id: 'bmx', label: 'BMX Bike' },
    { id: 'kids', label: 'Kids Bike' },
  ];
  
  // Booking statuses and their colors
  export const BOOKING_STATUSES = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'clock',
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-green-100 text-green-800',
      icon: 'check-circle',
    },
    completed: {
      label: 'Completed',
      color: 'bg-blue-100 text-blue-800',
      icon: 'check-square',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: 'x-circle',
    },
  };
  
  // Frame sizes
  export const FRAME_SIZES = [
    { id: 'xs', label: 'Extra Small' },
    { id: 's', label: 'Small' },
    { id: 'm', label: 'Medium' },
    { id: 'l', label: 'Large' },
    { id: 'xl', label: 'Extra Large' },
  ];
  
  // Wheel sizes
  export const WHEEL_SIZES = [
    { id: '16', label: '16 inch' },
    { id: '20', label: '20 inch' },
    { id: '24', label: '24 inch' },
    { id: '26', label: '26 inch' },
    { id: '27.5', label: '27.5 inch' },
    { id: '29', label: '29 inch' },
    { id: '700c', label: '700c' },
  ];
  
  // Common bike brands
  export const BIKE_BRANDS = [
    'Trek',
    'Specialized',
    'Giant',
    'Cannondale',
    'Scott',
    'Merida',
    'Kona',
    'Cube',
    'BMC',
    'Bianchi',
    'Cervelo',
    'Santa Cruz',
    'Other',
  ];
  
  // Date format strings
  export const DATE_FORMATS = {
    default: 'PPP', // Mar 20, 2025
    compact: 'P', // 03/20/2025
    day: 'EEEE', // Thursday
    dayMonth: 'MMM d', // Mar 20
    monthYear: 'MMM yyyy', // Mar 2025
    time: 'p', // 10:15 AM
    dateTime: 'PPp', // Mar 20, 2025, 10:15 AM
    iso: 'yyyy-MM-dd', // 2025-03-20
  };
  
  // Time slots for booking (in minutes)
  export const TIME_SLOTS = [
    { id: 60, label: '1 hour' },
    { id: 120, label: '2 hours' },
    { id: 180, label: '3 hours' },
    { id: 240, label: '4 hours' },
    { id: 300, label: '5 hours' },
    { id: 360, label: '6 hours' },
    { id: 480, label: '8 hours' },
    { id: 720, label: '12 hours' },
    { id: 1440, label: '1 day' },
    { id: 2880, label: '2 days' },
    { id: 4320, label: '3 days' },
    { id: 7200, label: '5 days' },
    { id: 10080, label: '1 week' },
  ];
  
  // Navigation links for customer
  export const CUSTOMER_NAVIGATION = [
    { name: 'Browse Bikes', href: '/customer/bikes' },
    { name: 'My Bookings', href: '/customer/bookings' },
    { name: 'Profile', href: '/customer/profile' },
  ];
  
  // Navigation links for admin
  export const ADMIN_NAVIGATION = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'home' },
    { name: 'Bikes', href: '/admin/bikes', icon: 'bike' },
    { name: 'Bookings', href: '/admin/bookings', icon: 'calendar' },
    { name: 'Reports', href: '/admin/reports', icon: 'bar-chart-2' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];
  
  // Report types
  export const REPORT_TYPES = [
    { id: 'revenue', label: 'Revenue Report' },
    { id: 'bookings', label: 'Booking Report' },
    { id: 'bikes', label: 'Bike Utilization Report' },
    { id: 'customers', label: 'Customer Activity Report' },
  ];
  
  // Time periods for reports
  export const REPORT_PERIODS = [
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'quarter', label: 'Last 90 Days' },
    { id: 'year', label: 'Last 365 Days' },
    { id: 'custom', label: 'Custom Range' },
  ];