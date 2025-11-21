# Telegram Bot Usage Guide

## 🚀 Setup Instructions

### 1. **Get Your Telegram Bot Token**
1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. **Get Your Chat ID**
1. Search for **@userinfobot** in Telegram
2. Start a conversation - it will show your Chat ID
3. Copy the Chat ID (looks like: `123456789` or `-1001234567890` for groups)

### 3. **Configure Environment Variables**
Create or update `.env.local` file:

**Basic Configuration (single chat):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_primary_chat_id_here
```

**Advanced Configuration (multiple authorized chats, single response chat):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=-1003203445265
TELEGRAM_AUTHORIZED_CHAT_IDS=1330471406,-1003203445265,-1003215159480
```

**Example with your chat IDs:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=-1003203445265
TELEGRAM_AUTHORIZED_CHAT_IDS=1330471406,-1003203445265,-1003215159480
```

This allows chats `1330471406`, `-1003203445265`, and `-1003215159480` to send commands, but all Excel files will be sent to `-1003203445265` only.

**How it works:**
- `TELEGRAM_CHAT_ID` = The chat where Excel files will be sent (only one)
- `TELEGRAM_AUTHORIZED_CHAT_IDS` = All chat IDs that can send commands (comma or space separated)
- Multiple people can trigger commands, but all Excel files go to `TELEGRAM_CHAT_ID` only

### 4. **Install Dependencies**
```bash
npm install
```

### 5. **Start the Server**
```bash
# Development with network access
npm run dev:network

# Or production mode
npm run start:network
```

The bot will automatically start polling when the server starts!

## 📱 How to Use the Bot

### **Step 1: Start Your Bot**
1. Open Telegram
2. Search for your bot (the username you gave it when creating with BotFather)
3. Click **"Start"** or send `/start`

### **Step 2: Available Commands**

#### `/extracted_json` or `/extracted json`
Extracts all JSON data from completed orders and sends an Excel file.

**What it does:**
- Fetches all completed order logs from database
- Parses the `snapshotJson` field from each order
- Extracts all key-value pairs into separate columns
- Creates an Excel file with all the data
- Sends the Excel file directly to your Telegram chat

**Example:**
```
You: /extracted_json

Bot: ⏳ Processing... Extracting JSON data and generating Excel file...
Bot: [Excel File] 📊 Extracted JSON Data - extracted-json-1234567890.xlsx
Bot: ✅ Extracted JSON data sent successfully!
```

#### `/start` or `/help`
Shows available commands and bot information.

### **Step 3: Check Bot Status**
You can check if the bot is running by visiting:
```
http://localhost:3000/api/telegram-bot/start
```
This will show the configuration status.

## 🔧 Troubleshooting

### Bot Not Responding?
1. **Check if bot is running:**
   - Look for `✅ Telegram bot polling started` in server console
   - Check server logs for any errors

2. **Verify environment variables:**
   - Make sure `.env.local` has correct `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
   - Restart the server after changing `.env.local`

3. **Check Chat ID:**
   - Make sure you're messaging from the chat ID you configured
   - The bot only responds to messages from the authorized chat ID

4. **Manual Start:**
   If auto-start fails, manually trigger:
   ```bash
   curl -X POST http://localhost:3000/api/telegram-bot/start
   ```

### Excel File Not Received?
1. Check server logs for errors
2. Verify database has completed order logs
3. Check network connectivity (bot needs to reach Telegram API)

## 💡 Tips

- **Works without domain:** The bot uses polling (not webhooks), so no public domain needed!
- **Production ready:** Works in production the same way - just needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- **Secure:** Only responds to commands from the authorized chat ID
- **Automatic:** Bot starts automatically when server starts

## 📋 Example Workflow

1. **Start server:**
   ```bash
   npm run dev:network
   ```

2. **In Telegram:**
   - Find your bot
   - Send `/start` to test
   - Send `/extracted_json` to get Excel file

3. **Download Excel:**
   - File will be sent directly in Telegram chat
   - Click to download and open in Excel

That's it! The bot will automatically extract all JSON data and send it as an Excel file. 📊

