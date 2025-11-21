# Vercel Environment Variables - Complete Import Guide

This file contains ALL environment variables from your `.env.local` that need to be added to Vercel.

## How to Import to Vercel

### Method 1: Manual Entry (Recommended)
1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. For each variable below, click **Add New** and enter:
   - **Name**: Variable name (left side of =)
   - **Value**: Variable value (right side of =)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

### Method 2: Vercel CLI
```bash
vercel env add DATABASE_URL production preview development
# Paste the value when prompted
```

---

## Environment Variables to Add

### 1. Database Configuration (REQUIRED - Updated for Postgres)

**Variable Name:** `DATABASE_URL`  
**Value:**
```
postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Note:** This replaces your local SQLite database URL with the Neon Postgres connection string.

---

### 2. Telegram Bot Configuration

**Variable Name:** `TELEGRAM_BOT_TOKEN`  
**Value:**
```
8244371371:AAEk4Gl04opMoioArmy9zjrjYbfxGT8Ze98
```

**Variable Name:** `TELEGRAM_CHAT_ID`  
**Value:**
```
-1003203445265,1330471406
```

**Variable Name:** `TELEGRAM_AUTHORIZED_CHAT_IDS`  
**Value:**
```
1330471406,-1003203445265,-1003215159480,8203909082,
```

---

### 3. Next.js Configuration

**Variable Name:** `NEXTAUTH_URL`  
**Value:**
```
https://your-project-name.vercel.app
```
**Note:** Replace `your-project-name` with your actual Vercel project URL after deployment.

**Variable Name:** `NEXTAUTH_SECRET`  
**Value:**
```
changeme
```
**Note:** For production, generate a secure random string. You can use:
```bash
openssl rand -base64 32
```

**Variable Name:** `NODE_ENV`  
**Value:**
```
production
```
**Note:** Vercel automatically sets this, but you can add it explicitly.

---

## Quick Copy-Paste Format

Here are the variables in a format you can easily copy:

```
DATABASE_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

TELEGRAM_BOT_TOKEN=8244371371:AAEk4Gl04opMoioArmy9zjrjYbfxGT8Ze98

TELEGRAM_CHAT_ID=-1003203445265,1330471406

TELEGRAM_AUTHORIZED_CHAT_IDS=1330471406,-1003203445265,-1003215159480,8203909082,

NEXTAUTH_URL=https://your-project-name.vercel.app

NEXTAUTH_SECRET=changeme

NODE_ENV=production
```

---

## Important Notes

1. **DATABASE_URL**: This has been updated from SQLite to your Neon Postgres connection string
2. **NEXTAUTH_URL**: Update this after deployment with your actual Vercel URL
3. **NEXTAUTH_SECRET**: Generate a secure random string for production (see command above)
4. **After adding variables**: You must **redeploy** your application for changes to take effect
5. **Security**: Never commit these values to Git (they're already in `.gitignore`)

---

## After Adding Variables

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

Your application will now use these environment variables! 🚀

