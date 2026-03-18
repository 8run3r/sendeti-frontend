'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const CATS = [
  {
    name: 'Bytový textil', slug: 'bytovy-textil', emoji: '🛏️',
    subs: [
      { name: 'Obliečky', filter: 'obliecky' },
      { name: 'Plachty', filter: 'plachty' },
      { name: 'Deky', filter: 'deky' },
      { name: 'Vankúšiky', filter: 'vankusiky' },
      { name: 'Župany', filter: 'zupany' },
      { name: 'Uteráky', filter: 'uteraky' },
    ],
  },
  {
    name: 'Oblečenie', slug: 'oblecenie', emoji: '👗',
    subs: [
      { name: 'Spoločenské šaty', filter: 'spolocenske-saty' },
      { name: 'Tričká', filter: 'tricka' },
      { name: 'Pyžamá', filter: 'pyzama' },
      { name: 'Mikiny', filter: 'mikiny' },
      { name: 'Legíny', filter: 'leginy' },
      { name: 'Šaty & Sukne', filter: 'saty' },
      { name: 'Plavky', filter: 'plavky' },
    ],
  },
  {
    name: 'Hračky', slug: 'hracky', emoji: '🧸',
    subs: [
      { name: 'Hračky mix', filter: 'hracky-mix' },
      { name: 'Plyšové', filter: 'plysove' },
      { name: 'Vonkajšie hračky', filter: 'vonkajsie' },
    ],
  },
  {
    name: 'Školské potreby', slug: 'skolske-potreby', emoji: '🎒',
    subs: [
      { name: 'Školské tašky', filter: 'tasky' },
      { name: 'Ruksaky', filter: 'ruksaky' },
      { name: 'Peračníky', filter: 'peracniky' },
      { name: 'Papiernictvo', filter: 'papiernictvo' },
    ],
  },
  {
    name: 'Kojenecké', slug: 'kojenecke', emoji: '👶',
    subs: [
      { name: 'Oblečenie', filter: 'oblecenie' },
      { name: 'Hračky', filter: 'hracky' },
      { name: 'Spánok', filter: 'spanok' },
    ],
  },
  {
    name: 'Kuchyňa', slug: 'kuchyna', emoji: '🍽️',
    subs: [
      { name: 'Poháre & Hrnčeky', filter: 'pohare' },
      { name: 'Taniere & Sety', filter: 'taniere' },
      { name: 'Fľaše', filter: 'flase' },
      { name: 'Príbory', filter: 'pribory' },
    ],
  },
  {
    name: 'Party & Darčeky', slug: 'party', emoji: '🎉',
    subs: [
      { name: 'Tortové zápichy', filter: 'tortove-zapichy' },
      { name: 'Party sety', filter: 'party-sety' },
      { name: 'Balóny', filter: 'balony' },
    ],
  },
  {
    name: 'Doplnky', slug: 'doplnky', emoji: '✨',
    subs: [
      { name: 'Tašky & Kabelky', filter: 'tasky' },
      { name: 'Hodinky', filter: 'hodinky' },
      { name: 'Do vlasov', filter: 'vlasy' },
    ],
  },
]

