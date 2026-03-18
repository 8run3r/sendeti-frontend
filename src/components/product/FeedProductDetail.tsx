'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  const openCart = useCartStore(s => s.openCart)
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
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug, shopUrl: product.shopUrl, inStock: product.inStock })
    }
    showToast(`✓ Pridané do košíka`)
    openCart()
  }

  const deliveryItems: Array<{ icon: React.ElementType; text: string }> = [
    { icon: Truck,     text: 'Doprava od 2,90 € | Zadarmo nad 35 €' },
    { icon: RotateCcw, text: 'Vrátenie tovaru do 14 dní' },
    { icon: Shield,    text: 'Certifikované a bezpečné produkty' },
    { icon: Check,     text: 'Doručenie do 2–3 pracovných dní' },
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="py-3 px-4" style={{ borderBottom: '1px solid #E1BBC9' }}>
        <div className="max-w-content mx-auto flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
          <Link href="/" className="hover:text-primary font-semibold">Domov</Link>
          <span>/</span>
          <Link href={`/kategoria/${product.categorySlug}`} className="hover:text-primary font-semibold">{product.category}</Link>
          <span>/</span>
          <span className="text-neutral-600 font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-pink-50 mb-4">
              <AnimatePresence mode="wait">
                <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <Image src={product.images[activeImg] ?? product.image} alt={product.name} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              {discount && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-black text-white" style={{ background: 'linear-gradient(135deg,#F7A072,#e8875a)' }}>
                  -{discount}%
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="relative w-16 h-16 rounded-2xl overflow-hidden transition-all"
                    style={{ border: `2px solid ${activeImg === i ? '#C874D9' : '#E1BBC9'}` }}>
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-bold text-3xl" style={{ color: '#F7A072' }}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-300 line-through">{formatPrice(product.originalPrice)}</span>
                  {discount && <span className="text-sm font-black px-2 py-0.5 rounded-full text-white" style={{ background: '#F7A072' }}>-{discount}%</span>}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: product.inStock ? '#52C97E' : '#f87171' }} />
              <span className="text-sm font-semibold text-neutral-600">
                {product.inStock ? 'Skladom — pripravené na odoslanie' : 'Momentálne nedostupné'}
              </span>
            </div>

            <div ref={btnRef} className="flex gap-3 mb-4">
              <div className="flex items-center rounded-xl" style={{ border: '2px solid #E1BBC9' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-primary transition-colors"><Minus size={14} /></button>
                <span className="w-10 text-center font-bold text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-primary transition-colors"><Plus size={14} /></button>
              </div>
              <motion.button onClick={handleCart} disabled={!product.inStock} whileTap={{ scale: 0.97 }}
                className="flex-1 h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#C874D9,#a855c7)' }}>
                <ShoppingCart size={16} /> Pridať do košíka
              </motion.button>
              <motion.button onClick={() => { toggle(product.id); showToast(isWished ? 'Odstránené' : '♡ Pridané') }} whileTap={{ scale: 1.2 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ border: '2px solid #E1BBC9', background: isWished ? '#F5E6F8' : 'transparent' }}>
                <Heart size={18} className={isWished ? 'fill-primary text-primary' : 'text-neutral-400'} />
              </motion.button>
            </div>

            <a href={product.shopUrl} className="flex items-center justify-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-6">
              <ExternalLink size={12} /> Kúpiť priamo na sendeti.sk →
            </a>

            <div className="rounded-2xl p-4 space-y-3" style={{ background: '#E2FCEF' }}>
              {deliveryItems.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold text-neutral-600">
                  <Icon size={14} className="text-green-600 flex-shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Popis produktu</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 z-40"
            style={{ borderTop: '1px solid #E1BBC9', boxShadow: '0 -8px 32px rgba(0,0,0,0.08)' }}>
            <div className="max-w-content mx-auto flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 line-clamp-1">{product.name}</p>
                <span className="font-bold" style={{ color: '#F7A072' }}>{formatPrice(product.price)}</span>
              </div>
              <motion.button onClick={handleCart} disabled={!product.inStock} whileTap={{ scale: 0.97 }}
                className="h-11 px-6 rounded-xl font-bold text-white text-sm flex items-center gap-2 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#C874D9,#a855c7)' }}>
                <ShoppingCart size={15} /> Pridať do košíka
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
