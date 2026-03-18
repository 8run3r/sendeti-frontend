"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingCart, Flame } from "lucide-react";
import { ProductBadge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { RippleButton } from "@/components/ui/RippleButton";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/formatPrice";
import { showToast } from "@/components/ui/Toast";
import type { Product } from "@/types";
import type { Product as FeedProduct } from "@/lib/feed";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const hasSecondImage = product.images.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Adapt legacy Product type to feed Product shape
    const feedProduct: FeedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] ?? '',
      images: product.images,
      url: `https://shop.sendeti.sk`,
      shopUrl: `https://shop.sendeti.sk`,
      category: product.category,
      categorySlug: product.category,
      description: product.description,
      inStock: product.inStock,
      badge: (product.badge === 'bestseller' ? 'popular' : product.badge) as FeedProduct['badge'],
    }
    addItem(feedProduct);
    showToast(`${product.name.slice(0, 30)}... pridaný do košíka`);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    showToast(isWishlisted ? "Odstránené z obľúbených" : "Pridané do obľúbených");
  };

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* Image area */}
        <Link href={`/produkt/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-neutral-50">
            {/* Primary image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${hovered && hasSecondImage ? "opacity-0" : "opacity-100"}`}
            />
            {/* Secondary image crossfade */}
            {hasSecondImage && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className={`object-cover transition-opacity duration-500 absolute inset-0 ${hovered ? "opacity-100" : "opacity-0"}`}
              />
            )}

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <ProductBadge type={product.badge} />
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <Heart
                size={16}
                className={isWishlisted ? "fill-accent text-accent" : "text-neutral-400"}
              />
            </button>

            {/* Quick view */}
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white transition-colors whitespace-nowrap"
                >
                  <Eye size={14} />
                  Rýchle zobrazenie
                </motion.button>
              )}
            </AnimatePresence>

            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-sm font-semibold text-neutral-500">Nedostupné</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-neutral-400 mb-1 capitalize">{product.category.replace(/-/g, " ")}</p>
          <Link href={`/produkt/${product.slug}`}>
            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-2 hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <StarRating rating={product.rating} count={product.reviewCount} />

          {/* Price */}
          <div className="flex items-center gap-2 mt-2 mb-3">
            <span className="font-bold font-mono-price text-neutral-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-neutral-400 line-through font-mono-price">{formatPrice(product.originalPrice)}</span>
                <span className="text-xs font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">-{product.discount}%</span>
              </>
            )}
          </div>

          {/* Social proof */}
          {product.viewCount > 50 && (
            <div className="flex items-center gap-1 mb-3">
              <Flame size={12} className="text-accent-warm" />
              <span className="text-xs text-neutral-500">{product.viewCount} ľudí si prezrelo</span>
            </div>
          )}

          {/* Add to cart */}
          <RippleButton
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-9 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} />
            Pridať do košíka
          </RippleButton>
        </div>
      </motion.div>

      {/* Quick view modal */}
      <AnimatedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="lg">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-neutral-50">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <ProductBadge type={product.badge} />
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <p className="text-xs text-neutral-400 mb-2 capitalize">{product.category.replace(/-/g, " ")}</p>
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">{product.name}</h2>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <div className="flex items-center gap-3 my-4">
              <span className="font-bold font-mono-price text-2xl text-neutral-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through font-mono-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed flex-1">{product.shortDescription}</p>
            <div className="space-y-3">
              <RippleButton
                onClick={(e) => { handleAddToCart(e); setModalOpen(false); }}
                className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Pridať do košíka
              </RippleButton>
              <Link href={`/produkt/${product.slug}`} onClick={() => setModalOpen(false)}>
                <button className="w-full h-10 border border-neutral-200 text-sm text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors">
                  Zobraziť detail →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}
