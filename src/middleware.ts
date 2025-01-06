import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // '/api/:path*', // Catch-all for API routes
  ],
};

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  return;
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
