export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on server-side
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    
    if (!botToken || !chatId) {
      console.warn('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID')
      return
    }

    // Wait a bit for Next.js to fully initialize
    setTimeout(async () => {
      try {
        const { telegramBot } = await import('./lib/telegramBot')
        
        // Check if bot is already running
        if (telegramBot.isRunning) {
          console.log('ℹ️ Telegram bot is already running')
          return
        }
        
        console.log('🚀 Auto-starting Telegram bot from instrumentation.ts...')
        await telegramBot.startPolling()
        console.log('✅ Telegram bot polling started automatically')
      } catch (error: any) {
        console.error('❌ Failed to auto-start Telegram bot:', error.message)
        console.error('Stack:', error.stack)
      }
    }, 2000) // Wait 2 seconds for Next.js to be ready
  }
}

