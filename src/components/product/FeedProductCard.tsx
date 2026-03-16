'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import type { Product } from '@/lib/feed'
import { formatPrice } from '@/lib/feed'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { showToast } from '@/components/ui/Toast'

interface Props { product: Product }

export function FeedProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const addItem = useCartStore(s => s.addItem)
  const openDrawer = useCartStore(s => s.openDrawer)
  const toggle = useWishlistStore(s => s.toggle)
  const isWished = useWishlistStore(s => s.hasItem(product.id))

  const hasSecond = product.images.length > 1

  const handleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!product.inStock) return
    const btn = btnRef.current
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setTimeout(() => setRipple(null), 600)
    }
    addItem(product)
    showToast(`✓ ${product.name.slice(0, 30)} pridaný do košíka`)
    openDrawer()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggle(product.id)
    showToast(isWished ? 'Odstránené z obľúbených' : '♡ Pridané do obľúbených')
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined

  return (
    <motion.article
      className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer"
      style={{ border: '1px solid rgba(225,187,201,0.5)' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px rgba(200,116,217,0.18)',
        borderColor: '#C874D9',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Image */}
      <Link href={`/produkt/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-pink-light">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-400 ${hovered && hasSecond ? 'opacity-0' : 'opacity-100'}`}
            />
            {hasSecond && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className={`object-cover absolute inset-0 transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </motion.div>

          {/* Badge */}
          {product.badge && (
            <div
              className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-wide"
              style={{
                background: product.badge === 'sale'
                  ? 'linear-gradient(135deg,#F7A072,#e8875a)'
                  : 'linear-gradient(135deg,#C874D9,#a855c7)',
              }}
            >
              {product.badge === 'sale' ? 'AKCIA' : product.badge === 'new' ? 'NOVÉ' : 'TOP'}
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 1.4 }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <Heart
              size={15}
              className={isWished ? 'fill-primary text-primary' : 'text-neutral-400'}
            />
          </motion.button>

          {/* Quick view pill */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
              >
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                  style={{ background: 'rgba(26,26,26,0.75)', backdropFilter: 'blur(8px)' }}
                >
                  Rýchly náhľad →
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-bold text-neutral-400 tracking-wide uppercase text-xs">Nedostupné</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
          {product.category}
        </p>
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="font-body text-sm font-bold text-neutral-900 line-clamp-2 mb-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono-price text-base" style={{ color: '#F7A072' }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-neutral-300 line-through font-mono-price">
                {formatPrice(product.originalPrice)}
              </span>
              {discount && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: '#F7A072' }}>
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Cart button with ripple */}
        <motion.button
          ref={btnRef}
          onClick={handleCart}
          disabled={!product.inStock}
          whileTap={{ scale: 0.97 }}
          className="relative w-full h-9 rounded-xl text-xs font-bold overflow-hidden transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            border: '2px solid #F7A072',
            color: hovered ? 'white' : '#F7A072',
            background: hovered ? 'linear-gradient(135deg,#F7A072,#e8875a)' : 'transparent',
          }}
        >
          {ripple && (
            <motion.span
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute rounded-full bg-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: ripple.x, top: ripple.y }}
            />
          )}
          <ShoppingCart size={13} />
          Pridať do košíka
        </motion.button>
      </div>
    </motion.article>
  )
}
