"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { categories } from "@/data/categories";
import { ArrowRight } from "lucide-react";

const CATEGORY_STYLES: Record<string, { bg: string; emoji: string }> = {
  "bytovy-textil":   { bg: "#EBF4FF", emoji: "🛏️" },
  "oblecenie":       { bg: "#FCE4EC", emoji: "👕" },
  "hracky":          { bg: "#E0F7FA", emoji: "🧸" },
  "skolske-potreby": { bg: "#FFF3E0", emoji: "🎒" },
  "kojenecke":       { bg: "#F3E5F5", emoji: "👶" },
  "kuchyna":         { bg: "#FFF8E1", emoji: "🍽️" },
  "party":           { bg: "#E8F5E9", emoji: "🎉" },
  "doplnky":         { bg: "#FFF0EB", emoji: "✨" },
};

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
          {categories.map((cat, i) => {
            const style = CATEGORY_STYLES[cat.id] ?? { bg: cat.color, emoji: "⭐" };
            return (
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
                    style={{ backgroundColor: style.bg, minHeight: i === 0 ? 360 : 180 }}
                  >
                    {/* Emoji background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-15 group-hover:opacity-25 transition-opacity">
                      <span style={{ fontSize: i === 0 ? "9rem" : "5rem" }}>{style.emoji}</span>
                    </div>

                    <div className="relative p-5 h-full flex flex-col justify-between" style={{ minHeight: "inherit" }}>
                      <div>
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-2xl mb-3 text-lg"
                          style={{ backgroundColor: cat.accentColor + "22" }}
                        >
                          <span>{style.emoji}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-neutral-900 mb-1">{cat.name}</h3>
                        <p className="text-sm text-neutral-600">{cat.subcategories.length} podkategórií</p>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
