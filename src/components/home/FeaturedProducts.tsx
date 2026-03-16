"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FeedProductCard } from "@/components/product/FeedProductCard";
import type { FeedProduct } from "@/lib/feed";

const filters = [
  { id: "all", label: "Všetky" },
  { id: "new", label: "Novinky" },
  { id: "sale", label: "Výpredaj" },
  { id: "popular", label: "Obľúbené" },
];

interface Props {
  feedProducts?: FeedProduct[];
}

export function FeaturedProducts({ feedProducts }: Props) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // When feed products are provided, use them (no badge filtering)
  const useFeed = feedProducts && feedProducts.length > 0;

  const filtered = useFeed
    ? feedProducts
    : products.filter((p) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "new") return p.badge === "new";
        if (activeFilter === "sale") return p.badge === "sale";
        if (activeFilter === "popular") return p.badge === "popular" || p.badge === "bestseller";
        return true;
      });

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-content mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
              Odporúčané produkty
            </h2>
            <p className="text-lg text-neutral-600">Vybrané špeciálne pre vaše deti</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!useFeed && filters.map((f) => (
              <motion.button
                key={f.id}
                onClick={() => { setActiveFilter(f.id); setShowAll(false); }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === f.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {displayed.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {useFeed ? (
                  <FeedProductCard product={product as FeedProduct} />
                ) : (
                  <ProductCard product={product as import("@/types").Product} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {!showAll && filtered.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-all"
            >
              Načítať viac produktov ({filtered.length - 8} ďalších)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
