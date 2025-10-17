// Middleware disabled - authentication handled by AuthWrapper component
import { NextResponse } from "next/server";

export function middleware() {
  // Allow all requests to pass through
  // Authentication is handled by the AuthWrapper component in the client
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
