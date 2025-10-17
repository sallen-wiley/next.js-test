// Environment-based access control middleware
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for public assets and API routes that should be public
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/api/health") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Environment-based access control
  const environment = process.env.NODE_ENV || "development";
  const allowPublicAccess = process.env.ALLOW_PUBLIC_ACCESS === "true";
  const requireAuth = process.env.REQUIRE_AUTH === "true";

  // Development mode - allow all access by default
  if (environment === "development" && !requireAuth) {
    return NextResponse.next();
  }

  // Production mode or explicit auth requirement
  if (environment === "production" || requireAuth) {
    // Check for simple auth token
    const authCookie = request.cookies.get("reviewer_auth");
    const authHeader = request.headers.get("authorization");

    if (!authCookie && !authHeader && !allowPublicAccess) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

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
