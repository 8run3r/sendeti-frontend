"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatPrice";
import { RippleButton } from "@/components/ui/RippleButton";

const FREE_SHIPPING_THRESHOLD = 35;

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, totalItems, clear } = useCartStore();
  const total = totalPrice();
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 2.90;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center py-16">
          <ShoppingBag size={64} className="text-neutral-200 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-3">Váš košík je prázdny</h1>
          <p className="text-neutral-500 mb-8">Pridajte produkty a vráťte sa sem</p>
          <Link href="/">
            <RippleButton className="h-12 px-8 bg-primary text-white font-semibold rounded-xl">
              Pokračovať v nakupovaní
            </RippleButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Košík ({totalItems()} položiek)
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <div className="bg-white rounded-2xl p-5">
              {toFreeShipping > 0 ? (
                <p className="text-sm text-neutral-600 mb-2">
                  Chýba <strong className="text-accent-warm">{formatPrice(toFreeShipping)}</strong> do dopravy zadarmo
                </p>
              ) : (
                <p className="text-sm text-accent-green font-semibold mb-2">🎉 Máte dopravu zadarmo!</p>
              )}
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}`}
                  layout
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl p-5 flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produkt/${item.product.slug}`}>
                      <h3 className="font-semibold text-neutral-900 hover:text-primary transition-colors line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.selectedSize && <p className="text-sm text-neutral-500 mb-1">Veľkosť: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-sm text-neutral-500 mb-2">Farba: {item.selectedColor}</p>}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center bg-neutral-100 rounded-xl">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="p-2.5 hover:bg-neutral-200 rounded-l-xl transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="p-2.5 hover:bg-neutral-200 rounded-r-xl transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold font-mono-price text-lg">{formatPrice(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clear} className="text-sm text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <Trash2 size={14} />
              Vymazať košík
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-5">Súhrn objednávky</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Medzisúčet</span>
                  <span className="font-mono-price">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Doprava</span>
                  <span className={shipping === 0 ? "text-accent-green font-semibold" : "font-mono-price"}>
                    {shipping === 0 ? "Zadarmo" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-base">
                  <span>Celkom</span>
                  <span className="font-mono-price">{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Zľavový kód"
                  className="w-full h-10 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <a
                href="https://www.sendeti.sk"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <RippleButton className="w-full h-12 bg-primary text-white font-bold rounded-xl mb-3">
                  Dokončiť nákup na sendeti.sk ↗
                </RippleButton>
              </a>
              <Link href="/" className="block text-center text-sm text-primary hover:underline">
                ← Pokračovať v nakupovaní
              </Link>
              <p className="text-xs text-neutral-400 text-center mt-3 leading-relaxed">
                Objednávky sa spracúvajú priamo cez sendeti.sk
              </p>

              <div className="mt-5 pt-5 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 text-center mb-2">Bezpečná platba</p>
                <div className="flex justify-center gap-2">
                  {["VISA", "MC", "PayPal", "GoPay"].map((p) => (
                    <span key={p} className="border border-neutral-200 px-2 py-0.5 rounded text-xs text-neutral-500">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
