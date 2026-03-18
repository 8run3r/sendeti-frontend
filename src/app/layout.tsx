import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

// ssr:false prevents hydration mismatch from zustand localStorage
const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer'),
  { ssr: false }
)

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sen Detí — Prémiový detský e-shop',
  description: 'Oblečenie, obliečky a hračky pre deti. Overený slovenský e-shop.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={dmSans.variable}>
      <body className="font-sans antialiased bg-white">
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-white py-12 px-6 mt-16">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-2xl font-bold text-orange-400 mb-2">SEN DETÍ</p>
            <p className="text-gray-400 text-sm mb-6">všetko pre úsmev a radosť detí</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-6">
              <a href="https://shop.sendeti.sk/DODACIE-PODMIENKY-a4_0.htm" className="hover:text-orange-400">Dodacie podmienky</a>
              <a href="https://shop.sendeti.sk/OBCHODNE-PODMIENKY-a3_0.htm" className="hover:text-orange-400">Obchodné podmienky</a>
              <a href="https://shop.sendeti.sk/GDPR-a6_0.htm" className="hover:text-orange-400">GDPR</a>
              <a href="tel:+421905449916" className="hover:text-orange-400">📞 +421 905 449 916</a>
              <a href="mailto:sendeti@centrum.sk" className="hover:text-orange-400">✉️ sendeti@centrum.sk</a>
            </div>
            <p className="text-gray-600 text-xs">© 2026 Sen Detí</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
