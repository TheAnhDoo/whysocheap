import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function GET() {
  try {
    const analytics = databaseService.getAnalytics()
    return NextResponse.json(analytics)
  } catch (error: any) {
    // Return empty analytics if database isn't ready (e.g., during build)
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalKeylogs: 0
    })
  }
}
