import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only track homepage visits
  if (request.nextUrl.pathname === '/') {
    // Track visit asynchronously (don't block the request)
    // Use a fire-and-forget approach
    fetch(`${request.nextUrl.origin}/api/tracking/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward important headers for IP detection
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
        'cf-connecting-ip': request.headers.get('cf-connecting-ip') || '',
        'user-agent': request.headers.get('user-agent') || '',
        'referer': request.headers.get('referer') || request.headers.get('referrer') || '',
      },
      body: JSON.stringify({ path: '/' })
    }).catch(() => {
      // Silently fail - don't block the request
    })
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
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}

