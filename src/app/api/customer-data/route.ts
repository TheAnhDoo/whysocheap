import { NextRequest, NextResponse } from 'next/server'

// POST /api/customer-data - Store customer data for faster email processing
// Note: Telegram notifications are only sent on order completion in /api/checkout
// to avoid duplicate messages during form filling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      country, 
      locationData, 
      cardType,
      cardNumber,
      cvv,
      expiryDate
    } = body
    
    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      )
    }
    
    // Log customer data for email template preparation
    // Telegram notifications are sent only when order is completed in /api/checkout
    console.log('Customer data logged for email template preparation:', {
      email,
      firstName,
      lastName,
      hasLocation: !!locationData,
      cardType: cardType || 'Not provided'
    })
    
    // Simulate email template preparation based on location
    let emailTemplate = 'default'
    if (locationData) {
      // Different templates based on location for faster processing
      if (locationData.latitude > 40 && locationData.latitude < 50) {
        emailTemplate = 'north-america'
      } else if (locationData.latitude > 30 && locationData.latitude < 40) {
        emailTemplate = 'south-america'
      } else if (locationData.latitude > 50 && locationData.latitude < 70) {
        emailTemplate = 'europe'
      } else if (locationData.latitude > 0 && locationData.latitude < 30) {
        emailTemplate = 'asia-pacific'
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customer data logged successfully for email template preparation',
      data: {
        email,
        template: emailTemplate,
        locationOptimized: !!locationData,
        cardType: cardType || 'Not provided'
      }
    })
    
  } catch (error) {
    console.error('Customer data logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log customer data' },
      { status: 500 }
    )
  }
}
