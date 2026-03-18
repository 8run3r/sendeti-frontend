import { fetchProducts, formatPrice } from '@/lib/feed'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartBtn from '@/components/product/AddToCartBtn'
import { AppleCarousel } from '@/components/ui/AppleCarousel'

const CATEGORIES = [
  { title: 'Bytový textil',   slug: 'bytovy-textil',  emoji: '🛏️', bg: 'linear-gradient(135deg,#EBF4FF,#DBEAFE)' },
  { title: 'Oblečenie',       slug: 'oblecenie',       emoji: '👗',  bg: 'linear-gradient(135deg,#FCE4EC,#F8BBD9)' },
  { title: 'Hračky',          slug: 'hracky',          emoji: '🧸',  bg: 'linear-gradient(135deg,#E0F7FA,#B2EBF2)' },
  { title: 'Školské potreby', slug: 'skolske-potreby', emoji: '🎒',  bg: 'linear-gradient(135deg,#FFF3E0,#FFE0B2)' },
  { title: 'Kojenecké',       slug: 'kojenecke',       emoji: '👶',  bg: 'linear-gradient(135deg,#F3E5F5,#E1BEE7)' },
  { title: 'Kuchyňa',         slug: 'kuchyna',         emoji: '🍽️', bg: 'linear-gradient(135deg,#FFF8E1,#FFECB3)' },
  { title: 'Party & Darčeky', slug: 'party',           emoji: '🎉',  bg: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)' },
  { title: 'Doplnky',         slug: 'doplnky',         emoji: '✨',   bg: 'linear-gradient(135deg,#FFF0EB,#FFE0D6)' },
]

