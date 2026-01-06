import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'
import { getLocationFromIP } from '@/lib/geolocation'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Track recent messages to prevent duplicates (within 10 seconds)
const recentCheckoutMessages = new Map<string, number>()

async function sendTelegramNotification(ipAddress: string) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    
    if (!botToken || !chatId) {
      return // Skip if not configured
    }

    // Create a unique key based on IP and time (rounded to 10 seconds)
    const timeKey = Math.floor(Date.now() / 10000)
    const messageKey = `${ipAddress}-${timeKey}`
    
    // Check if we've sent this message recently
    const lastSent = recentCheckoutMessages.get(messageKey)
    const now = Date.now()
    
    if (lastSent && (now - lastSent) < 10000) {
      // Message was sent within last 10 seconds, skip
      return
    }
    
    // Mark as sent
    recentCheckoutMessages.set(messageKey, now)
    
    // Clean up old entries (older than 1 minute)
    for (const [key, timestamp] of recentCheckoutMessages.entries()) {
      if (now - timestamp > 60000) {
        recentCheckoutMessages.delete(key)
      }
    }

    // Get language preference
    const { telegramBot } = await import('@/lib/telegramBot')
    const language = telegramBot.getUserLanguageForChat(chatId) || 'vi'
    
    const messages = {
      en: `🛒 <b>Checkout Visit</b>\n\nSomeone navigated to checkout page.\n\nIP: ${ipAddress}\nTime: ${new Date().toLocaleString()}`,
      vi: `🛒 <b>Khách truy cập trang thanh toán</b>\n\nCó người đã vào trang thanh toán.\n\nIP: ${ipAddress}\nThời gian: ${new Date().toLocaleString('vi-VN')}`
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messages[language as 'en' | 'vi'] || messages.vi,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    })
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    // Don't fail the request if Telegram fails
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for Telegram notification and tracking
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      request.headers.get('cf-connecting-ip') ||
                      'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || request.headers.get('referrer') || 'unknown'
    
    // Track immediately (increment counter)
    databaseService.trackCheckoutVisit()
    
    // Get geolocation and track detailed info (async, don't wait)
    getLocationFromIP(ipAddress).then(geo => {
      // Track with detailed info (async, don't block response)
      databaseService.trackCheckoutVisitDetailed({
        ipAddress,
        countryCode: geo.countryCode,
        countryName: geo.country,
        city: geo.city,
        userAgent,
        referer
      })
    }).catch(err => {
      console.error('Geolocation error:', err)
      // Fallback: track without geolocation (but don't increment counter again)
      databaseService.trackCheckoutVisitDetailed({
        ipAddress,
        userAgent,
        referer
      })
    })
    
    // Send Telegram notification (await so it doesn't get dropped when request completes)
    try {
      await sendTelegramNotification(ipAddress)
    } catch (err) {
      console.error('❌ Telegram notification error:', err)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error tracking checkout:', error)
    console.error('Stack:', error.stack)
    // Still return success to not block the request
    return NextResponse.json({ success: false, error: error.message }, { status: 200 })
  }
}

