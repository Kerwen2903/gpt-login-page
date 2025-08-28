import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/chat", "/profile"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if user is trying to access a protected route
  if (isProtectedRoute) {
    // In middleware, we can't access localStorage directly
    // We'll handle this in the client-side component
    return NextResponse.next()
  }

  return NextResponse.next()
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
}
