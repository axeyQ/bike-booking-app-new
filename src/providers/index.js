'use client';

import { ConvexClientProvider } from './convex-provider';
import { UserProvider } from './user-provider';
import { ToastProvider } from './toastify-provider';

export function Providers({ children }) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        {children}
        <ToastProvider />
      </UserProvider>
    </ConvexClientProvider>
  );
}