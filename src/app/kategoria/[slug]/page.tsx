"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product/ProductCard";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Najpopulárnejšie" },
  { value: "price-asc", label: "Cena: najnižšia" },
  { value: "price-desc", label: "Cena: najvyššia" },
  { value: "newest", label: "Najnovšie" },
  { value: "rating", label: "Hodnotenie" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find((c) => c.id === slug);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("popular");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [gridView, setGridView] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.category === slug);

    if (inStockOnly) result = result.filter((p) => p.inStock);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sort) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "rating": result = [...result].sort((a, b) => b.rating - a.rating); break;
      case "newest": result = [...result].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0)); break;
      default: result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    }

    return result;
  }, [slug, inStockOnly, priceRange, minRating, sort]);

  const displayed = showAll ? filtered : filtered.slice(0, 12);

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    if (filter === "Iba skladom") setInStockOnly(false);
    if (filter.startsWith("Min. cena")) setPriceRange([0, priceRange[1]]);
    if (filter.startsWith("Hodnotenie")) setMinRating(0);
  };

  const addFilter = (label: string) => {
    setActiveFilters((prev) => prev.includes(label) ? prev : [...prev, label]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Category banner */}
      <div
        className="relative py-16 px-4"
        style={{ background: category ? `linear-gradient(135deg, ${category.color} 0%, white 100%)` : "#EBF4FF" }}
      >
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-primary">Domov</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{category?.name ?? slug}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            {category?.name ?? slug}
          </h1>
          <p className="text-neutral-600">{filtered.length} produktov</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sticky top-24 space-y-6">
              <h3 className="font-semibold text-neutral-900">Filtre</h3>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Cena</h4>
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
                    onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); addFilter(`Max. cena ${e.target.value}€`); }}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Dostupnosť</h4>
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

              {/* Rating */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Min. hodnotenie</h4>
                <div className="space-y-1">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        const newRating = minRating === r ? 0 : r;
                        setMinRating(newRating);
                        if (newRating) addFilter(`Hodnotenie ${r}+`);
                        else removeFilter(`Hodnotenie ${r}+`);
                      }}
                      className={`flex items-center gap-2 w-full text-sm px-3 py-2 rounded-xl transition-colors ${minRating === r ? "bg-primary text-white" : "hover:bg-neutral-50 text-neutral-700"}`}
                    >
                      {"★".repeat(r)} a viac
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {category && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Podkategórie</h4>
                  <div className="space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/kategoria/${slug}/${sub.id}`}
                        className="flex justify-between items-center text-sm text-neutral-600 hover:text-primary px-3 py-2 rounded-xl hover:bg-primary-light transition-colors"
                      >
                        {sub.name}
                        <span className="text-xs text-neutral-400">{sub.productCount}</span>
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
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
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
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sort}-${inStockOnly}-${minRating}-${priceRange[1]}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={gridView
                  ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-4"
                }
              >
                {displayed.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="font-semibold text-neutral-900 mb-2">Žiadne produkty nenájdené</p>
                    <p className="text-sm text-neutral-500">Skúste upraviť filtre</p>
                  </div>
                ) : (
                  displayed.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

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
