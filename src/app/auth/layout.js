import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <span className="text-xl font-bold">Bike Booking</span>
        </Link>
      </div>
      {children}
    </div>
  );
}