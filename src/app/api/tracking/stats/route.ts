import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Force fresh read - no caching
    // Add a small delay to ensure any pending writes are committed
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const stats = databaseService.getTrackingStats()
    console.log('📊 Stats API returning (fresh read):', stats)
    console.log('📊 Stats API timestamp:', Date.now())
    
    const response = NextResponse.json({
      success: true,
      stats,
      timestamp: Date.now() // Add timestamp to verify freshness
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff'
      }
    })
    
    return response
  } catch (error: any) {
    console.error('❌ Error in stats API:', error)
    return NextResponse.json({ 
      success: true, 
      stats: {
        websiteVisits: 0,
        checkoutVisits: 0,
        completedOrders: 0,
        estimatedBuyers: 0,
        conversionRate: '0.00'
      },
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

