'use client';

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkConvexAdapter } from "./clerk-provider";

// Create a Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProvider client={convex}>
      <ClerkConvexAdapter>
        {children}
      </ClerkConvexAdapter>
    </ConvexProvider>
  );
}