"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { FeedProduct } from "@/lib/feed";
import { formatFeedPrice } from "@/lib/feed";

interface Props {
  product: FeedProduct;
}

export function FeedProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const hasSecondImage = product.images.length > 1;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : undefined;

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Image area */}
      <a href={product.url} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-500 ${
              hovered && hasSecondImage ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 absolute inset-0 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {discount && (
            <div className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-semibold text-neutral-500">
                Nedostupné
              </span>
            </div>
          )}
        </div>
      </a>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-neutral-400 mb-1 truncate">
          {product.category}
        </p>
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-2 hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </a>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="font-bold font-mono-price text-neutral-900">
            {formatFeedPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through font-mono-price">
                {formatFeedPrice(product.originalPrice)}
              </span>
              {discount && (
                <span className="text-xs font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Buy button → external sendeti.sk */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-9 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <ExternalLink size={13} />
          Kúpiť na sendeti.sk
        </a>
      </div>
    </motion.div>
  );
}
