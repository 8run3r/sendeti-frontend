'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const CATS = [
  {
    name: 'Bytový textil', slug: 'bytovy-textil', emoji: '🛏️',
    subs: ['Obliečky', 'Plachty', 'Deky', 'Vankúšiky', 'Župany', 'Uteráky', 'Osušky'],
  },
  {
    name: 'Oblečenie', slug: 'oblecenie', emoji: '👗',
    subs: ['Spoločenské šaty', 'Tričká', 'Pyžamá', 'Mikiny', 'Legíny', 'Šaty', 'Plavky'],
  },
  {
    name: 'Hračky', slug: 'hracky', emoji: '🧸',
    subs: ['Hračky mix', 'Plyšové', 'Vonkajšie'],
  },
  {
    name: 'Školské potreby', slug: 'skolske-potreby', emoji: '🎒',
    subs: ['Školské tašky', 'Ruksaky', 'Peračníky', 'Papiernictvo'],
  },
  {
    name: 'Kojenecké', slug: 'kojenecke', emoji: '👶',
    subs: ['Oblečenie', 'Hračky', 'Spánok'],
  },
  {
    name: 'Kuchyňa', slug: 'kuchyna', emoji: '🍽️',
    subs: ['Poháre', 'Taniere', 'Fľaše', 'Príbory'],
  },
  {
    name: 'Party', slug: 'party', emoji: '🎉',
    subs: ['Tortové zápichy', 'Party sety', 'Balóny'],
  },
  {
    name: 'Doplnky', slug: 'doplnky', emoji: '✨',
    subs: ['Tašky', 'Hodinky', 'Do vlasov'],
  },
]

export default function Navbar() {
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const totalItems = useCartStore(s => s.totalItems())
  const openCart = useCartStore(s => s.openCart)

  function go(slug: string) {
    setOpenCat(null)
    setMobileOpen(false)
    router.push(`/kategoria/${slug}`)
  }

  return (
    <>
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-purple to-coral text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 font-medium">
            <a href="tel:+421905449916" className="hover:opacity-80">
              📞 +421 905 449 916
            </a>
            <a href="mailto:sendeti@centrum.sk" className="hidden sm:block hover:opacity-80">
              ✉️ sendeti@centrum.sk
            </a>
          </div>
          <div className="hidden sm:flex gap-4 font-medium">
            <span>🚚 Doprava od 2,90 €</span>
            <span>↩️ Vrátenie 14 dní</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b border-pink sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <button onClick={() => router.push('/')} className="shrink-0 text-left">
            <div className="font-display text-2xl font-bold text-coral leading-none">
              SEN DETÍ
            </div>
            <div className="text-[10px] text-gray-400 font-sans tracking-wide">
              pre radosť detí
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 relative hidden sm:block">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Hľadajte produkty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-pink
                         focus:border-purple focus:outline-none text-sm bg-gray-50
                         focus:bg-white transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) router.push(`/vyhladavanie?q=${encodeURIComponent(val)}`)
                }
              }}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <button className="p-2 hover:bg-pink/30 rounded-full transition-colors">
              <Heart size={20} className="text-gray-500" />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-coral/10 rounded-full transition-colors"
            >
              <ShoppingCart size={20} className="text-gray-500" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-coral
                                 text-white text-[10px] font-bold rounded-full
                                 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
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
                  onClick={() => go(cat.slug)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-sm font-semibold
                             whitespace-nowrap border-b-2 transition-all ${
                    openCat === cat.slug
                      ? 'text-coral border-coral'
                      : 'text-gray-700 border-transparent hover:text-coral hover:border-coral/40'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${openCat === cat.slug ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega dropdown */}
                {openCat === cat.slug && (
                  <div
                    className="absolute top-full left-0 z-50 bg-white rounded-b-2xl
                               shadow-2xl border border-gray-100 p-5 min-w-[220px]"
                    style={{ borderTop: '3px solid #F7A072' }}
                  >
                    <div className="space-y-0.5 mb-4">
                      {cat.subs.map(sub => (
                        <button
                          key={sub}
                          onClick={() => go(cat.slug)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600
                                     rounded-xl hover:bg-coral/10 hover:text-coral transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => go(cat.slug)}
                        className="text-sm font-bold text-coral hover:underline flex items-center gap-1"
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

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden"
          style={{ top: '109px' }}
        >
          <div className="px-4 py-4">
            {/* Mobile search */}
            <div className="relative mb-6">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Hľadajte..."
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-pink
                           focus:border-purple focus:outline-none text-sm"
              />
            </div>
            {/* Categories */}
            <div className="space-y-1">
              {CATS.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => go(cat.slug)}
                  className="w-full flex items-center gap-3 py-4 px-4 rounded-2xl
                             hover:bg-coral/10 text-left transition-colors"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold text-gray-800 text-base">{cat.name}</span>
                  <ChevronDown size={16} className="ml-auto text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
