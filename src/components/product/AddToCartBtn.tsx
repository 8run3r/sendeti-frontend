'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { CartProduct } from '@/store/cartStore'

export default function AddToCartBtn({ product }: { product: CartProduct }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  if (!product.inStock) {
    return (
      <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center font-sans"
           style={{ background: '#F5F3F0', color: '#78716C' }}>
        Nedostupné
      </div>
    )
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 font-sans"
      style={added
        ? { background: '#16A34A', color: 'white' }
        : { border: '2px solid #F7A072', color: '#F7A072', background: 'transparent' }
      }
      onMouseEnter={e => { if (!added) { (e.currentTarget as HTMLElement).style.background = '#F7A072'; (e.currentTarget as HTMLElement).style.color = 'white' } }}
      onMouseLeave={e => { if (!added) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#F7A072' } }}
    >
      {added ? <Check size={13} /> : <ShoppingCart size={13} />}
      {added ? 'Pridané!' : 'Pridať do košíka'}
    </button>
  )
}
