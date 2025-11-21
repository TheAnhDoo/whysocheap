import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET() {
  try {
    const analytics = await databaseService.getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
