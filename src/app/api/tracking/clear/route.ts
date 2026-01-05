import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body // 'website', 'checkout', or 'all'
    
    console.log('🧹 Clearing tracking data, type:', type)
    
    if (!type || !['website', 'checkout', 'all'].includes(type)) {
      console.error('❌ Invalid type:', type)
      return NextResponse.json({ success: false, error: 'Invalid type. Must be "website", "checkout", or "all"' }, { status: 400 })
    }

    // Clear the data
    databaseService.clearTrackingData(type as 'website' | 'checkout' | 'all')
    
    console.log('✅ Tracking data cleared successfully, type:', type)

    return NextResponse.json({ success: true, message: `Cleared ${type} tracking data` })
  } catch (error: any) {
    console.error('❌ Error clearing tracking data:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to clear tracking data' 
    }, { status: 500 })
  }
}

