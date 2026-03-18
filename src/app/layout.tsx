import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SEN DETÍ — Prémiový detský e-shop',
  description: 'Prémiový detský e-shop. Oblečenie, hračky a doplnky pre vaše deti s láskou vybrané na Slovensku.',
}

export const viewport: Viewport = {
  themeColor: '#C874D9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased bg-white">
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  )
}
