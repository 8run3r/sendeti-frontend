'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const CATS = [
  { name: 'Bytový textil',  slug: 'bytovy-textil',   emoji: '🛏️', subs: ['Obliečky','Plachty','Deky','Vankúšiky','Župany','Uteráky'] },
  { name: 'Oblečenie',      slug: 'oblecenie',        emoji: '👗',  subs: ['Spoločenské šaty','Tričká','Pyžamá','Mikiny','Legíny','Šaty'] },
  { name: 'Hračky',         slug: 'hracky',           emoji: '🧸',  subs: ['Hračky mix','Plyšové','Vonkajšie'] },
  { name: 'Školské potreby',slug: 'skolske-potreby',  emoji: '🎒',  subs: ['Školské tašky','Ruksaky','Peračníky','Papiernictvo'] },
  { name: 'Kojenecké',      slug: 'kojenecke',        emoji: '👶',  subs: ['Oblečenie','Hračky','Spánok'] },
  { name: 'Kuchyňa',        slug: 'kuchyna',          emoji: '🍽️', subs: ['Poháre','Taniere','Fľaše','Príbory'] },
  { name: 'Party',          slug: 'party',            emoji: '🎉',  subs: ['Tortové zápichy','Party sety','Balóny'] },
  { name: 'Doplnky',        slug: 'doplnky',          emoji: '✨',  subs: ['Tašky','Hodinky','Do vlasov'] },
]

export default function Navbar() {
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const totalItems = useCartStore(s => s.totalItems())
  const openCart = useCartStore(s => s.openCart)

  function navigate(slug: string) {
    setOpenCat(null)
    setMobileOpen(false)
    router.push(`/kategoria/${slug}`)
  }

  return (
    <>
      {/* Top bar */}
      <div style={{ background: 'linear-gradient(90deg,#a855c7,#f97316)' }}
        className="text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 font-semibold">
            <a href="tel:+421905449916" className="hover:opacity-80">📞 +421 905 449 916</a>
            <a href="mailto:sendeti@centrum.sk" className="hover:opacity-80 hidden sm:block">✉️ sendeti@centrum.sk</a>
          </div>
          <div className="hidden sm:flex gap-4 font-semibold">
            <span>🚚 Doprava od 2,90 €</span>
            <span>↩️ Vrátenie 14 dní</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <button onClick={() => router.push('/')} className="shrink-0 text-left">
            <div className="text-xl font-bold text-orange-400 leading-tight">SEN DETÍ</div>
            <div className="text-[10px] text-gray-400">pre radosť detí</div>
          </button>

          <div className="flex-1 relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Hľadajte produkty..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-pink-200 focus:border-purple-400 focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) router.push(`/vyhladavanie?q=${encodeURIComponent(val)}`)
                }
              }}
            />
          </div>

          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <button className="p-2 hover:bg-pink-50 rounded-full transition-colors">
              <Heart size={20} className="text-gray-500" />
            </button>
            <button onClick={openCart} className="relative p-2 hover:bg-orange-50 rounded-full transition-colors">
              <ShoppingCart size={20} className="text-gray-500" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex">
            {CATS.map(cat => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setOpenCat(cat.slug)}
                onMouseLeave={() => setOpenCat(null)}
              >
                <button
                  onClick={() => navigate(cat.slug)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                    openCat === cat.slug
                      ? 'text-orange-500 border-orange-400'
                      : 'text-gray-700 border-transparent hover:text-orange-500 hover:border-orange-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                  <ChevronDown size={12} className={`transition-transform ${openCat === cat.slug ? 'rotate-180' : ''}`} />
                </button>

                {openCat === cat.slug && (
                  <div
                    className="absolute top-full left-0 z-50 bg-white rounded-b-2xl shadow-2xl border border-gray-100 p-4 min-w-52"
                    style={{ borderTop: '3px solid #f97316' }}
                  >
                    <div className="grid grid-cols-2 gap-0.5 mb-3">
                      {cat.subs.map(sub => (
                        <button
                          key={sub}
                          onClick={() => navigate(cat.slug)}
                          className="text-left px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(cat.slug)}
                        className="text-sm font-bold text-orange-500 hover:underline"
                      >
                        Zobraziť všetky {cat.name} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden" style={{ top: '109px' }}>
          <div className="px-4 py-4 space-y-1">
            {CATS.map(cat => (
              <button
                key={cat.slug}
                onClick={() => navigate(cat.slug)}
                className="w-full flex items-center gap-3 py-4 px-4 rounded-xl hover:bg-orange-50 text-left transition-colors"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-semibold text-gray-800">{cat.name}</span>
                <ChevronDown size={16} className="ml-auto text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
