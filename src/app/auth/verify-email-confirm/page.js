'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export default function VerifyEmailConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to customer dashboard after a short delay
    const redirectTimer = setTimeout(() => {
      router.push('/customer/bikes');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified Successfully
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email has been verified. You`&apos;`ll be redirected to the dashboard shortly.
          </p>
          <div className="mt-6 flex justify-center">
            <Loader size="lg" className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}