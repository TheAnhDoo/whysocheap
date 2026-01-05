const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '192.168.1.6' // Your local IP address
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  // Start Telegram bot polling automatically
  // Wait for Next.js to be ready, then start the bot directly
  setTimeout(async () => {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHAT_ID
      
      if (!botToken || !chatId) {
        console.warn('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID')
        return
      }

      // Try to start the bot directly by importing the module
      try {
        // Use dynamic import to load the TypeScript module
        const { telegramBot } = await import('./src/lib/telegramBot.js')
        console.log('🚀 Starting Telegram bot from server.js...')
        await telegramBot.startPolling()
        console.log('✅ Telegram bot polling started successfully')
      } catch (importError) {
        // Fallback: try using the API route if direct import fails
        console.log('⚠️ Direct import failed, trying API route...')
        try {
          const response = await fetch(`http://localhost:${port}/api/telegram-bot/start`, {
            method: 'POST'
          })
          if (response.ok) {
            console.log('✅ Telegram bot polling started via API route')
          } else {
            const errorText = await response.text()
            console.warn('⚠️ Could not start bot via API route:', errorText)
          }
        } catch (fetchError) {
          console.warn('⚠️ Could not start bot. It will start automatically via instrumentation.ts when using next dev/start')
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not initialize Telegram bot:', error.message)
    }
  }, 3000) // Wait 3 seconds for Next.js to compile

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> Accessible from your phone at http://${hostname}:${port}`)
    console.log(`> Make sure your phone is on the same Wi-Fi network`)
  })
})

