import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const countryStats = databaseService.getCountryStats()
    const totalVisits = countryStats.reduce((sum, stat) => sum + stat.visits, 0)
    
    // Calculate percentages
    const statsWithPercentage = countryStats.map(stat => ({
      ...stat,
      percentage: totalVisits > 0 ? ((stat.visits / totalVisits) * 100).toFixed(2) : '0.00'
    }))
    
    return NextResponse.json({
      success: true,
      countries: statsWithPercentage,
      totalVisits
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    console.error('Error getting country stats:', error)
    return NextResponse.json({
      success: true,
      countries: [],
      totalVisits: 0
    })
  }
}

