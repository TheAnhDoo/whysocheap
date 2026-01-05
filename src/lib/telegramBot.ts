import { telegramService } from './telegramService'

interface TelegramConfig {
  botToken: string
  chatId: string // Primary chat ID for sending messages
  authorizedChatIds: string[] // All authorized chat IDs (can send commands)
}

type Language = 'en' | 'vi'

interface Translations {
  welcome: string
  dataExportAssistant: string
  whatICanDo: string
  extractExport: string
  generateExcel: string
  quickAccess: string
  quickActions: string
  useButtons: string
  availableCommands: string
  extractedJsonDesc: string
  newDataDesc: string
  helpMenu: string
  startBot: string
  tip: string
  selectTimePeriod: string
  chooseTimeBack: string
  veryRecent: string
  recent: string
  lastHour: string
  last3Hours: string
  last6Hours: string
  last12Hours: string
  last24Hours: string
  clickButton: string
  helpSupport: string
  howToUse: string
  clickExtract: string
  excelSent: string
  useHelp: string
  commands: string
  extractedJsonCmd: string
  newDataCmd: string
  questions: string
  contactAdmin: string
  unknownCommand: string
  analyticsComingSoon: string
  dataRefreshed: string
  readyToExtract: string
}

class TelegramBot {
  private pollingInterval: NodeJS.Timeout | null = null
  private lastUpdateId: number = 0
  public isRunning: boolean = false
  private userLanguages: Map<string, Language> = new Map() // chatId -> language

  constructor() {
    console.log('✅ Telegram bot initialized for polling')
  }

  private getUserLanguage(chatId: string): Language {
    // Normalize chat ID to string for consistent lookups
    const normalizedChatId = String(chatId)
    return this.userLanguages.get(normalizedChatId) || 'vi' // Default to Vietnamese
  }

  // Public method to get language for a chat ID (used by telegramService)
  public getUserLanguageForChat(chatId: string): Language {
    // Normalize chat ID to string for consistent lookups
    const normalizedChatId = String(chatId)
    const language = this.userLanguages.get(normalizedChatId) || 'vi' // Default to Vietnamese
    console.log(`📝 Language lookup - Chat ID: ${normalizedChatId}, Language: ${language}, Available languages:`, Array.from(this.userLanguages.entries()))
    return language
  }

  private setUserLanguage(chatId: string, lang: Language): void {
    // Normalize chat ID to string for consistent storage
    const normalizedChatId = String(chatId)
    this.userLanguages.set(normalizedChatId, lang)
    console.log(`📝 Language set - Chat ID: ${normalizedChatId}, Language: ${lang}`)
  }

  // Set language for ALL chats (primary + authorized)
  private async setLanguageForAllChats(lang: Language): Promise<void> {
    const config = await this.getConfig()
    const chatIdsToSet: string[] = []
    
    // Add primary chat ID
    if (config.chatId) {
      const primaryId = String(config.chatId).trim()
      chatIdsToSet.push(primaryId)
      console.log(`📝 Adding primary chat ID: ${primaryId}`)
    }
    
    // Add all authorized chat IDs from config
    for (const chatId of config.authorizedChatIds) {
      const normalizedId = String(chatId).trim()
      if (normalizedId && !chatIdsToSet.includes(normalizedId)) {
        chatIdsToSet.push(normalizedId)
        console.log(`📝 Adding authorized chat ID: ${normalizedId}`)
      }
    }
    
    // Remove duplicates
    const uniqueChatIds = Array.from(new Set(chatIdsToSet))
    
    console.log(`📝 Setting language for ${uniqueChatIds.length} chat IDs: ${uniqueChatIds.join(', ')}`)
    
    // Set language for all chats
    for (const chatId of uniqueChatIds) {
      const normalizedChatId = String(chatId).trim()
      this.setUserLanguage(normalizedChatId, lang)
    }
    
    console.log(`🌐 ✅ Language set to ${lang === 'vi' ? 'Vietnamese' : 'English'} for ALL chats (${uniqueChatIds.length} chats)`)
    console.log(`🌐 ✅ Set chat IDs: ${uniqueChatIds.join(', ')}`)
    
    // Verify by checking what's stored
    console.log(`🌐 ✅ Verification - Current language map:`, Array.from(this.userLanguages.entries()))
  }

