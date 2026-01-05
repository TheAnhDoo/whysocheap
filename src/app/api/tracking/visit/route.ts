import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    // Support both JSON body and headers (for middleware)
    let path = '/'
    let ipAddress = 'unknown'
    let userAgent = 'unknown'
    let referer = 'unknown'

    try {
      const body = await request.json()
      path = body.path || '/'
    } catch {
      // If no JSON body, use path from URL or default
      path = request.nextUrl?.pathname || '/'
    }

    // Get IP from headers (prioritize forwarded headers for production)
    ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                request.headers.get('x-real-ip') || 
                request.headers.get('cf-connecting-ip') || // Cloudflare
                request.headers.get('x-client-ip') ||
                'unknown'
    
    userAgent = request.headers.get('user-agent') || 'unknown'
    referer = request.headers.get('referer') || request.headers.get('referrer') || 'unknown'

    // Track visit (deduplication happens inside trackWebsiteVisit)
    databaseService.trackWebsiteVisit({
      ipAddress,
      userAgent,
      referer,
      path: path || '/'
    })

    // Return success immediately (don't wait for database)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error tracking visit:', error)
    // Still return success to not block the request
    return NextResponse.json({ success: false, error: error.message }, { status: 200 })
  }
}

