import { fetchProducts } from '@/lib/feed'
import type { Product } from '@/lib/feed'
import { FeedProductCard } from '@/components/product/FeedProductCard'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { SocialProofBar } from '@/components/home/SocialProofBar'
import { PromoBanner } from '@/components/home/PromoBanner'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export default async function HomePage() {
  let products: Product[] = []
  try {
    products = await fetchProducts()
  } catch {
    products = []
  }

  const featured = products.slice(0, 8)
  const saleProducts = products.filter(p => p.badge === 'sale').slice(0, 4)
  const heroProducts = products.slice(0, 3)

  return (
    <>
      <HeroSection heroProducts={heroProducts} />
      <CategoryGrid />
      <SocialProofBar />

      {/* Featured products */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">Produkty</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                Bestsellery
              </h2>
            </div>
            <a
              href="/kategoria/vsetky"
              className="text-sm font-bold hover:underline flex-shrink-0"
              style={{ color: '#C874D9' }}
            >
              Zobraziť všetky →
            </a>
          </div>

          {featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-3xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map(p => (
                <FeedProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="py-16" style={{ background: '#FBF0F4' }}>
          <div className="max-w-content mx-auto px-4">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#F7A072' }}>Špeciálna ponuka</p>
              <h2 className="font-display text-4xl font-bold text-neutral-900">Aktuálne akcie</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {saleProducts.map(p => (
                <FeedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <PromoBanner />
      <TestimonialsMarquee />
      <NewsletterSection />
    </>
  )
}
