"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { categories } from "@/data/categories";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setTopBarVisible(y < lastScrollY || y < 50);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [lastScrollY]);

  return (
    <>
      {/* Top bar */}
      <AnimatePresence>
        {topBarVisible && (
          <motion.div
            initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
            className="bg-primary text-white text-xs py-2 px-4"
          >
            <div className="max-w-content mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span>📞 0905 123 456</span>
                <span className="hidden sm:inline">📧 info@sendeti.sk</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">🚚 Doprava od 2,90€</span>
                <span>↩️ Vrátenie do 14 dní</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main header */}
      <header className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-content mx-auto px-4 h-20 flex items-center gap-4 justify-between">
          {/* Mobile menu button */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div>
              <span className="font-display text-2xl font-bold text-primary leading-none block">SEN DETÍ</span>
              <span className="text-[11px] text-neutral-600 leading-none">pre radosť detí</span>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                type="text"
                placeholder="Hľadajte produkty..."
                className="w-full h-11 pl-11 pr-4 bg-neutral-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <Link href="/vyhladavanie" className="p-2 sm:hidden">
              <Search size={22} />
            </Link>
            <Link href="#" className="p-2 relative">
              <Heart size={22} className="text-neutral-900" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ minWidth: 18, minHeight: 18, padding: "2px" }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button onClick={openCart} className="p-2 relative">
              <ShoppingCart size={22} className="text-neutral-900" />
              <AnimatePresence mode="wait">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ minWidth: 18, minHeight: 18, padding: "2px" }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Nav tier */}
        <nav className="hidden lg:block border-t border-neutral-100">
          <div className="max-w-content mx-auto px-4 h-12 flex items-center gap-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setMegaMenu(cat.id)}
                onMouseLeave={() => setMegaMenu(null)}
              >
                <Link
                  href={`/kategoria/${cat.id}`}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-primary-light"
                >
                  {cat.name}
                  <ChevronDown size={14} className="opacity-50" />
                </Link>
                <AnimatePresence>
                  {megaMenu === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 p-4 z-50"
                    >
                      <div className="grid grid-cols-1 gap-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/kategoria/${cat.id}/${sub.id}`}
                            className="px-3 py-2 text-sm text-neutral-700 hover:text-primary hover:bg-primary-light rounded-xl transition-colors flex justify-between"
                          >
                            {sub.name}
                            <span className="text-xs text-neutral-400">{sub.productCount}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-display text-xl font-bold text-primary">SEN DETÍ</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategoria/${cat.id}`}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-neutral-900">{cat.name}</span>
                    <span className="ml-auto text-xs text-neutral-400">{cat.productCount}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
