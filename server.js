const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '192.168.1.6' // Your local IP address
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  // Start Telegram bot polling (no webhook needed)
  // Wait for Next.js to be ready, then try to load the bot
  setTimeout(async () => {
    try {
      // For TypeScript files, we need to wait for compilation or use a different approach
      // Try accessing through Next.js internal API routes
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHAT_ID
      
      if (!botToken || !chatId) {
        console.warn('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID')
        return
      }

      // Start the bot by calling an internal API route that handles it
      // This works because API routes can use TypeScript directly
      try {
        const response = await fetch(`http://localhost:${port}/api/telegram-bot/start`, {
          method: 'POST'
        })
        if (response.ok) {
          console.log('✅ Telegram bot polling started via API route')
        } else {
          console.warn('⚠️ Could not start bot via API route')
        }
      } catch (e) {
        console.warn('⚠️ Bot will start automatically when API route is accessed')
        console.warn('⚠️ Or manually trigger: POST /api/telegram-bot/start')
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