  private getTranslations(lang: Language): Translations {
    if (lang === 'vi') {
      return {
        welcome: 'Chào mừng đến với Credit Data Bot!',
        dataExportAssistant: 'Trợ lý Xuất Dữ liệu của Bạn',
        whatICanDo: 'Tôi có thể làm gì:',
        extractExport: 'Trích xuất và xuất tất cả dữ liệu thẻ (Tất cả thời gian)',
        generateExcel: 'Tạo file Excel với tất cả thông tin thẻ',
        quickAccess: 'Cung cấp quyền truy cập nhanh vào phân tích cửa hàng',
        quickActions: 'Hành động Nhanh:',
        useButtons: 'Sử dụng các nút bên dưới để bắt đầu!',
        availableCommands: 'Lệnh Có sẵn:',
        extractedJsonDesc: '/extracted_json - Tải xuống tất cả dữ liệu thẻ đã thu thập dưới dạng Excel',
        newDataDesc: '/new_data - Chỉ tải xuống dữ liệu thẻ mới/cập nhật (24 giờ qua)',
        helpMenu: '/help - Hiển thị menu trợ giúp này',
        startBot: '/start - Khởi động bot và hiển thị thông điệp chào mừng',
        tip: 'Mẹo: Nhấp vào các nút bên dưới để truy cập nhanh hơn!',
        selectTimePeriod: 'Chọn Khoảng thời gian',
        chooseTimeBack: 'Chọn khoảng thời gian để lấy dữ liệu:',
        veryRecent: '⏰ <b>10 phút</b> - Dữ liệu rất gần đây',
        recent: '⏰ <b>30 phút</b> - Dữ liệu gần đây',
        lastHour: '⏰ <b>1 giờ</b> - Giờ vừa qua',
        last3Hours: '⏰ <b>3 giờ</b> - 3 giờ qua',
        last6Hours: '⏰ <b>6 giờ</b> - 6 giờ qua',
        last12Hours: '⏰ <b>12 giờ</b> - 12 giờ qua',
        last24Hours: '⏰ <b>24 giờ</b> - 24 giờ qua (mặc định)',
        clickButton: 'Nhấp vào nút bên dưới để tải xuống:',
        helpSupport: 'Trợ giúp & Hỗ trợ',
        howToUse: 'Cách sử dụng:',
        clickExtract: '1. Nhấp "📊 Extract JSON" để tải xuống tất cả dữ liệu đơn hàng',
        excelSent: '2. File Excel sẽ được gửi đến cuộc trò chuyện đã cấu hình',
        useHelp: '3. Sử dụng /help bất cứ lúc nào để được hỗ trợ',
        commands: 'Lệnh:',
        extractedJsonCmd: '• /extracted_json - Tải xuống tất cả dữ liệu',
        newDataCmd: '• /new_data - Chỉ tải xuống dữ liệu mới (24h qua)',
        questions: 'Câu hỏi?',
        contactAdmin: 'Liên hệ quản trị viên của bạn để được hỗ trợ.',
        unknownCommand: 'Lệnh không xác định. Sử dụng /help để xem các lệnh có sẵn.',
        analyticsComingSoon: 'Tính năng Phân tích sắp ra mắt!',
        dataRefreshed: 'Dữ liệu đã được làm mới! Sử dụng 📊 Extract JSON để tải xuống dữ liệu mới nhất.',
        readyToExtract: 'Sẵn sàng trích xuất?'
      }
    }
    
    // English (default)
    return {
      welcome: 'Welcome to Credit Data Bot!',
      dataExportAssistant: 'Your Data Export Assistant',
      whatICanDo: 'What I can do:',
      extractExport: 'Extract and export all credit card data (All time)',
      generateExcel: 'Generate Excel files with all customer information',
      quickAccess: 'Provide quick access to your store analytics',
      quickActions: 'Quick Actions:',
      useButtons: 'Use the buttons below to get started!',
      availableCommands: 'Available Commands:',
      extractedJsonDesc: '/extracted_json - Download all credit card data as Excel',
      newDataDesc: '/new_data - Download only new/updated credit card data (last 24 hours)',
      helpMenu: '/help - Show this help menu',
      startBot: '/start - Start the bot and show welcome message',
      tip: 'Tip: Click the buttons below for faster access!',
      selectTimePeriod: 'Select Time Period',
      chooseTimeBack: 'Choose how far back to fetch data:',
      veryRecent: '⏰ <b>10 minutes</b> - Very recent data',
      recent: '⏰ <b>30 minutes</b> - Recent data',
      lastHour: '⏰ <b>1 hour</b> - Last hour',
      last3Hours: '⏰ <b>3 hours</b> - Last 3 hours',
      last6Hours: '⏰ <b>6 hours</b> - Last 6 hours',
      last12Hours: '⏰ <b>12 hours</b> - Last 12 hours',
      last24Hours: '⏰ <b>24 hours</b> - Last 24 hours (default)',
      clickButton: 'Click a button below to download:',
      helpSupport: 'Help & Support',
      howToUse: 'How to use:',
      clickExtract: '1. Click "📊 Extract JSON" to download all order data',
      excelSent: '2. Excel file will be sent to the configured chat',
      useHelp: '3. Use /help anytime for assistance',
      commands: 'Commands:',
      extractedJsonCmd: '• /extracted_json - Download all data',
      newDataCmd: '• /new_data - Download only new data (last 24h)',
      questions: 'Questions?',
      contactAdmin: 'Contact your administrator for support.',
      unknownCommand: 'Unknown command. Use /help to see available commands.',
      analyticsComingSoon: 'Analytics Feature coming soon!',
      dataRefreshed: 'Data refreshed! Use 📊 Extract JSON to download the latest data.',
      readyToExtract: 'Ready to extract?'
    }
  }

