# Vercel Deployment Guide

This guide will help you deploy your WhySoCheap e-commerce website to Vercel.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a Git repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Git Repository** - Push your code to GitHub, GitLab, or Bitbucket

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, make sure your code is committed and pushed to GitHub:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Project Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (root of your repository)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Environment Variables (if needed)

If you have any environment variables, add them in Vercel:

1. In the project settings, go to **Settings** → **Environment Variables**
2. Add any required variables:
   - `NODE_ENV=production`
   - Any API keys or secrets your app needs

**Note**: Your SQLite database files won't persist on Vercel's serverless functions. Consider:
- Using Vercel's serverless database (Postgres)
- Using an external database service
- Or the database will be recreated on each deployment

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project-name.vercel.app`

### 6. Automatic Deployments

Once connected, Vercel will automatically:
- Deploy every push to your main branch
- Create preview deployments for pull requests
- Update your production site automatically

## Important Notes for This Project

### Database Considerations

This project uses SQLite (`better-sqlite3`), which has limitations on serverless platforms:

**Option 1: Use Vercel Postgres (Recommended)**
- Go to your Vercel project → Storage → Create Database
- Choose Postgres
- Update your database connection code

**Option 2: Use External Database**
- Use services like Supabase, PlanetScale, or Railway
- Update connection strings in environment variables

**Option 3: File-based (Not Recommended for Production)**
- SQLite files won't persist between deployments
- Data will be lost on each deployment

### Build Configuration

Your `next.config.js` is already configured for image optimization. Vercel will handle:
- Image optimization automatically
- Edge functions for API routes
- CDN for static assets

## Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

## Monitoring & Analytics

Vercel provides:
- **Analytics**: Built-in web analytics
- **Logs**: Real-time function logs
- **Performance**: Core Web Vitals monitoring
- **Errors**: Automatic error tracking

Access these from your Vercel dashboard.

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run build` locally first

### Database Issues

- SQLite won't work well on serverless - migrate to Postgres or external DB
- Check environment variables are set correctly

### Image Loading Issues

- Verify `next.config.js` has correct `remotePatterns`
- Check image URLs are accessible

## Quick Deploy via CLI (Alternative Method)

You can also deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)
