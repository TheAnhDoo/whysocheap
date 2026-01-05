import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function GET(request: NextRequest) {
  try {
    const stats = databaseService.getTrackingStats()

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error: any) {
    console.error('Error getting stats:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

