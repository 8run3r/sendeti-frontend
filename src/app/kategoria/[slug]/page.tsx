"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { categories } from "@/data/categories";
import { FeedProductCard } from "@/components/product/FeedProductCard";
import type { FeedProduct } from "@/lib/feed";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Najpopulárnejšie" },
  { value: "price-asc", label: "Cena: najnižšia" },
  { value: "price-desc", label: "Cena: najvyššia" },
  { value: "newest", label: "Najnovšie" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find((c) => c.id === slug);

  const [allProducts, setAllProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [gridView, setGridView] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data: FeedProduct[]) => {
        const categoryProducts =
          slug === "vsetky"
            ? data
            : data.filter((p) => p.categorySlug === slug);
        setAllProducts(categoryProducts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const filtered = useMemo(() => {
    let result = allProducts;

    if (inStockOnly) result = result.filter((p) => p.inStock);
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, inStockOnly, priceRange, sort]);

  const displayed = showAll ? filtered : filtered.slice(0, 12);

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    if (filter === "Iba skladom") setInStockOnly(false);
    if (filter.startsWith("Max. cena")) setPriceRange([0, 250]);
  };

  const addFilter = (label: string) => {
    setActiveFilters((prev) => (prev.includes(label) ? prev : [...prev, label]));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Category banner */}
      <div
        className="relative py-16 px-4"
        style={{
          background: category
            ? `linear-gradient(135deg, ${category.color} 0%, white 100%)`
            : "#EBF4FF",
        }}
      >
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-primary">
              Domov
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">
              {category?.name ?? slug}
            </span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            {category?.name ?? slug}
          </h1>
          <p className="text-neutral-600">
            {loading ? "Načítavam..." : `${filtered.length} produktov`}
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sticky top-24 space-y-6">
              <h3 className="font-semibold text-neutral-900">Filtre</h3>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                  Cena
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>{priceRange[0]} €</span>
                    <span>{priceRange[1]} €</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      addFilter(`Max. cena ${e.target.value}€`);
                    }}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                  Dostupnosť
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      if (e.target.checked) addFilter("Iba skladom");
                      else removeFilter("Iba skladom");
                    }}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-neutral-700">Iba skladom</span>
                </label>
              </div>

              {/* Subcategories */}
              {category && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                    Podkategórie
                  </h4>
                  <div className="space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/kategoria/${slug}/${sub.id}`}
                        className="flex justify-between items-center text-sm text-neutral-600 hover:text-primary px-3 py-2 rounded-xl hover:bg-primary-light transition-colors"
                      >
                        {sub.name}
                        <span className="text-xs text-neutral-400">
                          {sub.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-sm"
              >
                <SlidersHorizontal size={16} />
                Filtre
              </button>

              {/* Active filters */}
              <div className="flex flex-wrap gap-2 flex-1">
                {activeFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => removeFilter(f)}
                    className="flex items-center gap-1 bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {f} <X size={12} />
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-10 pl-4 pr-8 bg-white border border-neutral-200 rounded-xl text-sm outline-none cursor-pointer appearance-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
                />
              </div>

              {/* Grid/List toggle */}
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setGridView(true)}
                  className={`p-2.5 transition-colors ${gridView ? "bg-primary text-white" : "text-neutral-400 hover:bg-neutral-50"}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`p-2.5 transition-colors ${!gridView ? "bg-primary text-white" : "text-neutral-400 hover:bg-neutral-50"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-neutral-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sort}-${inStockOnly}-${priceRange[1]}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={
                    gridView
                      ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {displayed.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <p className="text-4xl mb-4">🔍</p>
                      <p className="font-semibold text-neutral-900 mb-2">
                        Žiadne produkty nenájdené
                      </p>
                      <p className="text-sm text-neutral-500">
                        Skúste upraviť filtre
                      </p>
                    </div>
                  ) : (
                    displayed.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <FeedProductCard product={product} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {!showAll && filtered.length > 12 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-all"
                >
                  Načítať viac ({filtered.length - 12} ďalších)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
