import { clerkMiddleware } from '@clerk/nextjs/server'
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhook(.*)",
  ],
  
  // Routes that can be accessed while signed in or not
  ignoredRoutes: [
    "/api/webhook(.*)",
  ],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};