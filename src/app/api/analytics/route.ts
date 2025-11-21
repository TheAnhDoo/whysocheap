import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function GET() {
  try {
    const analytics = databaseService.getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
