"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

const popularSearches = ["obliečka", "plyšák", "LEGO", "batoh", "šaty", "deka", "hračky"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      .slice(0, 5);
  }, [query]);

  const results = useMemo(() => {
    if (!submitted) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(submitted.toLowerCase()) ||
      p.description.toLowerCase().includes(submitted.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(submitted.toLowerCase()))
    );
  }, [submitted]);

  const handleSearch = (q: string) => {
    setSubmitted(q);
    setQuery(q);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-3">Hľadajte produkty</h1>
          <p className="text-neutral-500">Nájdite presne to, čo hľadáte</p>
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(query); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Hľadajte produkty, kategórie..."
              className="w-full h-14 pl-14 pr-12 bg-white border-2 border-neutral-200 focus:border-primary rounded-2xl text-base outline-none transition-all shadow-sm"
              autoFocus
            />
            {query && (
              <button onClick={() => { setQuery(""); setSubmitted(""); }} className="absolute right-5 top-1/2 -translate-y-1/2">
                <X size={18} className="text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 bg-white border border-neutral-100 rounded-2xl shadow-xl mt-2 overflow-hidden z-10"
              >
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSearch(p.name)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.category.replace(/-/g, " ")}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Popular searches */}
        {!submitted && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Populárne hľadania</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {submitted && (
            <motion.div
              key={submitted}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-neutral-500 mb-6">
                {results.length > 0 ? (
                  <><strong>{results.length}</strong> výsledkov pre &ldquo;{submitted}&rdquo;</>
                ) : (
                  <>Žiadne výsledky pre &ldquo;{submitted}&rdquo;</>
                )}
              </p>

              {results.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <p className="text-5xl mb-4">🔍</p>
                  <h2 className="font-semibold text-neutral-900 mb-2">Nenašli sme nič</h2>
                  <p className="text-sm text-neutral-500 mb-6">Skúste iné kľúčové slovo alebo populárne hľadania vyššie</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
