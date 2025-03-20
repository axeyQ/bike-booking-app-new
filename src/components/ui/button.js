"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(
  ({ className, children, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "slot" : "button";
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50",
          
          // Variants
          variant === "default" && 
            "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow hover:from-blue-700 hover:to-cyan-600",
          variant === "outline" && 
            "border border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50",
          variant === "secondary" && 
            "bg-blue-100 text-blue-900 hover:bg-blue-200",
          variant === "ghost" && 
            "bg-transparent text-blue-700 hover:bg-blue-50",
          variant === "link" && 
            "bg-transparent text-blue-700 underline-offset-4 hover:underline",
          
          // Sizes
          size === "default" && "h-9 px-4 py-2",
          size === "sm" && "h-8 rounded-md px-3 text-sm",
          size === "lg" && "h-12 rounded-md px-6 text-lg",
          size === "icon" && "h-9 w-9",
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };