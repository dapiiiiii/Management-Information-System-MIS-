import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/features/auth/config/auth.config";

/**
 * Route guard stub for /app/*. An optimistic check only: it redirects
 * requests that carry no session cookie to sign in, preserving the
 * destination as ?next=. The backend remains responsible for validating
 * sessions and enforcing authorization on every request.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(authConfig.session.cookieName)) {
    const login = new URL(authConfig.routes.login, request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  // Keep signed-in pages out of shared and back/forward caches.
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/app/:path*"],
};
