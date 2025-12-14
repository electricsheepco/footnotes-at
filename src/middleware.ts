import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "fn_session";

// Routes that require authentication (quick gate - actual validation in pages)
const PROTECTED_PATTERNS = [
  /^\/[^/]+\/write$/, // /:handle/write
  /^\/[^/]+\/edit\/[^/]+$/, // /:handle/edit/:id
  /^\/[^/]+\/footnotes$/, // /:handle/footnotes
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route matches a protected pattern
  const isProtected = PROTECTED_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  if (isProtected) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

    if (!sessionToken) {
      // Redirect to login with next param
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `/@${pathname.slice(1)}`);
      return NextResponse.redirect(loginUrl);
    }

    // Note: We can't validate the session token in middleware (no DB access)
    // The actual validation happens in the page via getSession()
  }

  // Protect API routes that modify data
  if (pathname.startsWith("/api/footnotes")) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match user-scoped write/edit/footnotes routes
    "/:handle/write",
    "/:handle/edit/:id*",
    "/:handle/footnotes",
    // Match API routes
    "/api/footnotes/:path*",
  ],
};
