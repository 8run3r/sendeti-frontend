"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import type { FeedProduct } from "@/lib/feed";
import { formatFeedPrice, feedToProduct } from "@/lib/feed";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "@/components/ui/Toast";

interface Props {
  product: FeedProduct;
}

export function FeedProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const hasSecondImage = product.images.length > 1;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(feedToProduct(product), 1);
    showToast(`${product.name.slice(0, 28)}… pridaný do košíka`);
    openDrawer();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    showToast(isWishlisted ? "Odstránené z obľúbených" : "Pridané do obľúbených");
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-pink hover:border-primary/40 transition-all duration-300 hover:shadow-md"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <Link href={`/produkt/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-pink-light">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-500 ${
              hovered && hasSecondImage ? "opacity-0" : "opacity-100"
            }`}
          />
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={15}
              className={isWishlisted ? "fill-primary text-primary" : "text-neutral-400"}
            />
          </button>

          {/* Quick-look */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
              >
                <Link
                  href={`/produkt/${product.slug}`}
                  className="flex items-center gap-1.5 bg-white/90 backdrop-blur text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white transition-colors whitespace-nowrap"
                >
                  <Eye size={13} />
                  Zobraziť detail
                </Link>
              </motion.div>
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
        <p className="text-xs text-neutral-400 mb-1 truncate">{product.category}</p>
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="font-sans text-sm font-semibold text-neutral-900 line-clamp-2 mb-2 hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-price text-base text-primary">
            {formatFeedPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through font-mono-price">
              {formatFeedPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full h-9 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={13} />
          Pridať do košíka
        </button>
      </div>
    </motion.div>
  );
}