export default function Navbar() {
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const totalItems = useCartStore(s => s.totalItems())
  const openCart = useCartStore(s => s.openCart)

  useEffect(() => { setMounted(true) }, [])

  function go(slug: string, filter?: string) {
    setOpenCat(null)
    setMobileOpen(false)
    if (filter) {
      router.push(`/kategoria/${slug}?q=${filter}`)
    } else {
      router.push(`/kategoria/${slug}`)
    }
  }

  return (
    <>
      {/* Promo bar */}
      <div style={{ background: 'linear-gradient(90deg,#C874D9,#F7A072)' }}
           className="text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        <span className="hidden sm:inline">🚚 Doprava zadarmo nad 35 € &nbsp;·&nbsp; </span>
        ↩️ Vrátenie do 14 dní &nbsp;·&nbsp;
        <a href="tel:+421905449916" className="font-bold hover:underline">📞 +421 905 449 916</a>
      </div>

      {/* Main header */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #EBE3F0', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-content mx-auto px-4 py-3 flex items-center gap-4">

          {/* Hamburger */}
          <button className="lg:hidden p-2 rounded-xl hover:bg-blush transition-colors"
                  onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={22} className="text-dark" /> : <Menu size={22} className="text-dark" />}
          </button>

          {/* Logo */}
          <button onClick={() => router.push('/')} className="shrink-0 text-left group">
            <div className="font-display text-2xl font-bold text-coral group-hover:opacity-80 transition-opacity leading-none">
              SEN DETÍ
            </div>
            <div className="text-[10px] text-muted tracking-widest uppercase font-sans">
              pre radosť detí
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden sm:block mx-4">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Hľadajte produkty, kategórie..."
                className="w-full h-10 pl-11 pr-4 rounded-full text-sm font-sans outline-none transition-all"
                style={{ border: '2px solid #EBE3F0', background: '#FEF9F4' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#C874D9'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#EBE3F0'; e.currentTarget.style.background = '#FEF9F4' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) router.push(`/vyhladavanie?q=${encodeURIComponent(val)}`)
                  }
                }}
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <button className="p-2.5 rounded-xl hover:bg-blush transition-colors">
              <Heart size={20} className="text-muted" />
            </button>
            <button onClick={openCart}
                    className="relative p-2.5 rounded-xl hover:bg-blush transition-colors">
              <ShoppingCart size={20} className="text-muted" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-coral
                                 text-white text-[10px] font-bold rounded-full
                                 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden lg:block" style={{ borderTop: '1px solid #EBE3F0' }}>
          <div className="max-w-content mx-auto px-4 flex">
            {CATS.map(cat => (
              <div key={cat.slug} className="relative"
                   onMouseEnter={() => setOpenCat(cat.slug)}
                   onMouseLeave={() => setOpenCat(null)}>
                <button
                  onClick={() => go(cat.slug)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-sm font-semibold
                             whitespace-nowrap border-b-2 transition-all font-sans ${
                    openCat === cat.slug
                      ? 'text-coral border-coral'
                      : 'text-dark border-transparent hover:text-coral hover:border-coral/40'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  {cat.name}
                  <ChevronDown size={11} className={`transition-transform duration-200 ${openCat === cat.slug ? 'rotate-180' : ''}`} />
                </button>

                {openCat === cat.slug && (
                  <div className="absolute top-full left-0 z-50 bg-white rounded-2xl p-5 min-w-[210px]"
                       style={{ border: '1px solid #EBE3F0', borderTop: '3px solid #F7A072', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
                    <div className="space-y-0.5 mb-4">
                      {cat.subs.map(sub => (
                        <button key={sub.filter} onClick={() => go(cat.slug, sub.filter)}
                          className="w-full text-left px-3 py-2 text-sm text-muted rounded-xl
                                     hover:bg-blush hover:text-coral transition-colors font-sans">
                          {sub.name}
                        </button>
                      ))}
                    </div>
                    <div className="pt-3" style={{ borderTop: '1px solid #EBE3F0' }}>
                      <button onClick={() => go(cat.slug)}
                        className="text-sm font-bold text-coral hover:underline font-sans">
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

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden"
             style={{ top: '96px', borderTop: '1px solid #EBE3F0' }}>
          <div className="px-4 py-4">
            <div className="relative mb-5">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                placeholder="Hľadajte..."
                className="w-full h-11 pl-11 pr-4 rounded-full text-sm font-sans outline-none"
                style={{ border: '2px solid #EBE3F0', background: '#FEF9F4' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) { setMobileOpen(false); router.push(`/vyhladavanie?q=${encodeURIComponent(val)}`) }
                  }
                }}
              />
            </div>
            <div className="divide-y divide-gray-100">
              {CATS.map(cat => (
                <div key={cat.slug}>
                  <div className="flex items-center">
                    <button
                      onClick={() => go(cat.slug)}
                      className="flex-1 flex items-center gap-3 py-4 px-2 text-left"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="font-semibold font-sans" style={{ color: '#1C1917' }}>{cat.name}</span>
                    </button>
                    <button
                      onClick={() => setExpandedMobile(expandedMobile === cat.slug ? null : cat.slug)}
                      className="p-4"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform text-muted ${expandedMobile === cat.slug ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedMobile === cat.slug && (
                    <div className="pl-14 pb-3 space-y-0.5">
                      {cat.subs.map(sub => (
                        <button
                          key={sub.filter}
                          onClick={() => go(cat.slug, sub.filter)}
                          className="w-full text-left py-2.5 px-3 text-sm rounded-xl transition-colors font-sans hover:bg-blush hover:text-coral"
                          style={{ color: '#78716C' }}
                        >
                          → {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
