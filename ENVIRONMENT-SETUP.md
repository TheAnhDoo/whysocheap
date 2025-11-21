# Environment Variables Setup for Vercel

## Required Environment Variables

Add these in your Vercel project settings:

### Database Connection

```
DATABASE_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**OR** use:

```
POSTGRES_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Optional: Telegram Bot (if using)

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables**
4. Click **Add New**
5. Enter the variable name (e.g., `DATABASE_URL`)
6. Enter the value
7. Select environments: **Production**, **Preview**, and **Development**
8. Click **Save**
9. **Redeploy** your application for changes to take effect

## Important Notes

- The `DATABASE_URL` uses the **pooler** endpoint which is recommended for serverless
- Make sure `?sslmode=require` is included in the connection string
- Never commit these values to Git - they're already in `.gitignore`
- After adding environment variables, you must redeploy for them to take effect

