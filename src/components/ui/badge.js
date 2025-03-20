'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && 
          "border-transparent bg-blue-100 text-blue-700",
        variant === "secondary" && 
          "border-transparent bg-gray-100 text-gray-700",
        variant === "success" && 
          "border-transparent bg-green-100 text-green-700",
        variant === "destructive" && 
          "border-transparent bg-red-100 text-red-700",
        variant === "outline" && 
          "border-blue-200 text-blue-700",
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };