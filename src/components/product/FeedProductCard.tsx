'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import type { Product } from '@/lib/feed'
import { formatPrice } from '@/lib/feed'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { showToast } from '@/components/ui/Toast'

export function FeedProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const toggle = useWishlistStore(s => s.toggle)
  const isWished = useWishlistStore(s => s.hasItem(product.id))

  const hasSecond = product.images.length > 1
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return
    addItem({ id: product.id, name: product.name, price: product.price,
              image: product.image, slug: product.slug, shopUrl: product.shopUrl, inStock: product.inStock })
    setAdded(true)
    showToast(`✓ Pridané do košíka`)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggle(product.id)
    showToast(isWished ? 'Odstránené z obľúbených' : '♡ Pridané do obľúbených')
  }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-200"
      style={{ border: '1px solid #EBE3F0' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/produkt/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className={`object-cover transition-all duration-400 ${hovered && hasSecond ? 'opacity-0' : 'opacity-100'}`}
          />
          {hasSecond && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className={`object-cover absolute inset-0 transition-all duration-400 ${hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
            />
          )}

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full z-10 font-sans"
                  style={{ background: product.badge === 'sale' ? '#F7A072' : '#C874D9' }}>
              {product.badge === 'sale' ? 'AKCIA' : product.badge === 'new' ? 'NOVÉ' : 'TOP'}
            </span>
          )}
          {discount && (
            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full z-10 font-sans"
                  style={{ background: '#F7A072' }}>
              -{discount}%
            </span>
          )}

          {/* Wishlist */}
          <button onClick={handleWishlist}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all"
                  style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                           border: isWished ? '1px solid #C874D9' : '1px solid transparent' }}>
            <Heart size={15} style={{ color: isWished ? '#C874D9' : '#78716C', fill: isWished ? '#C874D9' : 'none' }} />
          </button>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-bold font-sans" style={{ color: '#78716C' }}>Nedostupné</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 font-sans" style={{ color: '#78716C' }}>
          {product.category}
        </p>
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="text-sm font-semibold line-clamp-2 mb-3 leading-snug transition-colors font-sans"
              style={{ color: '#1C1917', minHeight: '2.5rem' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F7A072' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1C1917' }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold font-sans" style={{ color: '#F7A072' }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through font-sans" style={{ color: '#78716C' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          onClick={handleCart}
          disabled={!product.inStock}
          className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 font-sans disabled:opacity-40 disabled:cursor-not-allowed"
          style={added
            ? { background: '#16A34A', color: 'white', border: '2px solid #16A34A' }
            : { border: '2px solid #F7A072', color: hovered ? 'white' : '#F7A072',
                background: hovered ? '#F7A072' : 'transparent' }
          }
        >
          {added ? <Check size={13} /> : <ShoppingCart size={13} />}
          {added ? 'Pridané!' : 'Pridať do košíka'}
        </button>
      </div>
    </div>
  )
}
