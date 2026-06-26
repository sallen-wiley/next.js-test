// Middleware disabled - authentication handled by AuthWrapper component
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // DevTools can request original TypeScript sources from Supabase sourcemaps.
  // Rewrite these requests to a dev-only API route so they do not 404/noise logs.
  if (
    process.env.NODE_ENV === "development" &&
    (pathname.startsWith("/src/") ||
      pathname.startsWith("/_next/src/") ||
      pathname === "/_next/internal/helpers.ts" ||
      pathname === "/_next/static/runtime.ts")
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/api/dev-source";
    rewriteUrl.searchParams.set("p", pathname);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-dev-source-path", pathname);

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

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
    "/_next/static/runtime.ts",
  ],
};
