import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'
import { getLocationFromIP } from '@/lib/geolocation'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Tracking website visit...')
    
    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      request.headers.get('cf-connecting-ip') ||
                      request.headers.get('x-client-ip') ||
                      'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || request.headers.get('referrer') || 'unknown'
    
    // Get geolocation (async, don't wait)
    getLocationFromIP(ipAddress).then(geo => {
      // Track with detailed info (async, don't block response)
      databaseService.trackWebsiteVisitDetailed({
        ipAddress,
        countryCode: geo.countryCode,
        countryName: geo.country,
        city: geo.city,
        userAgent,
        referer,
        path: '/'
      })
    }).catch(err => {
      console.error('Geolocation error:', err)
      // Fallback: track without geolocation
      databaseService.trackWebsiteVisitDetailed({
        ipAddress,
        userAgent,
        referer,
        path: '/'
      })
    })
    
    // Also do simple tracking immediately (don't wait for geolocation)
    databaseService.trackWebsiteVisit()
    
    // Verify it was tracked
    const stats = databaseService.getTrackingStats()
    console.log('📊 Current stats after tracking:', stats)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Visit tracked',
      currentCount: stats.websiteVisits 
    }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error tracking visit:', error)
    console.error('Stack:', error.stack)
    // Return error details for debugging
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

