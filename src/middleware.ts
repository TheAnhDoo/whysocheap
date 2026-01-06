import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Note: Tracking is now handled client-side for better reliability
  // Middleware in Edge Runtime has limitations with database access
  // Client-side tracking ensures it works in all environments
  
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
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}

