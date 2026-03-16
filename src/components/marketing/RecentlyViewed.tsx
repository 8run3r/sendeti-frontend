"use client";
import { useUIStore } from "@/store/uiStore";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";

export function RecentlyViewed() {
  const recentlyViewed = useUIStore((s) => s.recentlyViewed);
  const recentProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-neutral-100">
      <div className="max-w-content mx-auto px-4">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-neutral-900 mb-6"
        >
          Naposledy prezerané
        </motion.h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-56">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
