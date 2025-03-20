'use client';

import { AuthProvider } from './clerk-provider';
import { ConvexClientProvider } from './convex-provider';
import { ToastProvider } from './toastify-provider';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ConvexClientProvider>
        {children}
        <ToastProvider />
      </ConvexClientProvider>
    </AuthProvider>
  );
}