import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import SnowEffect from '@/components/SnowEffect'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WhySoCheap - Authentic Celebrity Merchandise',
  description: 'Official and licensed celebrity merchandise at wholesale prices',
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
  openGraph: {
    title: 'WhySoCheap - Authentic Celebrity Merchandise',
    description: 'Shop exclusive merch and apparel from your fav celeb. Hoodies, tees, vinyl, accessories, and more.',
    url: 'https://whysocheap.site',
    siteName: 'WhySoCheap',
    images: [
      {
        url: 'https://i.postimg.cc/6p8LvPh3/Chat-GPT-Image-Nov-23-2025-06-43-48-AM-(1).png',
        width: 1200,
        height: 630,
        alt: 'WhySoCheap - Authentic Celebrity Merchandise',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhySoCheap - Authentic Celebrity Merchandise',
    description: 'Shop exclusive merch and apparel from your favorite celebrities — hoodies, tees, vinyl, accessories, and more.',
    images: ['https://i.postimg.cc/6p8LvPh3/Chat-GPT-Image-Nov-23-2025-06-43-48-AM-(1).png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
        <CartProvider>
          <SnowEffect />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}