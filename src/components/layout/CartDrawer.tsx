"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatPrice";
import { RippleButton } from "@/components/ui/RippleButton";

const FREE_SHIPPING_THRESHOLD = 35;

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQty, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeDrawer}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm md:max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-lg">Košík ({totalItems()})</h2>
              <button onClick={closeDrawer} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping bar */}
            <div className="px-5 py-3 bg-neutral-50 border-b">
              {toFreeShipping > 0 ? (
                <p className="text-xs text-neutral-600 mb-2">Chýba <strong className="text-accent-warm">{formatPrice(toFreeShipping)}</strong> do dopravy zadarmo</p>
              ) : (
                <p className="text-xs text-accent-green font-semibold mb-2">🎉 Máte dopravu zadarmo!</p>
              )}
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag size={48} className="text-neutral-200 mb-4" />
                  <p className="font-semibold text-neutral-900 mb-1">Košík je prázdny</p>
                  <p className="text-sm text-neutral-500 mb-6">Pridajte produkty do košíka</p>
                  <button onClick={closeDrawer} className="text-primary text-sm font-semibold hover:underline">
                    Pokračovať v nakupovaní
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    layout
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3"
                  >
                    <div className="relative flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100" style={{ width: 72, height: 72 }}>
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-tight">{item.product.name}</p>
                      {item.selectedSize && <p className="text-xs text-neutral-500 mt-0.5">{item.selectedSize}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg px-2 py-1">
                          <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="text-neutral-600 hover:text-neutral-900">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="text-neutral-600 hover:text-neutral-900">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono-price text-neutral-900">{formatPrice(item.product.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.product.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t bg-white">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Spolu:</span>
                  <span className="font-bold text-lg font-mono-price">{formatPrice(total)}</span>
                </div>
                <Link href="/kosik" onClick={closeDrawer}>
                  <RippleButton className="w-full h-12 bg-primary text-white font-bold rounded-xl text-sm mb-2">
                    Zobraziť košík →
                  </RippleButton>
                </Link>
                <a
                  href="https://www.sendeti.sk"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeDrawer}
                  className="flex w-full h-10 border-2 border-pink rounded-xl text-sm font-semibold text-neutral-600 items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  Nakúpiť na sendeti.sk ↗
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
