'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VerifyEmailForm } from '@clerk/nextjs';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We`&apos;`ve sent a verification link to your email address. 
            Please check your inbox and click the link to verify your account.
          </p>
        </div>
        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <VerifyEmailForm />
          </div>
        </div>
      </div>
    </div>
  );
}