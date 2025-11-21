# 🚀 WhySoCheap Deployment Guide

This guide provides step-by-step instructions for deploying your WhySoCheap e-commerce website.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account (for Vercel deployment)
- Domain name (optional, for custom domain)

## 🎯 Quick Start

### 1. Local Development

```bash
# Navigate to project directory
cd idol-tshirt-store

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 2. Production Build Test

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Built for Next.js
- Automatic deployments from GitHub
- Global CDN
- Free tier available
- Easy custom domain setup

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/idol-tshirt-store.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

### Option 3: Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository

2. **Configure**
   - Framework: Next.js
   - Auto-detects build settings

### Option 4: Manual Server

1. **Prepare Server**
   ```bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Deploy**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/idol-tshirt-store.git
   cd idol-tshirt-store
   
   # Install dependencies
   npm install
   
   # Build project
   npm run build
   
   # Start with PM2
   pm2 start npm --name "idol-store" -- start
   pm2 save
   pm2 startup
   ```

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env.local` file:

```env
# Database (if using external database)
DATABASE_URL=your_database_url

# Payment Gateway (if integrating real payment processor)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Service (for order confirmations)
EMAIL_SERVICE_API_KEY=your_email_service_key

# Next.js Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key
```

### Vercel Environment Variables

1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Redeploy after adding variables

## 🛠️ Customization

### 1. Update Product Information

Edit `src/lib/api.ts`:
```typescript
export const mockProduct: Product = {
  id: '1',
  name: 'Your Product Name',
  description: 'Your product description',
  price: 29.99,
  // ... other properties
}
```

### 2. Customize Styling

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### 3. Add Real Payment Processing

Replace mock payment in `src/app/api/checkout/route.ts`:
```typescript
// Example with Stripe
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Process payment
const paymentIntent = await stripe.paymentIntents.create({
  amount: total * 100, // Convert to cents
  currency: 'usd',
  // ... other options
})
```

## 📊 Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Optimize images before upload
- Consider using a CDN

### 2. Database Optimization

- Use connection pooling
- Implement caching
- Optimize queries

### 3. Monitoring

- Set up error tracking (Sentry)
- Monitor performance (Vercel Analytics)
- Track user behavior (Google Analytics)

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular dependency updates

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Check variable names match exactly
   - Ensure variables are set for correct environment
   - Redeploy after adding variables

3. **Payment Processing Issues**
   - Verify API keys are correct
   - Check webhook endpoints
   - Test with test cards first

4. **Database Connection Issues**
   - Verify connection string
   - Check database permissions
   - Ensure database is accessible

## 📞 Support

If you encounter issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details
3. Contact support at support@whysocheap.com

## 🎉 Success!

Once deployed, your WhySoCheap website will be live and ready to accept orders!

**Next Steps:**
- Set up analytics tracking
- Configure email notifications
- Test payment processing
- Set up monitoring
- Plan marketing strategy

---

**Happy Selling! 🛍️**
