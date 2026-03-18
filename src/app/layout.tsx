import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

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
  title: {
    default: 'Sen Detí — Prémiový detský e-shop',
    template: '%s | Sen Detí',
  },
  description: 'Detské oblečenie, obliečky, hračky a školské potreby. Overený slovenský e-shop s doručením do 3 dní.',
  keywords: ['detský e-shop', 'detské oblečenie', 'obliečky pre deti', 'hračky', 'slovenský e-shop'],
  openGraph: {
    title: 'Sen Detí — Prémiový detský e-shop',
    description: 'Detské oblečenie, obliečky, hračky a školské potreby.',
    url: 'https://www.sendeti.sk',
    siteName: 'Sen Detí',
    locale: 'sk_SK',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased bg-cream text-dark">
        <Navbar />
        <CartDrawer />
        <ErrorBoundary>
          <main className="min-h-screen animate-fadeIn">{children}</main>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  )
}
