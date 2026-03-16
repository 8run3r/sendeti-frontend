"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Truck, RotateCcw, Shield, Minus, Plus, Star, Check } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { StarRating } from "@/components/ui/StarRating";
import { ProductBadge } from "@/components/ui/Badge";
import { RippleButton } from "@/components/ui/RippleButton";
import { ImagesBadge } from "@/components/ui/ImagesBadge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/formatPrice";
import { showToast } from "@/components/ui/Toast";

const mockReviews = [
  { id: "r1", author: "Martina S.", rating: 5, text: "Výborná kvalita, presne ako na fotkách. Veľmi spokojná!", date: "12.3.2025", verified: true },
  { id: "r2", author: "Peter K.", rating: 4, text: "Pekný produkt, rýchle dodanie. Odporúčam.", date: "8.3.2025", verified: true },
  { id: "r3", author: "Jana H.", rating: 5, text: "Dieťatko je nadšené! Kvalita na úrovni prémiového e-shopu.", date: "1.3.2025", verified: false },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"popis" | "parametre" | "hodnotenia">("popis");
  const [stickyVisible, setStickyVisible] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product?.id ?? ""));
  const addRecentlyViewed = useUIStore((s) => s.addRecentlyViewed);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (addButtonRef.current) observer.observe(addButtonRef.current);
    return () => observer.disconnect();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Produkt nenájdený</h1>
          <Link href="/" className="text-primary hover:underline">Späť na domov</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty, selectedSize, selectedColor);
    showToast("Produkt pridaný do košíka");
    openDrawer();
  };

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 py-3 px-4">
        <div className="max-w-content mx-auto">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-primary">Domov</Link>
            <span>/</span>
            <Link href={`/kategoria/${product.category}`} className="hover:text-primary capitalize">
              {product.category.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-50 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
                </motion.div>
              </AnimatePresence>
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <ProductBadge type={product.badge} />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary" : "border-neutral-200"}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="mb-4">
              <p className="text-sm text-neutral-500 capitalize mb-2">{product.category.replace(/-/g, " ")}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3">{product.name}</h1>
              <StarRating rating={product.rating} count={product.reviewCount} />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-bold font-mono-price text-3xl text-neutral-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through font-mono-price">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">-{product.discount}%</span>
                </>
              )}
            </div>

            {/* Social proof */}
            <div className="mb-5">
              <ImagesBadge
                images={[
                  { src: "https://picsum.photos/seed/pv1/50/50", alt: "Kupujúci" },
                  { src: "https://picsum.photos/seed/pv2/50/50", alt: "Kupujúci" },
                  { src: "https://picsum.photos/seed/pv3/50/50", alt: "Kupujúci" },
                ]}
                badgeText={`${product.soldCount}`}
                label="ľudí si kúpilo tento produkt"
              />
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-accent-green" : "bg-red-400"}`} />
              <span className="text-sm font-medium">
                {product.inStock ? (
                  <>Skladom <span className="text-neutral-400">({product.stockCount} ks)</span></>
                ) : "Nedostupné"}
              </span>
            </div>

            {/* Sizes */}
            {product.variants?.sizes && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-700 mb-2">Veľkosť:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedSize === size ? "border-primary bg-primary text-white" : "border-neutral-200 hover:border-primary text-neutral-700"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.variants?.colors && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-700 mb-2">Farba:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.name ? "border-primary scale-110" : "border-neutral-200"}`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div ref={addButtonRef} className="flex gap-3 mb-5">
              <div className="flex items-center bg-neutral-100 rounded-xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-neutral-200 rounded-l-xl transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-neutral-200 rounded-r-xl transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <RippleButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                <ShoppingCart size={18} />
                Pridať do košíka
              </RippleButton>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(isWishlisted ? "Odstránené z obľúbených" : "Pridané do obľúbených");
                }}
                className="w-12 h-12 border-2 border-neutral-200 rounded-xl flex items-center justify-center hover:border-accent transition-colors"
              >
                <Heart size={20} className={isWishlisted ? "fill-accent text-accent" : "text-neutral-400"} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
              {[
                { icon: Truck, text: "Doprava od 2,90 € | Zadarmo nad 35 €" },
                { icon: RotateCcw, text: "Vrátenie tovaru do 14 dní" },
                { icon: Shield, text: "Certifikované a bezpečné produkty" },
                { icon: Check, text: "Doručenie do 2–3 pracovných dní" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-600">
                  <item.icon size={16} className="text-primary flex-shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-neutral-100 mb-8">
            {(["popis", "parametre", "hodnotenia"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}
              >
                {tab === "popis" ? "Popis" : tab === "parametre" ? "Parametre" : `Hodnotenia (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === "popis" && (
                <div className="max-w-2xl">
                  <p className="text-neutral-600 leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "parametre" && (
                <div className="max-w-2xl">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-neutral-100">
                        <td className="py-3 text-neutral-500 w-1/3">Kategória</td>
                        <td className="py-3 font-medium capitalize">{product.category.replace(/-/g, " ")}</td>
                      </tr>
                      <tr className="border-b border-neutral-100">
                        <td className="py-3 text-neutral-500">Podkategória</td>
                        <td className="py-3 font-medium">{product.subcategory}</td>
                      </tr>
                      {product.variants?.sizes && (
                        <tr className="border-b border-neutral-100">
                          <td className="py-3 text-neutral-500">Dostupné veľkosti</td>
                          <td className="py-3 font-medium">{product.variants.sizes.join(", ")}</td>
                        </tr>
                      )}
                      <tr className="border-b border-neutral-100">
                        <td className="py-3 text-neutral-500">Skladom</td>
                        <td className="py-3 font-medium">{product.stockCount} ks</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-neutral-500">Zobrazenia</td>
                        <td className="py-3 font-medium">{product.viewCount}×</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "hodnotenia" && (
                <div className="max-w-2xl space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-neutral-50 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold text-sm">{review.author}</span>
                          {review.verified && <span className="ml-2 text-xs text-accent-green">✓ Overený nákup</span>}
                        </div>
                        <span className="text-xs text-neutral-400">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-accent-warm text-accent-warm" />
                        ))}
                      </div>
                      <p className="text-sm text-neutral-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8">Súvisiace produkty</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add to cart */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 shadow-lg px-4 py-3 z-40"
          >
            <div className="max-w-content mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-1">{product.name}</p>
                <span className="font-bold font-mono-price text-primary">{formatPrice(product.price)}</span>
              </div>
              <RippleButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="h-11 px-6 bg-primary text-white font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap"
              >
                <ShoppingCart size={16} />
                Pridať do košíka
              </RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
