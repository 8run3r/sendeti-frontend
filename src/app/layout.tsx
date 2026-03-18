import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import { ScrollProgressBar } from '@/components/marketing/ScrollProgressBar'

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
      <body>
        <ScrollProgressBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <ToastProvider />
      </body>
    </html>
  )
}
