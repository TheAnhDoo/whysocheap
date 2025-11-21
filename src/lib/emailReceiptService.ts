// Email Receipt Module for WhySoCheap
// This module handles fast email receipt generation based on real-time customer data

export interface EmailReceiptData {
  orderId: string
  customerEmail: string
  customerName: string
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    productName: string
    size: string
    color: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  discount: number
  total: number
  locationData?: {
    latitude: number
    longitude: number
    timestamp: string
  }
}

export class EmailReceiptService {
  private static instance: EmailReceiptService
  private customerDataCache: Map<string, any> = new Map()
  private emailTemplates: Map<string, string> = new Map()

  private constructor() {
    this.initializeEmailTemplates()
  }

  public static getInstance(): EmailReceiptService {
    if (!EmailReceiptService.instance) {
      EmailReceiptService.instance = new EmailReceiptService()
    }
    return EmailReceiptService.instance
  }

  private initializeEmailTemplates() {
    // Pre-load email templates based on location for faster processing
    this.emailTemplates.set('default', this.getDefaultTemplate())
    this.emailTemplates.set('north-america', this.getNorthAmericaTemplate())
    this.emailTemplates.set('europe', this.getEuropeTemplate())
    this.emailTemplates.set('asia-pacific', this.getAsiaPacificTemplate())
  }

  // Cache customer data for faster email processing
  public cacheCustomerData(email: string, data: any) {
    this.customerDataCache.set(email, {
      ...data,
      cachedAt: new Date().toISOString()
    })
  }

  // Get cached customer data
  public getCachedCustomerData(email: string) {
    return this.customerDataCache.get(email)
  }

  // Generate email receipt with optimized template based on location
  public async generateEmailReceipt(data: EmailReceiptData): Promise<string> {
    const cachedData = this.getCachedCustomerData(data.customerEmail)
    
    // Use cached data to speed up processing
    const customerData = cachedData || data
    
    // Determine template based on location
    let template = 'default'
    if (data.locationData) {
      if (data.locationData.latitude > 40 && data.locationData.latitude < 50) {
        template = 'north-america'
      } else if (data.locationData.latitude > 50 && data.locationData.latitude < 70) {
        template = 'europe'
      } else if (data.locationData.latitude > 0 && data.locationData.latitude < 30) {
        template = 'asia-pacific'
      }
    }
    
    const emailTemplate = this.emailTemplates.get(template) || this.getDefaultTemplate()
    
    // Replace placeholders with actual data
    return this.replaceTemplatePlaceholders(emailTemplate, data)
  }

  private replaceTemplatePlaceholders(template: string, data: EmailReceiptData): string {
    let html = template
    
    // Replace basic placeholders
    html = html.replace(/\{\{orderId\}\}/g, data.orderId)
    html = html.replace(/\{\{customerName\}\}/g, data.customerName)
    html = html.replace(/\{\{customerEmail\}\}/g, data.customerEmail)
    html = html.replace(/\{\{total\}\}/g, `$${data.total.toFixed(2)}`)
    html = html.replace(/\{\{subtotal\}\}/g, `$${data.subtotal.toFixed(2)}`)
    html = html.replace(/\{\{shipping\}\}/g, `$${data.shipping.toFixed(2)}`)
    html = html.replace(/\{\{discount\}\}/g, `$${data.discount.toFixed(2)}`)
    
    // Replace address
    const address = `${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}, ${data.shippingAddress.country}`
    html = html.replace(/\{\{shippingAddress\}\}/g, address)
    
    // Replace items
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.color} • Size ${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')
    html = html.replace(/\{\{items\}\}/g, itemsHtml)
    
    return html
  }

  private getDefaultTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - WhySoCheap</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f172a; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 20px; }
          .order-details { background: #f8fafc; padding: 15px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          <div class="content">
            <h2>Order #{{orderId}}</h2>
            <p>Dear {{customerName}},</p>
            <p>Thank you for your order! We're excited to get your idol merchandise to you.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Details</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {{items}}
                </tbody>
              </table>
              
              <div style="margin-top: 20px;">
                <p><strong>Subtotal:</strong> {{subtotal}}</p>
                <p><strong>Shipping:</strong> {{shipping}}</p>
                <p><strong>Discount:</strong> {{discount}}</p>
                <p class="total"><strong>Total:</strong> {{total}}</p>
              </div>
            </div>
            
            <h3>Shipping Address</h3>
            <p>{{shippingAddress}}</p>
            
            <p>We'll send you tracking information once your order ships.</p>
            <p>Thank you for choosing WhySoCheap!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getNorthAmericaTemplate(): string {
    return this.getDefaultTemplate().replace(
      'We\'ll send you tracking information once your order ships.',
      'We\'ll send you tracking information once your order ships. Estimated delivery: 3-5 business days.'
    )
  }

  private getEuropeTemplate(): string {
    return this.getDefaultTemplate().replace(
      'We\'ll send you tracking information once your order ships.',
      'We\'ll send you tracking information once your order ships. Estimated delivery: 5-7 business days.'
    )
  }

  private getAsiaPacificTemplate(): string {
    return this.getDefaultTemplate().replace(
      'We\'ll send you tracking information once your order ships.',
      'We\'ll send you tracking information once your order ships. Estimated delivery: 7-10 business days.'
    )
  }

  // Send email receipt (integrate with your email service)
  public async sendEmailReceipt(data: EmailReceiptData): Promise<boolean> {
    try {
      const emailHtml = await this.generateEmailReceipt(data)
      
      // In a real app, integrate with email service like SendGrid, Mailgun, etc.
      console.log('Email receipt generated:', {
        to: data.customerEmail,
        subject: `Order Confirmation #${data.orderId}`,
        html: emailHtml
      })
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return true
    } catch (error) {
      console.error('Failed to send email receipt:', error)
      return false
    }
  }
}

// Export singleton instance
export const emailReceiptService = EmailReceiptService.getInstance()
