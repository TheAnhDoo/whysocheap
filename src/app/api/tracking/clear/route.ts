import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json() // 'website', 'checkout', or 'all'
    
    if (!type || !['website', 'checkout', 'all'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    databaseService.clearTrackingData(type as 'website' | 'checkout' | 'all')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error clearing tracking data:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

