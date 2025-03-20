'use client';

import { ConvexClientProvider } from './convex-provider';
import { ClerkConvexAdapter } from './clerk-provider';
import { ToastProvider } from './toastify-provider';

export function Providers({ children }) {
  return (
    <ConvexClientProvider>
      <ClerkConvexAdapter>
        {children}
        <ToastProvider />
      </ClerkConvexAdapter>
    </ConvexClientProvider>
  );
}