'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { CartProduct } from '@/store/cartStore'

export default function AddToCartBtn({ product }: { product: CartProduct }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        Nedostupné
      </button>
    )
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
        added
          ? 'text-white'
          : 'border-2 border-orange-400 text-orange-500 hover:bg-orange-400 hover:text-white'
      }`}
      style={added ? { background: '#52C97E' } : {}}
    >
      <ShoppingCart size={15} />
      {added ? '✓ Pridané!' : 'Pridať do košíka'}
    </button>
  )
}
