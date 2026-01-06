import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body
    
    if (!type || !['website', 'checkout', 'all'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    databaseService.clearTrackingData(type as 'website' | 'checkout' | 'all')
    const stats = databaseService.getTrackingStats()
    
    return NextResponse.json({ 
      success: true, 
      stats
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to clear tracking data' 
    }, { status: 500 })
  }
}

