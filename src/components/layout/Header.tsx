'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  {
    name: 'Bytový textil',
    slug: 'bytovy-textil',
    emoji: '🛏️',
    color: '#6BA3E8',
    bg: '#EBF4FF',
    subcategories: [
      'Obliečky', 'Plachty', 'Deky',
      'Vankúšiky', 'Župany', 'Uteráky',
      'Osušky', 'Pončá', 'Spacie vaky',
      'Zvýhodnené balenie',
    ],
  },
  {
    name: 'Oblečenie',
    slug: 'oblecenie',
    emoji: '👕',
    color: '#E8678A',
    bg: '#FCE4EC',
    subcategories: [
      'Spoločenské šaty', 'Tričká', 'Pyžamá',
      'Mikiny & Bundy', 'Legíny & Tepláky',
      'Šaty & Sukne', 'Plavky', 'Obuv',
      'Dojčatá', 'Čiapky',
    ],
  },
  {
    name: 'Hračky',
    slug: 'hracky',
    emoji: '🧸',
    color: '#29B6C8',
    bg: '#E0F7FA',
    subcategories: [
      'Hračky mix', 'Boxy na hračky',
      'Plyšové hračky', 'Vonkajšie hračky',
    ],
  },
  {
    name: 'Školské potreby',
    slug: 'skolske-potreby',
    emoji: '🎒',
    color: '#E8963A',
    bg: '#FFF3E0',
    subcategories: [
      'Školské tašky', 'Ruksaky',
      'Peračníky', 'Papiernictvo',
      'Nálepky', 'Vrecká na prezúvky',
    ],
  },
  {
    name: 'Kojenecké',
    slug: 'kojenecke',
    emoji: '👶',
    color: '#B06DD4',
    bg: '#F3E5F5',
    subcategories: [
      'Oblečenie pre bábätká',
      'Hračky pre bábätká',
      'Spánok',
    ],
  },
  {
    name: 'Kuchyňa',
    slug: 'kuchyna',
    emoji: '🍽️',
    color: '#D4A829',
    bg: '#FFF8E1',
    subcategories: [
      'Poháre & Hrnčeky', 'Taniere & Sety',
      'Fľaše', 'Príbory',
      'Desiatové boxy', 'Zástery',
    ],
  },
  {
    name: 'Party & Darčeky',
    slug: 'party',
    emoji: '🎉',
    color: '#4CAF72',
    bg: '#E8F5E9',
    subcategories: [
      'Tortové zápichy', 'Party sety',
      'Balóny', 'Kostýmy', 'Sviečky',
    ],
  },
  {
    name: 'Doplnky',
    slug: 'doplnky',
    emoji: '✨',
    color: '#F7A072',
    bg: '#FFF0EB',
    subcategories: [
      'Tašky & Kabelky', 'Hodiny & Hodinky',
      'Do vlasov', 'Lampy',
    ],
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
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const activeCat = CATEGORIES.find(c => c.slug === activeMenu)

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
            style={{ background: 'linear-gradient(90deg, #C874D9 0%, #F7A072 100%)' }}
          >
            <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
              <div className="flex items-center gap-5 text-white text-xs font-semibold">
                <a href="tel:+421905449916" className="hover:opacity-80 transition-opacity">
                  📞 +421 905 449 916
                </a>
                <a href="mailto:sendeti@centrum.sk" className="hover:opacity-80 transition-opacity hidden sm:block">
                  ✉ sendeti@centrum.sk
                </a>
              </div>
              <div className="flex items-center gap-5 text-white text-xs font-semibold">
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
          scrolled ? 'shadow-lg' : 'border-b border-pink-100'
        }`}
      >
        {/* Logo + Search + Icons row */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-5">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-2xl font-bold tracking-tight transition-opacity group-hover:opacity-80"
                style={{ color: '#C874D9' }}
              >
                SEN DETÍ
              </span>
              <span className="text-[10px] text-neutral-400 font-body -mt-0.5 tracking-wide">
                pre radosť detí
              </span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Hľadajte produkty..."
                className="w-full h-11 pl-11 pr-4 rounded-full border-2 border-pink-200 bg-pink-50 text-sm font-body outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-neutral-400"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-1 ml-auto">
            <Link
              href="/vyhladavanie"
              className="md:hidden p-2.5 hover:bg-pink-50 rounded-full transition-colors"
            >
              <Search size={20} className="text-neutral-600" />
            </Link>

            <button className="relative p-2.5 hover:bg-pink-50 rounded-full transition-colors">
              <Heart size={20} className="text-neutral-600" />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: '#C874D9' }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={openDrawer}
              className="relative p-2.5 hover:bg-pink-50 rounded-full transition-colors"
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
              className="lg:hidden p-2.5 hover:bg-pink-50 rounded-full transition-colors ml-1"
            >
              <Menu size={20} className="text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Category nav row */}
        <nav className="hidden lg:block border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-6 flex">
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
                  className="flex items-center gap-1.5 px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors relative"
                  style={{
                    color: activeMenu === cat.slug ? cat.color : '#374151',
                  }}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${activeMenu === cat.slug ? 'rotate-180' : ''}`}
                  />
                  {activeMenu === cat.slug && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: cat.color }}
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* Mega dropdown */}
        <AnimatePresence>
          {activeMenu && activeCat && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
              onMouseLeave={scheduleClose}
              className="absolute left-0 right-0 bg-white shadow-2xl z-40 border-b border-pink-100"
              style={{ top: '100%', borderTop: `3px solid ${activeCat.color}` }}
            >
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-6">
                {/* Subcategories — 3 cols */}
                <div className="col-span-3 grid grid-cols-3 gap-1 content-start">
                  {activeCat.subcategories.map(sub => (
                    <Link
                      key={sub}
                      href={`/kategoria/${activeCat.slug}`}
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors group"
                      style={{ ['--hover-bg' as string]: activeCat.bg }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = activeCat.bg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <span
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                        style={{ color: activeCat.color }}
                      >→</span>
                      {sub}
                    </Link>
                  ))}
                  <Link
                    href={`/kategoria/${activeCat.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="col-span-3 mt-3 flex items-center gap-2 text-xs font-bold hover:underline"
                    style={{ color: activeCat.color }}
                  >
                    Zobraziť všetky — {activeCat.name} →
                  </Link>
                </div>

                {/* Featured panel */}
                <div
                  className="rounded-2xl p-5 flex flex-col justify-between"
                  style={{ background: activeCat.bg }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} style={{ color: activeCat.color }} />
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: activeCat.color }}>
                        Nové
                      </span>
                    </div>
                    <span className="text-4xl">{activeCat.emoji}</span>
                    <p className="mt-3 text-sm font-bold text-neutral-800 leading-snug">
                      {activeCat.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Pozrite čerstvé novinky
                    </p>
                  </div>
                  <Link
                    href={`/kategoria/${activeCat.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: activeCat.color }}
                  >
                    Otvoriť kategóriu →
                  </Link>
                </div>
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
              <div className="flex items-center justify-between p-4 border-b border-pink-100">
                <span className="font-display text-xl font-bold" style={{ color: '#C874D9' }}>
                  SEN DETÍ
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-pink-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile search */}
              <form onSubmit={e => { handleSearch(e); setMobileOpen(false) }} className="p-4 border-b border-pink-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Hľadajte..."
                    className="w-full h-10 pl-9 pr-4 rounded-full border-2 border-pink-200 bg-pink-50 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </form>

              {/* Categories accordion */}
              <div className="flex-1 py-2">
                {CATEGORIES.map(cat => (
                  <div key={cat.slug} className="border-b border-pink-50">
                    <div className="flex items-center">
                      <Link
                        href={`/kategoria/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-4 py-3.5 text-sm font-semibold text-neutral-800 flex items-center gap-2"
                      >
                        <span>{cat.emoji}</span> {cat.name}
                      </Link>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                        className="px-4 py-3.5 text-neutral-400"
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
                          className="overflow-hidden"
                          style={{ background: cat.bg }}
                        >
                          <div className="py-2 px-4 space-y-0.5">
                            {cat.subcategories.map(sub => (
                              <Link
                                key={sub}
                                href={`/kategoria/${cat.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 px-2 text-sm text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors"
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

              {/* Mobile footer */}
              <div
                className="p-4 text-xs text-white space-y-1"
                style={{ background: 'linear-gradient(90deg, #C874D9, #F7A072)' }}
              >
                <a href="tel:+421905449916" className="block font-semibold">📞 +421 905 449 916</a>
                <a href="mailto:sendeti@centrum.sk" className="block">✉ sendeti@centrum.sk</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
