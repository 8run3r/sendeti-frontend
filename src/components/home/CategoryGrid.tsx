"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import { ImagesBadge } from "@/components/ui/ImagesBadge";
import { ArrowRight } from "lucide-react";

export function CategoryGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-content mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Objavte naše kategórie
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Od útleho veku po školský vek — všetko pre šťastné detstvo na jednom mieste.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
            >
              <Link href={`/kategoria/${cat.id}`}>
                <div
                  className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: cat.color, minHeight: i === 0 ? 360 : 180 }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="relative p-5 h-full flex flex-col justify-between" style={{ minHeight: "inherit" }}>
                    <div>
                      <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-2xl mb-3 text-lg"
                        style={{ backgroundColor: cat.accentColor + "22" }}
                      >
                        <span style={{ color: cat.accentColor }}>
                          {getCategoryEmoji(cat.id)}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-neutral-900 mb-1">{cat.name}</h3>
                      <p className="text-sm text-neutral-600">{cat.productCount} produktov</p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <ImagesBadge
                        images={cat.subcategories.slice(0, 3).map((s) => ({
                          src: `https://picsum.photos/seed/${s.id}/50/50`,
                          alt: s.name,
                        }))}
                        size={24}
                        maxVisible={3}
                      />
                      <span className="text-xs text-neutral-600">{cat.subcategories.length} podkategórií</span>
                    </div>

                    <div
                      className="absolute bottom-5 right-5 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                      style={{ backgroundColor: cat.accentColor }}
                    >
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getCategoryEmoji(id: string): string {
  const map: Record<string, string> = {
    "bytovy-textil": "🛏",
    "oblecenie": "👕",
    "hracky": "🎮",
    "skolske-potreby": "📚",
    "kojenecke": "👶",
    "izba": "🏠",
    "party": "🎉",
  };
  return map[id] || "⭐";
}
