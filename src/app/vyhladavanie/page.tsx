'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
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
    <div className="min-h-screen py-12 px-4" style={{ background: '#FEF9F4' }}>
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#F7A072' }}>
            Vyhľadávanie
          </p>
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1C1917' }}>
            Hľadajte produkty
          </h1>
          <p className="font-sans text-sm" style={{ color: '#78716C' }}>
            Nájdite presne to, čo hľadáte
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                   style={{ color: '#78716C' }} />
            <input
              type="text"
              value={query}
              autoFocus
              onChange={e => { setQuery(e.target.value); setShowSug(true) }}
              onKeyDown={e => e.key === 'Enter' && go(query)}
              onFocus={() => setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 200)}
              placeholder="Hľadajte produkty..."
              className="w-full h-14 pl-14 pr-12 rounded-full text-sm font-sans outline-none transition-all"
              style={{ border: '2px solid #EBE3F0', background: 'white' }}
              onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C874D9' }}
              onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#EBE3F0' }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setSubmitted('') }}
                      className="absolute right-5 top-1/2 -translate-y-1/2">
                <X size={16} style={{ color: '#78716C' }} />
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSug && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-2xl mt-2 overflow-hidden z-10"
                 style={{ border: '1px solid #EBE3F0', boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}>
              {suggestions.map(p => (
                <button key={p.id} onClick={() => go(p.name)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-blush">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-sans" style={{ color: '#1C1917' }}>{p.name}</p>
                    <p className="text-xs font-sans" style={{ color: '#78716C' }}>{p.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular tags */}
        {!submitted && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: '#78716C' }} />
              <span className="text-xs font-bold uppercase tracking-widest font-sans" style={{ color: '#78716C' }}>
                Populárne hľadania
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(t => (
                <button key={t} onClick={() => go(t)}
                  className="px-4 py-2 bg-white rounded-full text-sm font-semibold font-sans transition-colors hover:text-coral hover:border-coral"
                  style={{ border: '1px solid #EBE3F0', color: '#78716C' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div>
            <p className="text-sm font-semibold font-sans mb-6" style={{ color: '#78716C' }}>
              {results.length > 0
                ? <><strong style={{ color: '#1C1917' }}>{results.length}</strong> výsledkov pre „{submitted}"</>
                : <>Žiadne výsledky pre „{submitted}"</>
              }
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl" style={{ border: '1px solid #EBE3F0' }}>
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1C1917' }}>Nenašli sme nič</h3>
                <p className="text-sm font-sans" style={{ color: '#78716C' }}>Skúste iné kľúčové slovo</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map(p => (
                  <FeedProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FEF9F4' }}>
        <p className="font-sans" style={{ color: '#78716C' }}>Načítavam...</p>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
