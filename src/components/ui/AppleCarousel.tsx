'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

interface CarouselCard {
  title: string
  slug: string
  emoji: string
  bg: string
  count?: number
}

export function AppleCarousel({ cards }: { cards: CarouselCard[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function checkScroll() {
    if (!ref.current) return
    setCanScrollLeft(ref.current.scrollLeft > 0)
    setCanScrollRight(
      ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10
    )
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  function scroll(dir: 'left' | 'right') {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform -translate-x-2 font-bold text-gray-600"
          aria-label="Scroll left"
        >
          ←
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform translate-x-2 font-bold text-gray-600"
          aria-label="Scroll right"
        >
          →
        </button>
      )}

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, i) => (
          <Link key={card.slug} href={`/kategoria/${card.slug}`} className="flex-shrink-0">
            <div
              className="relative w-64 h-80 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ background: card.bg, animationDelay: `${i * 50}ms` }}
            >
              {/* Big emoji background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[120px] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
                  {card.emoji}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-3xl">{card.emoji}</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 font-sans">
                    Kategória
                  </p>
                  <h3 className="font-display text-2xl font-bold text-gray-900 leading-tight mb-1">
                    {card.title}
                  </h3>
                  {card.count !== undefined && card.count > 0 && (
                    <p className="text-sm text-gray-500 font-medium font-sans">
                      {card.count} produktov
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1 font-bold text-sm font-sans group-hover:gap-2 transition-all"
                       style={{ color: '#F7A072' }}>
                    Nakupovať
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
