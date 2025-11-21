# Vercel Environment Variables

Copy and paste these environment variables into your Vercel project settings.

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. For each variable below, click **Add New** and enter:
   - **Name**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The value (copy from below)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

## Required Environment Variables

### Database Connection

```
DATABASE_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**OR** (alternative name):

```
POSTGRES_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Optional Environment Variables

If you have these in your `.env.local`, add them to Vercel as well:

### Telegram Bot (if using)

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

### Any Other API Keys

Add any other environment variables from your `.env.local` file that your application uses.

## Quick Copy Format

Here's a quick reference for copying:

**Variable Name:** `DATABASE_URL`  
**Value:** `postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`

---

**Note:** After adding environment variables, you must **redeploy** your application for the changes to take effect.

