'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/feed'

const FREE_SHIPPING = 35

export function CartDrawer() {
  const { items, isOpen: isDrawerOpen, closeCart: closeDrawer, removeItem, updateQty, totalPrice, totalItems } =
    useCartStore()
  const total = totalPrice()
  const toFree = Math.max(0, FREE_SHIPPING - total)
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100)

  const checkoutUrl =
    items.length === 1
      ? items[0].product.shopUrl
      : 'https://shop.sendeti.sk'

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid #E1BBC9' }}
            >
              <h2 className="font-display text-xl font-bold text-neutral-900">
                Košík{' '}
                <span className="font-body text-sm font-normal text-neutral-400">
                  ({totalItems()} položiek)
                </span>
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-pink-light rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping bar */}
            <div className="px-5 py-3 bg-pink-light" style={{ borderBottom: '1px solid #E1BBC9' }}>
              {toFree > 0 ? (
                <p className="text-xs font-semibold text-neutral-600 mb-2">
                  Chýba{' '}
                  <span className="font-black" style={{ color: '#F7A072' }}>
                    {formatPrice(toFree)}
                  </span>{' '}
                  do dopravy zadarmo
                </p>
              ) : (
                <p className="text-xs font-black text-mint-dark mb-2">🎉 Doprava zadarmo!</p>
              )}
              <div className="h-1.5 bg-pink rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#C874D9,#F7A072)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag size={56} className="text-pink mb-4" />
                  <p className="font-display text-xl font-bold text-neutral-900 mb-1">Košík je prázdny</p>
                  <p className="text-sm text-neutral-400 mb-6">Pridajte produkty do košíka</p>
                  <button
                    onClick={closeDrawer}
                    className="text-primary text-sm font-bold hover:underline"
                  >
                    Pokračovať v nakupovaní →
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.product.id}
                      layout
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3"
                    >
                      <div className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-pink-light" style={{ width: 72, height: 72 }}>
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-900 line-clamp-2 leading-tight mb-1">
                          {item.product.name}
                        </p>
                        <p className="font-mono-price text-sm" style={{ color: '#F7A072' }}>
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div
                            className="flex items-center gap-1 rounded-lg px-1 py-0.5"
                            style={{ background: '#FBF0F4' }}
                          >
                            <button
                              onClick={() => updateQty(item.product.id, item.quantity - 1)}
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product.id, item.quantity + 1)}
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-neutral-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 bg-white" style={{ borderTop: '1px solid #E1BBC9' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body font-semibold text-neutral-700">Spolu:</span>
                  <span className="font-mono-price text-xl text-neutral-900">{formatPrice(total)}</span>
                </div>

                <a
                  href={checkoutUrl}
                  
                 
                  className="block w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#C874D9,#F7A072)' }}
                >
                  Prejsť k objednávke →
                </a>

                <p className="text-[10px] text-neutral-400 text-center mt-2 leading-relaxed">
                  🔒 Budete presmerovaní na zabezpečenú stránku sendeti.sk
                </p>

                <Link
                  href="/"
                  onClick={closeDrawer}
                  className="block text-center text-xs text-primary font-semibold hover:underline mt-2"
                >
                  ← Pokračovať v nakupovaní
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
