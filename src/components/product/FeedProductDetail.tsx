"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Shield,
  Check,
  Minus,
  Plus,
  ExternalLink,
} from "lucide-react";
import type { FeedProduct } from "@/lib/feed";
import { formatFeedPrice, feedToProduct } from "@/lib/feed";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "@/components/ui/Toast";
import { RippleButton } from "@/components/ui/RippleButton";

interface Props {
  product: FeedProduct;
}

const deliveryInfo = [
  { icon: Truck, text: "Doprava od 2,90 € | Zadarmo nad 35 €" },
  { icon: RotateCcw, text: "Vrátenie tovaru do 14 dní" },
  { icon: Shield, text: "Certifikované a bezpečné produkty" },
  { icon: Check, text: "Doručenie do 2–3 pracovných dní" },
];

export function FeedProductDetail({ product }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [stickyVisible, setStickyVisible] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : undefined;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (addButtonRef.current) observer.observe(addButtonRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(feedToProduct(product), qty);
    showToast(`${product.name.slice(0, 28)}… pridaný do košíka`);
    openDrawer();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-pink py-3 px-4">
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Domov</Link>
            <span>/</span>
            <Link
              href={`/kategoria/${product.categorySlug}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Image gallery ── */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-pink-light mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImage] ?? product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {discount && (
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-primary" : "border-pink"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-sm text-neutral-400 mb-2 capitalize">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-sm text-neutral-400 mb-4">
                Značka: <span className="font-semibold text-neutral-600">{product.brand}</span>
              </p>
            )}

            {/* Price — orange for contrast against pink UI */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono-price text-3xl text-accent-dark">
                {formatFeedPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-300 line-through font-mono-price">
                    {formatFeedPrice(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm font-bold text-white bg-accent px-2.5 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  product.inStock ? "bg-mint-dark" : "bg-red-400"
                }`}
              />
              <span className="text-sm font-medium text-neutral-600">
                {product.inStock ? "Skladom — pripravené na odoslanie" : "Momentálne nedostupné"}
              </span>
            </div>

            {/* Quantity selector + Add to cart */}
            <div ref={addButtonRef} className="flex gap-3 mb-5">
              {/* Qty */}
              <div className="flex items-center bg-neutral-100 rounded-xl border border-pink">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 hover:bg-pink-light rounded-l-xl transition-colors"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-3 hover:bg-pink-light rounded-r-xl transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to cart */}
              <RippleButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={17} />
                Pridať do košíka
              </RippleButton>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(isWishlisted ? "Odstránené z obľúbených" : "Pridané do obľúbených");
                }}
                className="w-12 h-12 border-2 border-pink rounded-xl flex items-center justify-center hover:border-primary transition-colors"
              >
                <Heart
                  size={19}
                  className={isWishlisted ? "fill-primary text-primary" : "text-neutral-400"}
                />
              </button>
            </div>

            {/* Also buy directly on sendeti.sk */}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-10 border-2 border-pink text-sm font-semibold text-neutral-600 rounded-xl hover:border-primary hover:text-primary transition-colors mb-6"
            >
              <ExternalLink size={14} />
              Kúpiť priamo na sendeti.sk
            </a>

            {/* Delivery info */}
            <div className="bg-mint rounded-2xl p-4 space-y-3">
              {deliveryInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-600">
                  <item.icon size={15} className="text-mint-dark flex-shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-16 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4">
              Popis produktu
            </h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky add-to-cart bar */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink shadow-lg px-4 py-3 z-40"
          >
            <div className="max-w-content mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-1">{product.name}</p>
                <span className="font-mono-price text-accent-dark">{formatFeedPrice(product.price)}</span>
              </div>
              <RippleButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="h-11 px-6 bg-primary text-white font-bold rounded-xl flex items-center gap-2 whitespace-nowrap hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                <ShoppingCart size={16} />
                Pridať do košíka
              </RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
