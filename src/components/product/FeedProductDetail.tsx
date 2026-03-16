"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Truck,
  RotateCcw,
  Shield,
  Check,
  Heart,
  ShoppingBag,
} from "lucide-react";
import type { FeedProduct } from "@/lib/feed";
import { formatFeedPrice } from "@/lib/feed";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "@/components/ui/Toast";

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
  const [stickyVisible, setStickyVisible] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
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

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 py-3 px-4">
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-primary">
              Domov
            </Link>
            <span>/</span>
            <Link
              href={`/kategoria/${product.categorySlug}`}
              className="hover:text-primary"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-50 mb-4">
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
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              {discount && (
                <div className="absolute top-4 left-4 z-10 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
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
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-primary"
                        : "border-neutral-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="mb-4">
              <p className="text-sm text-neutral-500 mb-2">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-sm text-neutral-500">
                  Značka: <span className="font-medium">{product.brand}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-bold font-mono-price text-3xl text-neutral-900">
                {formatFeedPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through font-mono-price">
                    {formatFeedPrice(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? "bg-accent-green" : "bg-red-400"
                }`}
              />
              <span className="text-sm font-medium">
                {product.inStock ? "Skladom" : "Nedostupné"}
              </span>
            </div>

            {/* Buy button (external) + wishlist */}
            <div ref={addButtonRef} className="flex gap-3 mb-5">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
              >
                <ShoppingBag size={18} />
                Kúpiť na sendeti.sk
                <ExternalLink size={14} className="opacity-70" />
              </a>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(
                    isWishlisted
                      ? "Odstránené z obľúbených"
                      : "Pridané do obľúbených"
                  );
                }}
                className="w-12 h-12 border-2 border-neutral-200 rounded-xl flex items-center justify-center hover:border-accent transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-accent text-accent"
                      : "text-neutral-400"
                  }
                />
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
              {deliveryInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-neutral-600"
                >
                  <item.icon size={16} className="text-primary flex-shrink-0" />
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
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>

      {/* Sticky buy bar */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 shadow-lg px-4 py-3 z-40"
          >
            <div className="max-w-content mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-1">
                  {product.name}
                </p>
                <span className="font-bold font-mono-price text-primary">
                  {formatFeedPrice(product.price)}
                </span>
              </div>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 bg-primary text-white font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap hover:bg-primary-dark transition-colors"
              >
                <ShoppingBag size={16} />
                Kúpiť na sendeti.sk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