export default async function HomePage() {
  let allProducts: Awaited<ReturnType<typeof fetchProducts>> = []
  try { allProducts = await fetchProducts() } catch { allProducts = [] }

  const inStock = allProducts.filter(p => p.inStock)
  const featured = inStock.slice(0, 8)

  const catsWithCount = CATEGORIES.map(cat => ({
    ...cat,
    count: allProducts.filter(p => p.categorySlug === cat.slug).length,
  }))

  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6"
               style={{ background: 'linear-gradient(135deg,#FDF8F3 0%,#fff 50%,#FCE4EC 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: 'rgba(247,160,114,0.1)', filter: 'blur(80px)', transform: 'translate(50%,-50%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
             style={{ background: 'rgba(200,116,217,0.1)', filter: 'blur(60px)', transform: 'translate(-50%,50%)' }} />

        <div className="max-w-content mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide border mb-6 font-sans"
                   style={{ background: 'rgba(247,160,114,0.1)', border: '1px solid rgba(247,160,114,0.2)', color: '#F7A072' }}>
                🌸 Overený slovenský e-shop pre mamičky
              </div>

              <h1 className="font-display font-bold leading-[1.1] mb-6"
                  style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#1C1917' }}>
                Všetko pre
                <br />
                <span className="italic" style={{ color: '#F7A072' }}>radosť</span>
                <br />
                vašich detí
              </h1>

              <p className="text-lg leading-relaxed mb-8 max-w-md font-sans" style={{ color: '#78716C' }}>
                Starostlivo vyberané detské oblečenie, obliečky a hračky.
                Bezpečné, certifikované, s láskou pre vaše deti.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  '✅ Overený predajca',
                  '🚚 Doručenie 2–3 dni',
                  '↩️ Vrátenie 14 dní',
                  '📞 Poradenstvo',
                ].map(badge => (
                  <span key={badge}
                        className="px-3 py-1.5 bg-white rounded-full text-xs font-semibold font-sans shadow-sm"
                        style={{ border: '1px solid #EBE3F0', color: '#78716C' }}>
                    {badge}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-3 flex-wrap mb-8">
                <Link href="/kategoria/vsetky"
                      className="px-8 py-4 rounded-2xl font-bold text-white text-sm font-sans transition-all hover:-translate-y-0.5"
                      style={{ background: '#F7A072', boxShadow: '0 8px 24px rgba(247,160,114,0.35)' }}>
                  Nakupovať teraz
                </Link>
                <Link href="/kategoria/oblecenie"
                      className="px-8 py-4 rounded-2xl font-bold text-sm font-sans transition-all border-2"
                      style={{ borderColor: '#EBE3F0', color: '#78716C' }}>
                  Oblečenie →
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['🧕','👩','👱‍♀️','👩‍🦱','👵'].map((em, i) => (
                    <div key={i}
                         className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm"
                         style={{ background: 'linear-gradient(135deg,rgba(247,160,114,0.3),rgba(200,116,217,0.3))' }}>
                      {em}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-sans" style={{ color: '#78716C' }}>
                  <span className="font-bold" style={{ color: '#1C1917' }}>2 400+</span> spokojných mamičiek
                </p>
              </div>
            </div>

            {/* Right — stacked product cards desktop only */}
            <div className="relative h-[480px] hidden lg:block" style={{ overflow: 'visible' }}>
              {featured.slice(0, 3).map((p, i) => (
                <Link key={p.id} href={`/produkt/${p.slug}`}
                      className="absolute bg-white rounded-3xl p-3 w-48 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      style={{
                        top:       i === 0 ? '16px'  : i === 1 ? '192px' : '48px',
                        left:      i === 0 ? '32px'  : i === 1 ? '176px' : undefined,
                        right:     i === 2 ? '0px'   : undefined,
                        transform: i === 0 ? 'rotate(-5deg)' : i === 1 ? 'rotate(3deg)' : 'rotate(-2deg)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        border: '1px solid #EBE3F0',
                        zIndex: 10,
                      }}>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="192px" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                            style={{ background: '#C874D9' }}>NOVÉ</span>
                    )}
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-xs font-semibold line-clamp-2 leading-tight font-sans" style={{ color: '#1C1917' }}>
                      {p.name}
                    </p>
                    <p className="font-bold text-sm mt-1 font-sans" style={{ color: '#F7A072' }}>
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
              {/* Blobs */}
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full pointer-events-none"
                   style={{ background: '#C874D9', opacity: 0.15, filter: 'blur(40px)' }} />
              <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full pointer-events-none"
                   style={{ background: '#F7A072', opacity: 0.12, filter: 'blur(50px)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── APPLE CARD CAROUSEL — Categories ── */}
      <section className="py-16 px-6">
        <div className="max-w-content mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 font-sans" style={{ color: '#F7A072' }}>
                Nakupujte
              </p>
              <h2 className="font-display text-4xl font-bold" style={{ color: '#1C1917' }}>
                Objavte kategórie
              </h2>
            </div>
            <Link href="/kategoria/vsetky"
                  className="text-sm font-bold hover:underline hidden sm:block font-sans"
                  style={{ color: '#F7A072' }}>
              Všetky produkty →
            </Link>
          </div>
          <AppleCarousel cards={catsWithCount} />
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      {featured.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-content mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 font-sans" style={{ color: '#F7A072' }}>
                  Produkty
                </p>
                <h2 className="font-display text-4xl font-bold" style={{ color: '#1C1917' }}>
                  Obľúbené u mamičiek
                </h2>
              </div>
              <Link href="/kategoria/vsetky"
                    className="text-sm font-bold hover:underline hidden sm:block font-sans"
                    style={{ color: '#F7A072' }}>
                Zobraziť všetky →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(product => (
                <div key={product.id}
                     className="bg-white rounded-3xl overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                     style={{ border: '1px solid #EBE3F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <Link href={`/produkt/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500"
                             sizes="(max-width: 640px) 50vw, 25vw" />
                      {product.badge === 'new' && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#C874D9' }}>NOVÉ</span>
                      )}
                      {product.badge === 'sale' && product.originalPrice && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#F7A072' }}>AKCIA</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/produkt/${product.slug}`}>
                      <h3 className="text-sm font-semibold line-clamp-2 mb-2 leading-snug hover:text-coral transition-colors font-sans"
                          style={{ color: '#1C1917', minHeight: '2.5rem' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base font-bold font-sans" style={{ color: '#F7A072' }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs line-through font-sans" style={{ color: '#78716C' }}>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <AddToCartBtn product={{
                      id: product.id, name: product.name, price: product.price,
                      image: product.image, slug: product.slug,
                      shopUrl: product.shopUrl, inStock: product.inStock,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/kategoria/vsetky"
                    className="inline-block px-8 py-3 rounded-xl font-bold text-sm font-sans border-2"
                    style={{ borderColor: '#F7A072', color: '#F7A072' }}>
                Zobraziť všetky produkty →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg,#FDF8F3,#fff)' }}>
        <div className="max-w-content mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10" style={{ color: '#1C1917' }}>
            Prečo nakupovať u nás?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Overený predajca',   desc: 'Nakupujte s istotou — sme overený slovenský e-shop' },
              { icon: '🚚', title: 'Doručenie do 3 dní', desc: 'Objednajte dnes, dostanete pozajtra' },
              { icon: '↩️', title: 'Vrátenie 14 dní',    desc: 'Nie ste spokojná? Vrátime peniaze bez otázok' },
              { icon: '📞', title: 'Poradenstvo',         desc: 'Volajte nám — radi poradíme s výberom' },
            ].map(item => (
              <div key={item.title}
                   className="bg-white rounded-3xl p-6 text-center group transition-all hover:shadow-md"
                   style={{ border: '1px solid #EBE3F0' }}>
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="font-bold text-sm mb-2 font-sans" style={{ color: '#1C1917' }}>{item.title}</h3>
                <p className="text-xs leading-relaxed font-sans" style={{ color: '#78716C' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
