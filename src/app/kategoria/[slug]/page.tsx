'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { SlidersHorizontal, Grid, List, ChevronDown } from 'lucide-react'
import { FeedProductCard } from '@/components/product/FeedProductCard'
import type { Product } from '@/lib/feed'

type Sort = 'default' | 'price-asc' | 'price-desc'

const sortOpts: { value: Sort; label: string }[] = [
  { value: 'default', label: 'Najpopulárnejšie' },
  { value: 'price-asc', label: 'Cena: najnižšia' },
  { value: 'price-desc', label: 'Cena: najvyššia' },
]

const CATEGORY_NAMES: Record<string, string> = {
  'bytovy-textil': 'Bytový textil',
  'oblecenie': 'Oblečenie',
  'hracky': 'Hračky',
  'skolske-potreby': 'Školské potreby',
  'kojenecke': 'Kojenecké',
  'kuchyna': 'Kuchyňa',
  'party': 'Party & Darčeky',
  'doplnky': 'Doplnky',
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const categoryName = CATEGORY_NAMES[slug] ?? slug

  const [all, setAll] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [maxPrice, setMaxPrice] = useState(250)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('default')
  const [gridView, setGridView] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setShowAll(false)
    fetch('/api/feed')
      .then(r => r.json())
      .then((data: Product[]) => {
        const filtered = slug === 'vsetky' ? data : data.filter(p => p.categorySlug === slug)
        setAll(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const filtered = useMemo(() => {
    let r = all.filter(p => p.price <= maxPrice)
    if (inStockOnly) r = r.filter(p => p.inStock)
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price)
    return r
  }, [all, maxPrice, inStockOnly, sort])

  const displayed = showAll ? filtered : filtered.slice(0, 12)

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div
        className="py-14 px-4"
        style={{ background: 'linear-gradient(135deg, #F5E6F8 0%, white 70%)' }}
      >
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Domov</Link>
            <span>/</span>
            <span className="text-neutral-700">{categoryName}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-1">
            {categoryName}
          </h1>
          <p className="font-body text-neutral-500">
            {loading ? 'Načítavam...' : `${filtered.length} produktov`}
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-60 flex-shrink-0`}>
            <div
              className="rounded-2xl p-5 sticky top-24 space-y-5"
              style={{ border: '1px solid #E1BBC9' }}
            >
              <h3 className="font-display text-lg font-bold text-neutral-900">Filtre</h3>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Cena</p>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>0 €</span><span>{maxPrice} €</span>
                </div>
                <input
                  type="range" min={0} max={250} value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Dostupnosť</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm font-semibold text-neutral-700">Iba skladom</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid #E1BBC9' }}
              >
                <SlidersHorizontal size={14} /> Filtre
              </button>

              <div className="flex-1" />

              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as Sort)}
                  className="h-9 pl-3 pr-8 rounded-xl text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{ border: '1px solid #E1BBC9' }}
                >
                  {sortOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
              </div>

              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #E1BBC9' }}>
                <button
                  onClick={() => setGridView(true)}
                  className="p-2 transition-colors"
                  style={{ background: gridView ? '#C874D9' : 'transparent', color: gridView ? 'white' : '#9ca3af' }}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className="p-2 transition-colors"
                  style={{ background: !gridView ? '#C874D9' : 'transparent', color: !gridView ? 'white' : '#9ca3af' }}
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-3xl bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sort}-${inStockOnly}-${maxPrice}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={gridView
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'}
                >
                  {displayed.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                      <p className="text-5xl mb-4">🔍</p>
                      <p className="font-display text-xl font-bold text-neutral-900 mb-2">Žiadne produkty</p>
                      <p className="text-sm text-neutral-400">Skúste upraviť filtre</p>
                    </div>
                  ) : displayed.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <FeedProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!showAll && filtered.length > 12 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 rounded-2xl font-bold text-sm transition-all"
                  style={{ border: '2px solid #C874D9', color: '#C874D9' }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = '#C874D9'
                    ;(e.target as HTMLButtonElement).style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = 'transparent'
                    ;(e.target as HTMLButtonElement).style.color = '#C874D9'
                  }}
                >
                  Načítať viac ({filtered.length - 12} ďalších)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
