# WhySoCheap - Idol T-shirt E-Commerce Website

A modern, full-featured e-commerce website for selling idol-themed T-shirts, built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

### Customer Features
- **Beautiful Landing Page** - Modern hero section with product showcase
- **Product Catalog** - Detailed product pages with size/color selection
- **Shopping Cart** - Add/remove items with real-time updates
- **Secure Checkout** - PCI DSS compliant payment processing with card validation
- **Order Confirmation** - Thank you page with order details
- **Responsive Design** - Optimized for desktop and mobile

### Admin Features
- **Dashboard Overview** - Sales statistics and order metrics
- **Order Management** - View, update, and track orders
- **Product Management** - CRUD operations for products
- **Customer Management** - Customer data and order history
- **Real-time Updates** - Live order status updates

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **API Routes** - RESTful API for orders, products, and admin functions
- **Form Validation** - Client and server-side validation
- **Payment Processing** - Secure card validation with Luhn algorithm
- **State Management** - React Context for cart management
- **Modern UI** - TailwindCSS with custom components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Headless UI
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd idol-tshirt-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your GitHub repository

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`

### Option 3: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (if using external database)
DATABASE_URL=your_database_url

# Payment Gateway (if integrating real payment processor)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Service (for order confirmations)
EMAIL_SERVICE_API_KEY=your_email_service_key
```

### Customization

1. **Update Product Data**
   - Edit `src/lib/api.ts` to modify product information
   - Add more products to the mock data

2. **Styling**
   - Modify `tailwind.config.js` for custom colors and themes
   - Update components in `src/components/`

3. **API Integration**
   - Replace mock data in `src/lib/api.ts` with real API calls
   - Update API routes in `src/app/api/`

## 📁 Project Structure

```
idol-tshirt-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── admin/              # Admin dashboard
│   │   ├── checkout/           # Payment page
│   │   ├── products/           # Product pages
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 Key Pages

- **Homepage** (`/`) - Landing page with hero section and product showcase
- **Products** (`/products`) - Product detail page with size/color selection
- **Checkout** (`/checkout`) - Secure payment page with card validation
- **Thank You** (`/thank-you`) - Order confirmation page
- **Admin** (`/admin`) - Admin dashboard for order management
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information

## 🔒 Security Features

- **HTTPS Enforcement** - SSL/TLS for all payment operations
- **Card Validation** - Luhn algorithm for card number validation
- **Input Sanitization** - Form validation and sanitization
- **PCI DSS Compliance** - Secure payment data handling
- **Real-time Validation** - Client-side form validation

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Performance

- **Next.js 14** - Latest performance optimizations
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic code splitting
- **Static Generation** - Pre-rendered pages for better SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help with deployment:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact support at support@whysocheap.com

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern e-commerce best practices

---

**Happy Coding! 🚀**