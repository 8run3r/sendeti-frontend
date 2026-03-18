import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer'),
  { ssr: false }
)

const displayFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sen Detí — Prémiový detský e-shop',
  description: 'Oblečenie, obliečky a hračky pre deti. Overený slovenský e-shop.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased bg-cream text-dark">
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen animate-fadeIn">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
