'use client'

import { useCartStore } from '@/store/cartStore'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const FREE_SHIPPING = 35

export default function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQty,
    totalItems, totalPrice,
  } = useCartStore()

  const total = totalPrice()
  const remaining = Math.max(0, FREE_SHIPPING - total)
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
          <h2 className="text-lg font-bold text-gray-900">
            Košík
            {totalItems() > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({totalItems()})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        <div className="px-5 py-3 bg-pink-50 border-b border-pink-100">
          {remaining > 0 ? (
            <p className="text-xs text-gray-500 mb-2">
              Ešte{' '}
              <span className="font-bold" style={{ color: '#F7A072' }}>
                {remaining.toFixed(2).replace('.', ',')} €
              </span>
              {' '}do dopravy zadarmo
            </p>
          ) : (
            <p className="text-xs font-bold text-green-600 mb-2">🎉 Doprava zadarmo!</p>
          )}
          <div className="h-1.5 bg-pink-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #C874D9, #F7A072)',
              }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 p-8">
              <ShoppingBag size={56} strokeWidth={1} />
              <p className="text-lg font-semibold text-gray-600">Košík je prázdny</p>
              <button
                onClick={closeCart}
                className="px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: '#F7A072' }}
              >
                Pokračovať v nakupovaní
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produkt/${item.product.slug}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1 hover:text-orange-500 transition-colors block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-base font-bold" style={{ color: '#F7A072' }}>
                      {(item.product.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-pink-100 p-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Spolu:</span>
              <span className="text-xl font-bold text-gray-900">
                {total.toFixed(2).replace('.', ',')} €
              </span>
            </div>
            <button
              onClick={() => {
                const url = items.length === 1 ? items[0].product.shopUrl : 'https://shop.sendeti.sk'
                window.location.href = url
              }}
              className="w-full py-4 font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #C874D9, #F7A072)' }}
            >
              Prejsť k objednávke →
            </button>
            <p className="text-xs text-center text-gray-400">
              🔒 Bezpečná platba · Presmerujeme vás na sendeti.sk
            </p>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm font-semibold hover:underline"
              style={{ color: '#C874D9' }}
            >
              ← Pokračovať v nakupovaní
            </button>
          </div>
        )}
      </div>
    </>
  )
}
