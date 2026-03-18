'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const CATS = [
  {
    name: 'Bytový textil', slug: 'bytovy-textil', emoji: '🛏️',
    subs: ['Obliečky', 'Plachty', 'Deky', 'Vankúšiky', 'Župany', 'Uteráky', 'Osušky', 'Pončá'],
  },
  {
    name: 'Oblečenie', slug: 'oblecenie', emoji: '👗',
    subs: ['Spoločenské šaty', 'Tričká', 'Pyžamá', 'Mikiny', 'Legíny', 'Šaty', 'Plavky', 'Obuv'],
  },
  {
    name: 'Hračky', slug: 'hracky', emoji: '🧸',
    subs: ['Hračky mix', 'Plyšové', 'Vonkajšie', 'Boxy na hračky'],
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
    subs: ['Poháre', 'Taniere', 'Fľaše', 'Príbory', 'Desiatové boxy'],
  },
  {
    name: 'Party', slug: 'party', emoji: '🎉',
    subs: ['Tortové zápichy', 'Party sety', 'Balóny', 'Kostýmy'],
  },
  {
    name: 'Doplnky', slug: 'doplnky', emoji: '✨',
    subs: ['Tašky', 'Hodinky', 'Do vlasov', 'Lampy'],
  },
]

export default function Navbar() {
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const totalItems = useCartStore(s => s.totalItems())
  const openDrawer = useCartStore(s => s.openDrawer)
  const wishlistCount = useWishlistStore(s => s.items?.length ?? 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function goTo(slug: string) {
    setOpenCat(null)
    setMobileOpen(false)
    router.push(`/kategoria/${slug}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/vyhladavanie?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMobileOpen(false)
    }
  }

  return (
    <>
      {/* Top bar */}
      <div style={{ background: 'linear-gradient(90deg, #C874D9, #F7A072)' }}
        className="text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-5">
            <a href="tel:+421905449916" className="hover:underline font-semibold">
              📞 +421 905 449 916
            </a>
            <a href="mailto:sendeti@centrum.sk" className="hover:underline hidden sm:block font-semibold">
              ✉️ sendeti@centrum.sk
            </a>
          </div>
          <div className="hidden sm:flex gap-5 font-semibold">
            <span>🚚 Doprava od 2,90 €</span>
            <span>↩️ Vrátenie 14 dní</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-pink-100'
      }`}>

        {/* Logo + Search + Icons */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 hover:bg-pink-50 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight shrink-0 group">
            <span className="text-xl font-bold tracking-tight transition-opacity group-hover:opacity-80"
              style={{ color: '#F7A072' }}>
              SEN DETÍ
            </span>
            <span className="text-[10px] text-gray-400">pre radosť detí</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Hľadajte produkty..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-pink-200 focus:border-purple-400 focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </form>

          {/* Icons */}
          <div className="flex items-center gap-1 shrink-0 ml-auto lg:ml-0">
            <button className="p-2 hover:bg-pink-50 rounded-full transition-colors relative" aria-label="Obľúbené">
              <Heart size={20} className="text-gray-500" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={openDrawer}
              className="relative p-2 hover:bg-orange-50 rounded-full transition-colors"
              aria-label="Košík"
            >
              <ShoppingCart size={20} className="text-gray-500" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: '#F7A072' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden lg:block border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-4 flex">
            {CATS.map(cat => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setOpenCat(cat.slug)}
                onMouseLeave={() => setOpenCat(null)}
              >
                <button
                  onClick={() => goTo(cat.slug)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
                    openCat === cat.slug
                      ? 'text-orange-500 border-orange-400'
                      : 'text-gray-700 border-transparent hover:text-orange-500 hover:border-orange-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                  <ChevronDown size={12} className={`transition-transform ${openCat === cat.slug ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {openCat === cat.slug && (
                  <div className="absolute top-full left-0 z-50 bg-white rounded-b-2xl shadow-2xl border border-gray-100 p-5 min-w-60"
                    style={{ borderTop: '3px solid #F7A072' }}>
                    <div className="grid grid-cols-2 gap-0.5 mb-3">
                      {cat.subs.map(sub => (
                        <button
                          key={sub}
                          onClick={() => goTo(cat.slug)}
                          className="text-left px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          → {sub}
                        </button>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => goTo(cat.slug)}
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
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden">
          <div className="px-4 pt-4 pb-8">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Hľadajte..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-pink-200 focus:outline-none text-sm"
              />
            </form>

            {CATS.map(cat => (
              <div key={cat.slug} className="border-b border-gray-100">
                <button
                  onClick={() => goTo(cat.slug)}
                  className="w-full flex items-center gap-3 py-4 text-left"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold text-gray-800">{cat.name}</span>
                  <ChevronDown size={16} className="ml-auto text-gray-400" />
                </button>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-2xl text-sm space-y-2"
              style={{ background: 'linear-gradient(135deg, #F5E6F8, #FFF0EB)' }}>
              <a href="tel:+421905449916" className="block font-semibold text-gray-700">📞 +421 905 449 916</a>
              <a href="mailto:sendeti@centrum.sk" className="block text-gray-500">✉️ sendeti@centrum.sk</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
