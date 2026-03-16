'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  {
    name: 'Bytový textil',
    slug: 'bytovy-textil',
    emoji: '🛏️',
    subcategories: ['Obliečky', 'Plachty', 'Deky', 'Vankúšiky', 'Župany', 'Uteráky', 'Osušky', 'Spacie vaky'],
  },
  {
    name: 'Oblečenie',
    slug: 'oblecenie',
    emoji: '👕',
    subcategories: ['Tričká', 'Pyžamá', 'Mikiny & Bundy', 'Legíny & Tepláky', 'Šaty & Sukne', 'Plavky', 'Dojčatá', 'Čiapky'],
  },
  {
    name: 'Hračky',
    slug: 'hracky',
    emoji: '🧸',
    subcategories: ['Hračky mix', 'Boxy na hračky', 'Kreatívne hračky', 'Vonkajšie hračky'],
  },
  {
    name: 'Školské potreby',
    slug: 'skolske-potreby',
    emoji: '🎒',
    subcategories: ['Školské tašky', 'Ruksaky', 'Peračníky', 'Papiernictvo', 'Nálepky'],
  },
  {
    name: 'Kojenecké',
    slug: 'kojenecke',
    emoji: '👶',
    subcategories: ['Oblečenie pre bábätká', 'Hračky pre bábätká', 'Spánok & Cestovanie'],
  },
  {
    name: 'Kuchyňa',
    slug: 'kuchyna',
    emoji: '🍽️',
    subcategories: ['Poháre & Hrnčeky', 'Taniere & Sety', 'Fľaše', 'Desiatové boxy'],
  },
  {
    name: 'Party & Darčeky',
    slug: 'party',
    emoji: '🎉',
    subcategories: ['Tortové zápichy', 'Party sety', 'Balóny', 'Kostýmy', 'Sviečky'],
  },
  {
    name: 'Doplnky',
    slug: 'doplnky',
    emoji: '✨',
    subcategories: ['Tašky & Kabelky', 'Do vlasov', 'Lampy', 'Rôzne'],
  },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalItems = useCartStore(s => s.totalItems())
  const openDrawer = useCartStore(s => s.openDrawer)
  const wishlistCount = useWishlistStore(s => s.items?.length ?? 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/vyhladavanie?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const openMenu = (slug: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(slug)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  return (
    <>
      {/* Top bar */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: 36 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #C874D9, #F7A072)' }}
          >
            <div className="max-w-content mx-auto px-4 h-9 flex items-center justify-between">
              <div className="flex items-center gap-4 text-white text-xs font-semibold">
                <a href="tel:+421000000000" className="hover:opacity-80 transition-opacity">📞 +421 000 000 000</a>
                <a href="mailto:info@sendeti.sk" className="hover:opacity-80 transition-opacity hidden sm:block">✉ info@sendeti.sk</a>
              </div>
              <div className="flex items-center gap-4 text-white text-xs font-semibold">
                <span>🚚 Doprava od 2,90 €</span>
                <span className="hidden sm:block">↩ Vrátenie 14 dní</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'border-b border-pink'
        }`}
      >
        <div className="max-w-content mx-auto px-4">
          {/* Logo + Search + Icons */}
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex flex-col leading-none">
                <span
                  className="font-display text-2xl font-bold"
                  style={{ color: '#C874D9' }}
                >
                  SEN DETÍ
                </span>
                <span className="text-xs text-neutral-400 font-body -mt-0.5">
                  pre radosť detí
                </span>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Hľadajte produkty..."
                  className="w-full h-10 pl-11 pr-4 rounded-full border-2 border-pink bg-pink-light text-sm font-body outline-none focus:border-primary transition-colors placeholder:text-neutral-400"
                />
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-1 ml-auto">
              <Link
                href="/vyhladavanie"
                className="md:hidden p-2.5 hover:bg-pink-light rounded-full transition-colors"
              >
                <Search size={20} className="text-neutral-600" />
              </Link>

              <button
                className="relative p-2.5 hover:bg-pink-light rounded-full transition-colors"
              >
                <Heart size={20} className="text-neutral-600" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={openDrawer}
                className="relative p-2.5 hover:bg-pink-light rounded-full transition-colors"
              >
                <ShoppingCart size={20} className="text-neutral-600" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      style={{ background: '#F7A072' }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 hover:bg-pink-light rounded-full transition-colors ml-1"
              >
                <Menu size={20} className="text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Desktop nav row */}
          <nav className="hidden lg:flex items-center gap-0 border-t border-pink/40 -mx-4 px-4">
            {CATEGORIES.map(cat => (
              <div
                key={cat.slug}
                onMouseEnter={() => openMenu(cat.slug)}
                onMouseLeave={scheduleClose}
                className="relative"
              >
                <Link
                  href={`/kategoria/${cat.slug}`}
                  onClick={() => setActiveMenu(null)}
                  className={`flex items-center gap-1 px-3 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeMenu === cat.slug
                      ? 'text-primary'
                      : 'text-neutral-700 hover:text-primary'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${activeMenu === cat.slug ? 'rotate-180' : ''}`}
                  />
                  {activeMenu === cat.slug && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #C874D9, #F7A072)' }}
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Mega dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
              onMouseLeave={scheduleClose}
              className="absolute left-0 right-0 bg-white border-t border-pink shadow-xl z-40"
              style={{ top: '100%' }}
            >
              <div className="max-w-content mx-auto px-4 py-6">
                {(() => {
                  const cat = CATEGORIES.find(c => c.slug === activeMenu)
                  if (!cat) return null
                  return (
                    <div className="grid grid-cols-4 gap-2">
                      {cat.subcategories.map(sub => (
                        <Link
                          key={sub}
                          href={`/kategoria/${activeMenu}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-primary-light hover:text-primary transition-colors group"
                        >
                          <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                          {sub}
                        </Link>
                      ))}
                      <Link
                        href={`/kategoria/${activeMenu}`}
                        onClick={() => setActiveMenu(null)}
                        className="col-span-4 mt-2 flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                      >
                        Zobraziť všetky — {cat.name} →
                      </Link>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-pink">
                <span className="font-display text-xl font-bold" style={{ color: '#C874D9' }}>
                  SEN DETÍ
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-pink-light rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile search */}
              <form onSubmit={e => { handleSearch(e); setMobileOpen(false) }} className="p-4 border-b border-pink">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Hľadajte..."
                    className="w-full h-10 pl-9 pr-4 rounded-full border-2 border-pink bg-pink-light text-sm outline-none focus:border-primary"
                  />
                </div>
              </form>

              {/* Categories accordion */}
              <div className="flex-1 py-2">
                {CATEGORIES.map(cat => (
                  <div key={cat.slug} className="border-b border-pink/40">
                    <div className="flex items-center">
                      <Link
                        href={`/kategoria/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-neutral-800"
                      >
                        {cat.emoji} {cat.name}
                      </Link>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                        className="px-3 py-3 text-neutral-500"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${mobileExpanded === cat.slug ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    <AnimatePresence>
                      {mobileExpanded === cat.slug && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden bg-pink-light"
                        >
                          <div className="py-2 px-4 space-y-1">
                            {cat.subcategories.map(sub => (
                              <Link
                                key={sub}
                                href={`/kategoria/${cat.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 text-sm text-neutral-600 hover:text-primary transition-colors"
                              >
                                → {sub}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
