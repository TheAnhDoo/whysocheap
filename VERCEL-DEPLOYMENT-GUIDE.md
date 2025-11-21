# Complete Vercel Deployment Guide for WhySoCheap

This guide will walk you through deploying your Next.js application to Vercel with Neon Postgres database.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- A Neon Postgres database (already created)

## Step 1: Prepare Your Code

1. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Migrate to Postgres and prepare for deployment"
   git push
   ```

## Step 2: Push to GitHub

If you haven't already, create a GitHub repository and push your code:

1. Go to https://github.com/new
2. Create a new repository (e.g., `whysocheap-store`)
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/whysocheap-store.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Your Repository:**
   - Connect your GitHub account if not already connected
   - Select your repository (`whysocheap-store`)
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add the following:

   ```
   DATABASE_URL=postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

   **Important:** Also add any other environment variables your app needs:
   - `TELEGRAM_BOT_TOKEN` (if you have one)
   - `TELEGRAM_CHAT_ID` (if you have one)
   - Any other API keys or secrets

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No
   - Project name: `whysocheap-store`
   - Directory: `./`
   - Override settings? No

4. **Add Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   # Paste: postgresql://neondb_owner:npg_XC19msLBZyoI@ep-nameless-river-adr5zvqn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   # Select: Production, Preview, Development
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

## Step 4: Verify Database Connection

After deployment, verify your database connection:

1. **Check Vercel Logs:**
   - Go to your project dashboard
   - Click "Deployments"
   - Click on the latest deployment
   - Click "Functions" tab
   - Check for any database connection errors

2. **Test the Application:**
   - Visit your deployed URL (e.g., `https://whysocheap-store.vercel.app`)
   - Try creating a product in the admin panel
   - Check if data persists

## Step 5: Initialize Database Schema

The database schema will be automatically created on first API call, but you can also initialize it manually:

1. **Visit the Admin Panel:**
   - Go to `https://your-app.vercel.app/admin`
   - The database will auto-initialize when you first use it

2. **Or use the Reset Endpoint (if available):**
   - Visit `https://your-app.vercel.app/api/database/reset` (POST request)
   - This will create all tables

## Step 6: Configure Custom Domain (Optional)

1. **Add Domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Database Connection Errors

**Error: "DATABASE_URL or POSTGRES_URL environment variable is required"**
- Solution: Make sure `DATABASE_URL` is set in Vercel environment variables
- Go to Project Settings → Environment Variables
- Add `DATABASE_URL` with your Neon connection string

**Error: "Connection timeout"**
- Solution: Check if your Neon database is paused (free tier pauses after inactivity)
- Go to Neon dashboard and resume the database
- The connection string should work once the database is active

**Error: "SSL connection required"**
- Solution: Make sure your connection string includes `?sslmode=require`
- Your connection string should end with: `.../neondb?sslmode=require`

### Build Errors

**Error: "Module not found"**
- Solution: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "TypeScript errors"**
- Solution: Fix all TypeScript errors before deploying
- Run `npm run build` locally to check for errors

### Runtime Errors

**Error: "Cannot read property of undefined"**
- Solution: Check Vercel function logs
- Make sure all API routes handle async operations correctly

## Environment Variables Reference

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Neon Postgres connection string | ✅ Yes |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token (if using) | ❌ No |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID (if using) | ❌ No |

## Important Notes

1. **Database Auto-Pause (Free Tier):**
   - Neon free tier databases pause after 5 minutes of inactivity
   - First request after pause may take 1-2 seconds to wake up
   - Consider upgrading to paid tier for production

2. **Connection Pooling:**
   - The connection string uses `-pooler` endpoint for better performance
   - This is recommended for serverless environments like Vercel

3. **Cold Starts:**
   - First request to a new serverless function may be slower
   - Subsequent requests will be faster

4. **File System:**
   - Vercel serverless functions have read-only file system
   - All data must be stored in the database, not local files

## Next Steps

1. ✅ Database connected and working
2. ✅ Application deployed
3. ✅ Test all features
4. ⬜ Set up monitoring (optional)
5. ⬜ Configure custom domain (optional)
6. ⬜ Set up CI/CD (automatic with GitHub)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Neon database status
3. Verify environment variables are set correctly
4. Test database connection locally first

---

**Your deployment URL will be:** `https://your-project-name.vercel.app`

Good luck with your deployment! 🚀

