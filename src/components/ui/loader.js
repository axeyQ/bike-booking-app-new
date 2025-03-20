'use client';

import { cn } from '@/lib/utils';

export function Loader({ className, size = 'default' }) {
  return (
    <div 
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        size === 'sm' && "h-4 w-4",
        size === 'default' && "h-6 w-6",
        size === 'lg' && "h-8 w-8",
        size === 'xl' && "h-12 w-12",
        className
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}