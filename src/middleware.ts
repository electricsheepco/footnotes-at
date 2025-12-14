import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "fn_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

    if (!sessionToken) {
      // Redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Note: We can't validate the session token in middleware (no DB access)
    // The actual validation happens in the page/layout via requireAuth()
    // Middleware just checks for cookie presence as a quick gate
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /admin routes except static files
    "/admin/:path*",
    // Match /api/admin routes
    "/api/admin/:path*",
  ],
};
