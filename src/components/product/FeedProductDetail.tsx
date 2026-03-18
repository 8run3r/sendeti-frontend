'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, ExternalLink, Truck, RotateCcw, Shield, Check, Minus, Plus } from 'lucide-react'
import type { Product } from '@/lib/feed'
import { formatPrice } from '@/lib/feed'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { showToast } from '@/components/ui/Toast'

export function FeedProductDetail({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [sticky, setSticky] = useState(false)
  const btnRef = useRef<HTMLDivElement>(null)

  const addItem = useCartStore(s => s.addItem)
  const toggle = useWishlistStore(s => s.toggle)
  const isWished = useWishlistStore(s => s.hasItem(product.id))

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting), { threshold: 0 })
    if (btnRef.current) obs.observe(btnRef.current)
    return () => obs.disconnect()
  }, [])

  const handleCart = () => {
    if (!product.inStock) return
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price,
                image: product.image, slug: product.slug, shopUrl: product.shopUrl, inStock: product.inStock })
    }
    showToast(`✓ Pridané do košíka`)
  }

  return (
    <div style={{ background: '#FEF9F4' }} className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white px-6 py-3" style={{ borderBottom: '1px solid #EBE3F0' }}>
        <div className="max-w-content mx-auto flex items-center gap-2 text-xs font-sans flex-wrap"
             style={{ color: '#78716C' }}>
          <Link href="/" className="hover:text-coral transition-colors font-semibold">Domov</Link>
          <span>/</span>
          <Link href={`/kategoria/${product.categorySlug}`}
                className="hover:text-coral transition-colors font-semibold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-bold line-clamp-1" style={{ color: '#1C1917' }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white mb-4"
                 style={{ border: '1px solid #EBE3F0' }}>
              <Image
                src={product.images[activeImg] ?? product.image}
                alt={product.name}
                fill priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              {discount && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-black text-white font-sans"
                     style={{ background: '#F7A072' }}>
                  -{discount}%
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                          className="relative w-16 h-16 rounded-2xl overflow-hidden transition-all"
                          style={{ border: `2px solid ${activeImg === i ? '#C874D9' : '#EBE3F0'}` }}>
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:sticky lg:top-28 self-start">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#78716C' }}>
              {product.category}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5"
                style={{ color: '#1C1917' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-bold text-3xl font-sans" style={{ color: '#F7A072' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through font-sans" style={{ color: '#78716C' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm font-black px-2 py-0.5 rounded-full text-white font-sans"
                          style={{ background: '#F7A072' }}>
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-7">
              <span className="w-2.5 h-2.5 rounded-full"
                    style={{ background: product.inStock ? '#16A34A' : '#EF4444' }} />
              <span className="text-sm font-semibold font-sans" style={{ color: '#78716C' }}>
                {product.inStock ? 'Skladom — pripravené na odoslanie' : 'Momentálne nedostupné'}
              </span>
            </div>

            <div ref={btnRef} className="flex gap-3 mb-4">
              <div className="flex items-center rounded-xl" style={{ border: '2px solid #EBE3F0', background: 'white' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-3 transition-colors hover:text-coral">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-sm font-sans">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                        className="p-3 transition-colors hover:text-coral">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleCart} disabled={!product.inStock}
                      className="flex-1 h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 font-sans transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#C874D9,#a855c7)', boxShadow: '0 8px 24px rgba(200,116,217,0.35)' }}>
                <ShoppingCart size={16} /> Pridať do košíka
              </button>
              <button onClick={() => { toggle(product.id); showToast(isWished ? 'Odstránené' : '♡ Pridané') }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                      style={{ border: '2px solid #EBE3F0', background: isWished ? '#F3ECFC' : 'white' }}>
                <Heart size={18} style={{ color: isWished ? '#C874D9' : '#78716C', fill: isWished ? '#C874D9' : 'none' }} />
              </button>
            </div>

            <a href={product.shopUrl}
               className="flex items-center justify-center gap-1.5 text-sm transition-colors mb-7 font-sans"
               style={{ color: '#78716C' }}
               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1C1917' }}
               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#78716C' }}>
              <ExternalLink size={12} /> Kúpiť priamo na sendeti.sk →
            </a>

            <div className="rounded-2xl p-5 space-y-3.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              {[
                { icon: Truck,     text: 'Doprava od 2,90 € | Zadarmo nad 35 €' },
                { icon: RotateCcw, text: 'Vrátenie tovaru do 14 dní' },
                { icon: Shield,    text: 'Certifikované a bezpečné produkty' },
                { icon: Check,     text: 'Doručenie do 2–3 pracovných dní' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold font-sans"
                     style={{ color: '#166534' }}>
                  <Icon size={15} className="flex-shrink-0" style={{ color: '#16A34A' }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-16 max-w-2xl bg-white rounded-3xl p-8" style={{ border: '1px solid #EBE3F0' }}>
            <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#1C1917' }}>Popis produktu</h2>
            <p className="font-sans leading-relaxed whitespace-pre-line" style={{ color: '#78716C' }}>
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky add to cart bar */}
      {sticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 z-40"
             style={{ borderTop: '1px solid #EBE3F0', boxShadow: '0 -8px 32px rgba(0,0,0,0.08)' }}>
          <div className="max-w-content mx-auto flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold line-clamp-1 font-sans" style={{ color: '#1C1917' }}>{product.name}</p>
              <span className="font-bold font-sans" style={{ color: '#F7A072' }}>{formatPrice(product.price)}</span>
            </div>
            <button onClick={handleCart} disabled={!product.inStock}
                    className="h-11 px-6 rounded-xl font-bold text-white text-sm flex items-center gap-2 font-sans transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#C874D9,#a855c7)' }}>
              <ShoppingCart size={15} /> Pridať do košíka
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
