import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import { ScrollProgressBar } from '@/components/marketing/ScrollProgressBar'

export const metadata: Metadata = {
  title: 'SEN DETÍ — Prémiový detský e-shop',
  description: 'Prémiový detský e-shop. Oblečenie, hračky a doplnky pre vaše deti s láskou vybrané na Slovensku.',
}

export const viewport: Viewport = {
  themeColor: '#C874D9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        <ScrollProgressBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <ToastProvider />
      </body>
    </html>
  )
}
