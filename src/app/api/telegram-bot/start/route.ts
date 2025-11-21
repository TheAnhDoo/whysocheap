import { NextResponse } from 'next/server'
import { telegramBot } from '@/lib/telegramBot'

// This API route starts the Telegram bot polling
// It can be called when the server starts, or manually
export async function POST() {
  try {
    await telegramBot.startPolling()
    return NextResponse.json({ success: true, message: 'Telegram bot polling started' })
  } catch (error: any) {
    console.error('Failed to start Telegram bot:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start bot' },
      { status: 500 }
    )
  }
}

// GET endpoint to check bot status
export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  
  return NextResponse.json({
    configured: !!(botToken && chatId),
    tokenLength: botToken?.length || 0,
    chatId: chatId ? 'set' : 'missing'
  })
}

