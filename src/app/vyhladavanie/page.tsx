'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Search, X, TrendingUp } from 'lucide-react'
import { FeedProductCard } from '@/components/product/FeedProductCard'
import type { Product } from '@/lib/feed'

const POPULAR = ['obliečky', 'plyšák', 'batoh', 'šaty', 'deka', 'hračky', 'pyžamo']

function SearchPageInner() {
  const sp = useSearchParams()
  const initialQ = sp.get('q') ?? ''

  const [query, setQuery] = useState(initialQ)
  const [submitted, setSubmitted] = useState(initialQ)
  const [showSug, setShowSug] = useState(false)
  const [all, setAll] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/feed').then(r => r.json()).then(setAll).catch(() => {})
  }, [])

  useEffect(() => {
    if (initialQ) { setQuery(initialQ); setSubmitted(initialQ) }
  }, [initialQ])

  const suggestions = useMemo(() =>
    query.length < 2 ? [] :
    all.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
  , [query, all])

  const results = useMemo(() =>
    !submitted ? [] :
    all.filter(p =>
      p.name.toLowerCase().includes(submitted.toLowerCase()) ||
      p.category.toLowerCase().includes(submitted.toLowerCase()) ||
      p.description.toLowerCase().includes(submitted.toLowerCase())
    )
  , [submitted, all])

  const go = (q: string) => { setSubmitted(q); setQuery(q); setShowSug(false) }

  return (
    <div className="min-h-screen py-12" style={{ background: '#FAFAFA' }}>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-2">Hľadajte produkty</h1>
          <p className="font-body text-neutral-500">Nájdite presne to, čo hľadáte</p>
        </motion.div>

        <div className="relative mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              autoFocus
              onChange={e => { setQuery(e.target.value); setShowSug(true) }}
              onKeyDown={e => e.key === 'Enter' && go(query)}
              onFocus={() => setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 200)}
              placeholder="Hľadajte produkty..."
              className="w-full h-14 pl-14 pr-12 rounded-2xl text-sm font-body outline-none transition-all"
              style={{ border: '2px solid #E1BBC9', background: 'white' }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setSubmitted('') }} className="absolute right-5 top-1/2 -translate-y-1/2">
                <X size={16} className="text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSug && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl mt-2 overflow-hidden z-10"
                style={{ border: '1px solid #E1BBC9' }}
              >
                {suggestions.map(p => (
                  <button key={p.id} onClick={() => go(p.name)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-pink-light transition-colors text-left"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.category}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!submitted && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-neutral-400" />
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Populárne hľadania</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(t => (
                <button key={t} onClick={() => go(t)}
                  className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-neutral-700 hover:border-primary hover:text-primary transition-colors"
                  style={{ border: '1px solid #E1BBC9' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted && (
            <motion.div key={submitted} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-semibold text-neutral-500 mb-6">
                {results.length > 0
                  ? <><strong>{results.length}</strong> výsledkov pre „{submitted}"</>
                  : <>Žiadne výsledky pre „{submitted}"</>
                }
              </p>
              {results.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl" style={{ border: '1px solid #E1BBC9' }}>
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-display text-xl font-bold text-neutral-900 mb-2">Nenašli sme nič</p>
                  <p className="text-sm text-neutral-400">Skúste iné kľúčové slovo</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <FeedProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-neutral-400">Načítavam...</p></div>}>
      <SearchPageInner />
    </Suspense>
  )
}