  private async getConfig(): Promise<TelegramConfig> {
    // Re-read config dynamically
    const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
    const chatId = process.env.TELEGRAM_CHAT_ID || ''
    
    // Parse multiple authorized chat IDs (comma or space separated)
    // Format: TELEGRAM_AUTHORIZED_CHAT_IDS="id1,id2,id3" or just use TELEGRAM_CHAT_ID for single
    const authorizedIdsStr = process.env.TELEGRAM_AUTHORIZED_CHAT_IDS || chatId || ''
    const authorizedChatIds = authorizedIdsStr
      .split(/[,\s]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0)
    
    // Primary chat ID for sending responses (use TELEGRAM_CHAT_ID or first from authorized list)
    const primaryChatId = chatId || authorizedChatIds[0] || ''
    
    return { 
      botToken, 
      chatId: primaryChatId, // Primary chat ID to send messages to
      authorizedChatIds // All chat IDs that can send commands
    }
  }

  public async sendMessage(chatId: string, text: string, parseMode: string = 'Markdown'): Promise<boolean> {
    try {
      const config = await this.getConfig()
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode,
            disable_web_page_preview: true
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return response.ok
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name !== 'AbortError') {
          console.error('❌ Telegram send error:', fetchError.message)
        }
        return false
      }
    } catch (error) {
      console.error('❌ Telegram send message error:', error)
      return false
    }
  }

  private async sendMessageWithKeyboard(chatId: string, text: string, keyboard: any, parseMode: string = 'Markdown'): Promise<boolean> {
    try {
      const config = await this.getConfig()
      if (!config.botToken) {
        console.error('❌ Cannot send message: bot token missing')
        return false
      }
      
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      try {
        const requestBody = {
          chat_id: chatId,
          text,
          parse_mode: parseMode,
          reply_markup: keyboard,
          disable_web_page_preview: true
        }
        
        console.log('📤 Sending message with keyboard to chat:', chatId)
        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2).replace(config.botToken, '***'))
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Telegram API error:', response.status, errorText)
          try {
            const errorJson = JSON.parse(errorText)
            console.error('❌ Error details:', errorJson)
          } catch {
            // Not JSON
          }
        } else {
          const result = await response.json()
          console.log('✅ Message sent successfully:', result.ok ? 'OK' : 'Failed')
        }
        
        return response.ok
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name !== 'AbortError') {
          console.error('❌ Telegram send error:', fetchError.message)
        }
        return false
      }
    } catch (error: any) {
      console.error('❌ Telegram send message error:', error.message || error)
      return false
    }
  }

  private async sendDocument(chatId: string, fileBuffer: Buffer, filename: string): Promise<boolean> {
    try {
      const config = await this.getConfig()
      
      // Use form-data library for Node.js file uploads
      const FormData = require('form-data')
      const formData = new FormData()
      
      // Append file as buffer with proper options
      formData.append('document', fileBuffer, {
        filename: filename,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        knownLength: fileBuffer.length
      })
      formData.append('chat_id', chatId)
      formData.append('caption', `📊 Extracted JSON Data - ${filename}`)

      const url = `https://api.telegram.org/bot${config.botToken}/sendDocument`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout for file upload

      try {
        // Get headers from form-data (includes boundary and content-type)
        const headers = formData.getHeaders()
        
        // Use Node.js built-in https module for proper form-data handling
        const https = require('https')
        const { URL } = require('url')
        const urlObj = new URL(url)
        
        const response = await new Promise<any>((resolve, reject) => {
          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: headers
          }

          const req = https.request(options, (res: any) => {
            const chunks: Buffer[] = []
            res.on('data', (chunk: Buffer) => chunks.push(chunk))
            res.on('end', () => {
              const responseText = Buffer.concat(chunks).toString()
              const responseObj = {
                ok: res.statusCode === 200,
                status: res.statusCode,
                text: async () => responseText,
                json: async () => {
                  try {
                    return JSON.parse(responseText)
                  } catch {
                    return { error: responseText }
                  }
                }
              }
              resolve(responseObj)
            })
          })

          req.on('error', (error: any) => {
            clearTimeout(timeoutId)
            reject(error)
          })

          // Pipe form-data to request
          formData.pipe(req)
        })

        clearTimeout(timeoutId)
        
        if (response.ok) {
          const result = await response.json()
          if (result.ok) {
            console.log('✅ Excel file sent to Telegram successfully')
            return true
          } else {
            console.error('❌ Telegram API returned error:', result)
            return false
          }
        } else {
          const errorText = await response.text()
          let errorMessage = errorText
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.description || (errorJson.error_code ? `Error ${errorJson.error_code}: ${errorJson.description}` : errorText)
            console.error('❌ Telegram API error:', errorJson)
          } catch {
            // Not JSON, use as is
          }
          console.error('❌ Failed to send document. Status:', response.status)
          console.error('❌ Error details:', errorMessage)
          return false
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        console.error('❌ Telegram send document error:', fetchError.message)
        if (fetchError.code) {
          console.error('❌ Error code:', fetchError.code)
        }
        return false
      }
    } catch (error: any) {
      console.error('❌ Telegram send document error:', error.message || error)
      return false
    }
  }

  private async getUpdates(): Promise<any[]> {
    try {
      const config = await this.getConfig()
      if (!config.botToken) {
        console.warn('⚠️ No bot token configured for getUpdates')
        return []
      }

      const url = `https://api.telegram.org/bot${config.botToken}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=10&allowed_updates=["message","callback_query"]`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s timeout
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (!data.ok) {
            console.error('❌ Telegram API error:', data.description)
            // If webhook is set, we'll get an error - try to remove it
            if (data.description?.includes('webhook') || data.description?.includes('conflict')) {
              console.log('🔄 Webhook detected, attempting to remove...')
              await this.removeWebhook(config.botToken)
            }
            return []
          }
          return data.result || []
        } else {
          const errorText = await response.text()
          console.error('❌ getUpdates failed:', response.status, errorText)
          return []
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name !== 'AbortError') {
          console.error('❌ Telegram getUpdates error:', fetchError.message)
        }
        return []
      }
    } catch (error) {
      console.error('❌ Telegram getUpdates error:', error)
      return []
    }
  }

  private async handleCommand(update: any): Promise<void> {
    const message = update.message
    if (!message || !message.text) {
      console.log('⚠️ No message or text in update:', update)
      return
    }

    const command = message.text.trim().toLowerCase()
    const senderChatId = String(message.chat.id)

    console.log(`📩 Received command: "${command}" from chat ID: ${senderChatId}`)

    const config = await this.getConfig()
    
    // Check if sender is authorized to send commands
    const isAuthorized = config.authorizedChatIds.length === 0 || config.authorizedChatIds.includes(senderChatId)
    
    if (!isAuthorized) {
      console.log(`⚠️ Unauthorized chat: ${senderChatId} (authorized: ${config.authorizedChatIds.join(', ') || 'none'})`)
      // Only send error to sender if they're not authorized
      if (config.chatId) {
        await this.sendMessage(senderChatId, `❌ Unauthorized. Your Chat ID: ${senderChatId}\n\nAdd this to TELEGRAM_AUTHORIZED_CHAT_IDS in your .env.local file.`)
      }
      return
    }

    // Log authorized command from any authorized chat
    console.log(`✅ Authorized command from chat ID: ${senderChatId}`)

    // For /start and /help, we should always respond even without primary chatId
    // These are interactive commands that should go to the sender
    if (command === '/start' || command === '/help' || command === '/start@spamditbot' || command === '/help@spamditbot') {
      console.log(`🔧 Handling ${command} command`)
      
      const lang = this.getUserLanguage(senderChatId)
      const t = this.getTranslations(lang)
      
      // Interactive welcome message with keyboard (using HTML for better compatibility)
      const helpText = `
🤖 <b>${t.welcome}</b> 🤖

🌟 <b>${t.dataExportAssistant}</b>

<b>📊 ${t.whatICanDo}</b>
• ${t.extractExport}
• ${t.generateExcel}
• ${t.quickAccess}

<b>⚡ ${t.quickActions}</b>
${t.useButtons}

<b>📋 ${t.availableCommands}</b>
${t.extractedJsonDesc}
${t.newDataDesc}
${t.helpMenu}
${t.startBot}
💡 <i>${t.tip}</i>
      `.trim()
      
      // Create interactive keyboard with more buttons
      const keyboard = {
        keyboard: [
          [
            { text: '📊 Extract JSON' },
            { text: '🆕 New Data' }
          ],
          [
            { text: '📈 Get Analytics' },
            { text: '📊 Get Stats' }
          ],
          [
            { text: '🔄 Refresh Data' },
            { text: '❓ Help' }
          ],
          [
            { text: lang === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt' }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
      
      // Send to sender for interactive experience
      try {
        await this.sendMessageWithKeyboard(senderChatId, helpText, keyboard, 'HTML')
        console.log(`✅ Sent ${command} response to chat ${senderChatId}`)
      } catch (error: any) {
        console.error(`❌ Failed to send ${command} response:`, error.message)
      }
      return
    }

    // Handle language selection - Set for ALL chats
    if (command === '🇻🇳 tiếng việt' || command === 'tiếng việt' || command === '🇻🇳 tiếng việt@spamditbot') {
      // Set Vietnamese for ALL chats (primary + authorized)
      await this.setLanguageForAllChats('vi')
      const t = this.getTranslations('vi')
      await this.sendMessage(senderChatId, `✅ Đã chuyển sang Tiếng Việt cho tất cả các kênh!\n\n${t.welcome}\n\nGửi /start để xem menu.`, 'HTML')
      return
    } else if (command === '🇬🇧 english' || command === 'english' || command === '🇬🇧 english@spamditbot') {
      // Set English for ALL chats (primary + authorized)
      await this.setLanguageForAllChats('en')
      const t = this.getTranslations('en')
      await this.sendMessage(senderChatId, `✅ Switched to English for all channels!\n\n${t.welcome}\n\nSend /start to see the menu.`, 'HTML')
      return
    }

    // If no primary chatId is configured, log it for easy setup (for other commands)
    if (!config.chatId) {
      console.log(`💡 Received command "${command}" from chat ID: ${senderChatId} - Add this to TELEGRAM_CHAT_ID in .env.local`)
      await this.sendMessage(senderChatId, `💡 Bot is working! Your Chat ID is: ${senderChatId}\n\nAdd this to your .env.local file:\nTELEGRAM_CHAT_ID=${senderChatId}`)
      return
    }

    // Always send responses to the primary chat ID (config.chatId), not the sender
    // This way multiple people can trigger commands, but all responses go to one chat
    const responseChatId = config.chatId

    if (command === '/extracted_json' || command === '/extracted json' || command === '/extractjson' || command ==='/extracted_json@spamditbot') {
      // Send result to primary chat ID silently (no notifications)
      await this.handleExtractedJson(responseChatId, senderChatId, false)
    } else if (command === '/new_data' || command === '/newdata' || command === '/recent_data' || command === '/recentdata' || command === '/new_data@spamditbot') {
      // Show time period selection menu
      await this.showNewDataMenu(senderChatId, responseChatId)
    } else if (command.startsWith('⏰ ')) {
      // Handle time period selection (e.g., "⏰ 10 mins", "⏰ 1 hour")
      await this.handleNewDataWithTime(command, responseChatId, senderChatId, false)
    } else if (command === '📊 extract json' || command === 'extract json' || command === '📊 extract json@spamditbot') {
      // Handle button click - send silently
      await this.handleExtractedJson(responseChatId, senderChatId, false)
    } else if (command === '🆕 new data' || command === 'new data' || command === '🆕 new data@spamditbot') {
      // Show time period selection menu
      await this.showNewDataMenu(senderChatId, responseChatId)
    } else if (command === '📈 get analytics' || command === 'get analytics' || command === '📈 get analytics@spamditbot') {
      // Handle analytics button
      const lang = this.getUserLanguage(senderChatId)
      const t = this.getTranslations(lang)
      
      await this.sendMessageWithKeyboard(senderChatId, `📈 <b>${t.analyticsComingSoon}</b>\n\n${lang === 'vi' ? 'Hiện tại, hãy sử dụng 📊 Extract JSON để lấy tất cả dữ liệu của bạn.' : 'For now, use 📊 Extract JSON to get all your data.'}`, {
        keyboard: [
          [{ text: '📊 Extract JSON' }],
          [{ text: '❓ Help' }]
        ],
        resize_keyboard: true
      }, 'HTML')
    } else if (command === '📊 get stats' || command === 'get stats' || command === '📊 get stats@spamditbot') {
      // Handle stats button
      await this.handleGetStats(responseChatId, senderChatId)
    } else if (command === '🔄 refresh data' || command === 'refresh data' || command === '🔄 refresh data@spamditbot') {
      // Handle refresh button
      const lang = this.getUserLanguage(senderChatId)
      const t = this.getTranslations(lang)
      
      await this.sendMessage(senderChatId, t.dataRefreshed)
      await this.sendMessageWithKeyboard(senderChatId, t.readyToExtract, {
        keyboard: [[{ text: '📊 Extract JSON' }]],
        resize_keyboard: true
      }, 'HTML')
    } else if (command === '❓ help' || command === 'help' || command === '❓ help@spamditbot') {
      // Handle help button - show interactive help
      const lang = this.getUserLanguage(senderChatId)
      const t = this.getTranslations(lang)
      
      await this.sendMessageWithKeyboard(senderChatId, `📚 <b>${t.helpSupport}</b>

<b>🔧 ${t.howToUse}</b>
${t.clickExtract}
${t.excelSent}
${t.useHelp}

<b>💬 ${t.commands}</b>
• /start - ${t.startBot}
• /help - ${t.helpMenu}
${t.extractedJsonCmd}
${t.newDataCmd}

<b>⚙️ ${t.questions}</b>
${t.contactAdmin}`, {
        keyboard: [
          [{ text: '📊 Extract JSON' }],
          [{ text: '📊 Get Stats' }, { text: '🔄 Refresh Data' }],
          [{ text: '❓ Help' }],
          [{ text: lang === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt' }]
        ],
        resize_keyboard: true
      }, 'HTML')
    } else {
      // Unknown command - show help
      const lang = this.getUserLanguage(senderChatId)
      const t = this.getTranslations(lang)
      
      await this.sendMessageWithKeyboard(senderChatId, `❓ ${t.unknownCommand}`, {
        keyboard: [[{ text: '📊 Extract JSON' }], [{ text: '❓ Help' }]],
        resize_keyboard: true
      }, 'HTML')
    }
  }

  private async handleExtractedJson(responseChatId: string, senderChatId?: string, sendNotifications: boolean = true): Promise<void> {
    // Only send processing message if notifications are enabled
    if (sendNotifications) {
      await this.sendMessage(responseChatId, '⏳ Processing... Extracting JSON data and generating Excel file...')
    }
    
    try {
      // Fetch the extracted JSON Excel file from our API
      // Use localhost for server-side requests (no domain needed)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
      const apiUrl = `${baseUrl}/api/export/extract-json`
      
      console.log('📥 Fetching extracted JSON from:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = `extracted-json-${Date.now()}.xlsx`
      
      // Send the Excel file via Telegram to primary chat ID only (silently)
      const sent = await this.sendDocument(responseChatId, buffer, filename)
      
      if (!sent && sendNotifications) {
        // Only send error messages if notifications are enabled
        await this.sendMessage(responseChatId, '❌ Failed to send Excel file. Please try again.')
      }
      
      // Don't send success notifications to sender - file is sent silently
    } catch (error: any) {
      console.error('❌ Error handling extracted_json command:', error)
      // Only send error messages if notifications are enabled
      if (sendNotifications) {
        await this.sendMessage(responseChatId, `❌ Error: ${error.message || 'Failed to process request'}`)
      }
    }
  }

  private async showNewDataMenu(senderChatId: string, responseChatId: string): Promise<void> {
    const lang = this.getUserLanguage(senderChatId)
    const t = this.getTranslations(lang)
    
    const menuText = `<b>📊 ${t.selectTimePeriod}</b>

${t.chooseTimeBack}

${t.veryRecent}
${t.recent}
${t.lastHour}
${t.last3Hours}
${t.last6Hours}
${t.last12Hours}
${t.last24Hours}

${t.clickButton}`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '⏰ 10 mins', callback_data: 'new_data_10' },
          { text: '⏰ 30 mins', callback_data: 'new_data_30' }
        ],
        [
          { text: '⏰ 1 hour', callback_data: 'new_data_60' }
        ],
        [
          { text: '⏰ 3 hours', callback_data: 'new_data_180' },
          { text: '⏰ 6 hours', callback_data: 'new_data_360' }
        ],
        [
          { text: '⏰ 12 hours', callback_data: 'new_data_720' },
          { text: '⏰ 24 hours', callback_data: 'new_data_1440' }
        ]
      ]
    }

    await this.sendMessageWithKeyboard(senderChatId, menuText, keyboard, 'HTML')
  }

  private async handleNewDataWithTime(command: string, responseChatId: string, senderChatId?: string, sendNotifications: boolean = true): Promise<void> {
    // Parse time period from command (e.g., "⏰ 10 mins" or "⏰ 1 hour") or callback_data
    let minutes = 1440 // Default: 24 hours
    
    if (command.includes('10 min') || command === 'new_data_10') {
      minutes = 10
    } else if (command.includes('30 min') || command === 'new_data_30') {
      minutes = 30
    } else if (command.includes('1 hour') || command.includes('60 min') || command === 'new_data_60') {
      minutes = 60
    } else if (command.includes('3 hour') || command.includes('180 min') || command === 'new_data_180') {
      minutes = 180
    } else if (command.includes('6 hour') || command.includes('360 min') || command === 'new_data_360') {
      minutes = 360
    } else if (command.includes('12 hour') || command.includes('720 min') || command === 'new_data_720') {
      minutes = 720
    } else if (command.includes('24 hour') || command.includes('1440 min') || command === 'new_data_1440') {
      minutes = 1440
    }
    
    // Only send processing message if notifications are enabled
    if (sendNotifications) {
      const timeLabel = minutes < 60 ? `${minutes} minutes` : minutes === 60 ? '1 hour' : `${minutes / 60} hours`
      await this.sendMessage(responseChatId, `⏳ Processing... Fetching new data from last ${timeLabel}...`)
    }
    
    try {
      // Fetch the recent JSON Excel file from our API
      // Use localhost for server-side requests (no domain needed)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
      const apiUrl = `${baseUrl}/api/export/extract-json-recent?minutes=${minutes}`
      
      console.log('📥 Fetching new data from:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = `new-data-${minutes}mins-${Date.now()}.xlsx`
      
      // Send the Excel file via Telegram to primary chat ID only (silently)
      const sent = await this.sendDocument(responseChatId, buffer, filename)
      
      if (!sent && sendNotifications) {
        // Only send error messages if notifications are enabled
        await this.sendMessage(responseChatId, '❌ Failed to send Excel file. Please try again.')
      }
      
      // Don't send success notifications to sender - file is sent silently
    } catch (error: any) {
      console.error('❌ Error handling new_data command:', error)
      // Only send error messages if notifications are enabled
      if (sendNotifications) {
        await this.sendMessage(responseChatId, `❌ Error: ${error.message || 'Failed to process request'}`)
      }
    }
  }

  private async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const data = callbackQuery.data
    const senderChatId = String(callbackQuery.message.chat.id)
    const messageId = callbackQuery.message.message_id

    const config = await this.getConfig()
    
    // Check if sender is authorized
    const isAuthorized = config.authorizedChatIds.length === 0 || config.authorizedChatIds.includes(senderChatId)
    
    if (!isAuthorized) {
      console.log(`⚠️ Unauthorized callback from chat: ${senderChatId}`)
      return
    }

    const responseChatId = config.chatId || senderChatId

    // Answer the callback query to remove loading state
    try {
      const answerUrl = `https://api.telegram.org/bot${config.botToken}/answerCallbackQuery`
      await fetch(answerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
          text: 'Processing...'
        })
      })
    } catch (e) {
      // Ignore errors in answering callback
    }

    // Handle different callback data
    if (data?.startsWith('new_data_')) {
      await this.handleNewDataWithTime(data, responseChatId, senderChatId, false)
    }
  }

  private async handleNewData(responseChatId: string, senderChatId?: string, sendNotifications: boolean = true): Promise<void> {
    // Default to 24 hours if called directly
    await this.handleNewDataWithTime('24 hours', responseChatId, senderChatId, sendNotifications)
  }

  private async handleGetStats(responseChatId: string, senderChatId?: string): Promise<void> {
    try {
      const lang = this.getUserLanguage(senderChatId || responseChatId)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
      const apiUrl = `${baseUrl}/api/tracking/stats`
      
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !data.stats) {
        throw new Error('Failed to get stats')
      }

      const stats = data.stats
      const messages = {
        en: `📊 <b>Traffic Statistics</b>\n\n` +
            `🌐 Current Visitors So Far: <b>${stats.websiteVisits.toLocaleString()}</b>\n` +
            `🛒 Go to Checkout So Far: <b>${stats.checkoutVisits.toLocaleString()}</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📈 Estimated People Buy: <b>${stats.estimatedBuyers.toLocaleString()}</b>\n` +
            `   (${stats.checkoutVisits.toLocaleString()} × 30%)\n\n` +
            `✅ Completed Orders: <b>${stats.completedOrders.toLocaleString()}</b>\n` +
            `📊 Conversion Rate: <b>${stats.conversionRate}%</b>`,
        vi: `📊 <b>Thống kê Lưu lượng</b>\n\n` +
            `🌐 Lượt truy cập hiện tại: <b>${stats.websiteVisits.toLocaleString()}</b>\n` +
            `🛒 Vào trang thanh toán: <b>${stats.checkoutVisits.toLocaleString()}</b>\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📈 Ước tính người sẽ mua: <b>${stats.estimatedBuyers.toLocaleString()}</b>\n` +
            `   (${stats.checkoutVisits.toLocaleString()} × 30%)\n\n` +
            `✅ Đơn hàng hoàn thành: <b>${stats.completedOrders.toLocaleString()}</b>\n` +
            `📊 Tỷ lệ chuyển đổi: <b>${stats.conversionRate}%</b>`
      }

      await this.sendMessage(responseChatId, messages[lang as 'en' | 'vi'] || messages.vi, 'HTML')
    } catch (error: any) {
      console.error('❌ Error getting stats:', error)
      const lang = this.getUserLanguage(senderChatId || responseChatId)
      const errorMsg = lang === 'vi' 
        ? '❌ Lỗi khi lấy thống kê. Vui lòng thử lại.'
        : '❌ Error getting stats. Please try again.'
      await this.sendMessage(responseChatId, errorMsg)
    }
  }

  private async removeWebhook(botToken: string): Promise<void> {
    try {
      const url = `https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`
      const response = await fetch(url, { method: 'POST' })
      const result = await response.json()
      if (result.ok) {
        console.log('✅ Webhook removed successfully')
      } else {
        console.log('ℹ️ No webhook to remove or already removed')
      }
    } catch (error) {
      console.warn('⚠️ Could not remove webhook (might not be set):', error)
    }
  }

  public async startPolling(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Telegram bot polling is already running')
      return
    }

    const config = await this.getConfig()
    if (!config.botToken) {
      console.warn('⚠️ Cannot start polling: TELEGRAM_BOT_TOKEN not configured')
      return
    }
    
    if (!config.chatId) {
      console.warn('⚠️ TELEGRAM_CHAT_ID not configured - bot will respond to all chats and show chat IDs')
    }

    // Remove any existing webhook first (webhooks prevent polling)
    console.log('🔄 Removing any existing webhook...')
    await this.removeWebhook(config.botToken)

    this.isRunning = true
    console.log('🚀 Starting Telegram bot polling...')

    // Set bot commands menu (shows when user types "/")
    await this.setBotCommands(config.botToken)

    const poll = async () => {
      if (!this.isRunning) return

      try {
        const updates = await this.getUpdates()
        
        for (const update of updates) {
          if (update.update_id > this.lastUpdateId) {
            this.lastUpdateId = update.update_id
            
            console.log('📥 Processing update:', update.update_id)
            
            if (update.message) {
              if (update.message.text) {
                console.log('📝 Message text:', update.message.text)
                await this.handleCommand(update)
              } else {
                console.log('⚠️ Message has no text:', update.message)
              }
            } else if (update.callback_query) {
              // Handle inline keyboard button clicks
              console.log('🔘 Callback query:', update.callback_query.data)
              await this.handleCallbackQuery(update.callback_query)
            } else {
              console.log('⚠️ Update has no message:', update)
            }
          }
        }
      } catch (error) {
        console.error('❌ Polling error:', error)
      }

      // Continue polling if still running
      if (this.isRunning) {
        setTimeout(poll, 1000) // Poll every 1 second
      }
    }

    // Start polling
    poll()
  }

  private async setBotCommands(botToken: string): Promise<void> {
    try {
      const url = `https://api.telegram.org/bot${botToken}/setMyCommands`
      
      const commands = [
        {
          command: 'extracted_json',
          description: 'Extract all JSON data from completed orders'
        },
        {
          command: 'new_data',
          description: 'Get only new/updated data from last 24 hours'
        },
        {
          command: 'help',
          description: 'Show bot commands and help'
        },
        {
          command: 'start',
          description: 'Start the bot and show welcome message'
        }
      ]

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      })

      if (response.ok) {
        console.log('✅ Bot commands menu configured')
      } else {
        const error = await response.text()
        console.warn('⚠️ Could not set bot commands menu:', error)
      }
    } catch (error) {
      console.warn('⚠️ Could not set bot commands:', error)
    }
  }

  public stopPolling(): void {
    this.isRunning = false
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval)
      this.pollingInterval = null
    }
    console.log('🛑 Telegram bot polling stopped')
  }
}

export const telegramBot = new TelegramBot()

