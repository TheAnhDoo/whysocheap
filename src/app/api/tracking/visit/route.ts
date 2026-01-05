import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'

    databaseService.trackWebsiteVisit({
      ipAddress,
      userAgent,
      referer,
      path: path || '/'
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

