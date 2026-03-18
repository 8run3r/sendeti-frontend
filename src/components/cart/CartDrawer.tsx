'use client'

import { useCartStore } from '@/store/cartStore'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const FREE_SHIPPING = 35

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCartStore()

  const total = totalPrice()
  const remaining = Math.max(0, FREE_SHIPPING - total)
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(4px)' }}
           onClick={closeCart} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col"
           style={{ boxShadow: '-8px 0 48px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #EBE3F0' }}>
          <div>
            <h2 className="text-lg font-bold font-display" style={{ color: '#1C1917' }}>Košík</h2>
            <p className="text-xs font-sans" style={{ color: '#78716C' }}>{totalItems()} položiek</p>
          </div>
          <button onClick={closeCart}
                  className="p-2 rounded-xl transition-colors hover:bg-blush"
                  style={{ background: '#FEF9F4' }}>
            <X size={18} style={{ color: '#78716C' }} />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #EBE3F0', background: '#FEF9F4' }}>
          {remaining > 0 ? (
            <p className="text-xs mb-2 font-sans" style={{ color: '#78716C' }}>
              Ešte{' '}
              <span className="font-bold" style={{ color: '#F7A072' }}>
                {remaining.toFixed(2).replace('.', ',')} €
              </span>{' '}
              do dopravy zadarmo
            </p>
          ) : (
            <p className="text-xs font-bold mb-2 font-sans" style={{ color: '#16A34A' }}>🎉 Doprava zadarmo!</p>
          )}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EBE3F0' }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#C874D9,#F7A072)' }} />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <ShoppingBag size={56} strokeWidth={1} style={{ color: '#EBE3F0' }} />
              <div>
                <p className="font-bold text-lg mb-1 font-display" style={{ color: '#1C1917' }}>Košík je prázdny</p>
                <p className="text-sm font-sans" style={{ color: '#78716C' }}>Pridajte produkty a vráťte sa sem</p>
              </div>
              <button onClick={closeCart}
                      className="px-6 py-3 rounded-xl font-bold text-white text-sm font-sans"
                      style={{ background: '#F7A072' }}>
                Pokračovať v nakupovaní
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(item => (
                <div key={item.product.id}
                     className="flex gap-3 p-3 rounded-2xl"
                     style={{ background: '#FEF9F4', border: '1px solid #EBE3F0' }}>
                  <Link href={`/produkt/${item.product.slug}`} onClick={closeCart}
                        className="relative w-[68px] h-[68px] flex-shrink-0 rounded-xl overflow-hidden bg-white">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="68px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produkt/${item.product.slug}`} onClick={closeCart}>
                      <p className="text-xs font-semibold line-clamp-2 leading-snug mb-1 hover:text-coral transition-colors font-sans"
                         style={{ color: '#1C1917' }}>
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-sm font-bold font-sans mb-2" style={{ color: '#F7A072' }}>
                      {(item.product.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg" style={{ border: '1px solid #EBE3F0', background: 'white' }}>
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:text-coral transition-colors">
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold font-sans">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:text-coral transition-colors">
                          <Plus size={11} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)}
                              className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-red-50">
                        <Trash2 size={13} style={{ color: '#78716C' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer checkout */}
        {items.length > 0 && (
          <div className="p-5 space-y-3 bg-white" style={{ borderTop: '1px solid #EBE3F0' }}>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm font-sans" style={{ color: '#78716C' }}>Spolu:</span>
              <span className="text-xl font-bold font-sans" style={{ color: '#1C1917' }}>
                {total.toFixed(2).replace('.', ',')} €
              </span>
            </div>
            <button
              onClick={() => {
                const url = items.length === 1 ? items[0].product.shopUrl : 'https://shop.sendeti.sk'
                window.location.href = url
              }}
              className="w-full py-4 font-bold text-white rounded-xl text-sm transition-all hover:opacity-90 font-sans"
              style={{ background: 'linear-gradient(135deg,#C874D9,#F7A072)', boxShadow: '0 8px 24px rgba(247,160,114,0.35)' }}>
              Prejsť k objednávke →
            </button>
            <p className="text-[11px] text-center font-sans" style={{ color: '#78716C' }}>
              🔒 Bezpečná platba · presmerujeme vás na sendeti.sk
            </p>
            <button onClick={closeCart}
                    className="w-full text-center text-sm font-semibold hover:underline font-sans"
                    style={{ color: '#C874D9' }}>
              ← Pokračovať v nakupovaní
            </button>
          </div>
        )}
      </div>
    </>
  )
}
