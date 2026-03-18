'use client'

import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/lib/feed'

export default function AddToCartBtn({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const openDrawer = useCartStore(s => s.openDrawer)

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        Nedostupné
      </button>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product, 1)
        openDrawer()
      }}
      className="w-full py-2 rounded-xl text-sm font-semibold border-2 border-orange-400 text-orange-500 hover:bg-orange-400 hover:text-white transition-colors"
    >
      🛒 Pridať do košíka
    </button>
  )
}
