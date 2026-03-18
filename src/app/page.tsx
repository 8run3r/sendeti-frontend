import { fetchProducts, formatPrice } from '@/lib/feed'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartBtn from '@/components/product/AddToCartBtn'

const CATEGORIES = [
  { name: 'Bytový textil',   slug: 'bytovy-textil',  emoji: '🛏️', bg: '#EBF4FF', color: '#4A90D9' },
  { name: 'Oblečenie',       slug: 'oblecenie',       emoji: '👗',  bg: '#FCE4EC', color: '#E8678A' },
  { name: 'Hračky',          slug: 'hracky',          emoji: '🧸',  bg: '#E0F7FA', color: '#00BCD4' },
  { name: 'Školské potreby', slug: 'skolske-potreby', emoji: '🎒',  bg: '#FFF3E0', color: '#FF9800' },
  { name: 'Kojenecké',       slug: 'kojenecke',       emoji: '👶',  bg: '#F3E5F5', color: '#9C27B0' },
  { name: 'Kuchyňa',         slug: 'kuchyna',         emoji: '🍽️', bg: '#FFF8E1', color: '#FFC107' },
  { name: 'Party & Darčeky', slug: 'party',           emoji: '🎉',  bg: '#E8F5E9', color: '#4CAF50' },
  { name: 'Doplnky',         slug: 'doplnky',         emoji: '✨',   bg: '#FFF0EB', color: '#F7A072' },
]

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof fetchProducts>> = []
  try { products = await fetchProducts() } catch { products = [] }

  const featured = products.filter(p => p.inStock).slice(0, 8)

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #FEF9F4 0%, #FDEEE5 50%, #F3ECFC 100%)' }}
               className="py-20 px-6 overflow-hidden">
        <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold mb-6 font-sans"
                 style={{ background: 'white', border: '1px solid #EBE3F0', color: '#C874D9' }}>
              🌸 Overený slovenský e-shop od roku 2010
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ color: '#1C1917' }}>
              Všetko pre
              <span className="block italic" style={{ color: '#F7A072' }}>radosť vašich detí</span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg font-sans" style={{ color: '#78716C' }}>
              Starostlivo vyberané oblečenie, obliečky a hračky. Bezpečné materiály,
              rýchle doručenie — s láskou pre vaše deti.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: '✅', text: 'Overený predajca' },
                { icon: '🚚', text: 'Doručenie 2–3 dni' },
                { icon: '↩️', text: 'Vrátenie 14 dní' },
                { icon: '📞', text: '+421 905 449 916' },
              ].map(b => (
                <div key={b.text}
                     className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 text-sm font-medium font-sans"
                     style={{ border: '1px solid #EBE3F0', color: '#78716C' }}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/kategoria/vsetky"
                    className="px-8 py-4 rounded-xl font-bold text-white text-sm font-sans transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#F7A072,#e8875a)', boxShadow: '0 8px 24px rgba(247,160,114,0.4)' }}>
                Nakupovať teraz
              </Link>
              <Link href="/kategoria/oblecenie"
                    className="px-8 py-4 rounded-xl font-bold text-sm font-sans transition-all border-2"
                    style={{ borderColor: '#F7A072', color: '#F7A072' }}>
                Oblečenie →
              </Link>
            </div>
          </div>

          {/* Floating product cards — desktop only */}
          <div className="relative h-[480px] hidden lg:block">
            {featured.slice(0, 3).map((p, i) => (
              <Link key={p.id} href={`/produkt/${p.slug}`}
                    className="absolute bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-2"
                    style={{
                      width: i === 0 ? '200px' : i === 1 ? '180px' : '190px',
                      top:   i === 0 ? '30px'  : i === 1 ? '200px' : '60px',
                      left:  i === 0 ? '60px'  : i === 1 ? '30px'  : '240px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                      border: '1px solid #EBE3F0',
                    }}>
                <div className="relative aspect-square bg-gray-50">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                          style={{ background: '#C874D9' }}>NOVÉ</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold line-clamp-2 leading-snug mb-1 font-sans" style={{ color: '#1C1917' }}>
                    {p.name}
                  </p>
                  <p className="text-sm font-bold font-sans" style={{ color: '#F7A072' }}>{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
            {/* Decorative blobs */}
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20"
                 style={{ background: '#C874D9', filter: 'blur(40px)' }} />
            <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-15"
                 style={{ background: '#F7A072', filter: 'blur(50px)' }} />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#F7A072' }}>
              Kategórie
            </p>
            <h2 className="font-display text-4xl font-bold" style={{ color: '#1C1917' }}>
              Objavte naše kategórie
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/kategoria/${cat.slug}`}
                    className="group flex flex-col items-center justify-center p-6 rounded-2xl
                               transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer
                               border-2 border-transparent hover:border-[currentColor]"
                    style={{ background: cat.bg }}>
                <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="font-bold text-sm text-center leading-tight font-sans" style={{ color: '#1C1917' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      {featured.length > 0 && (
        <section className="py-20 px-6" style={{ background: '#FEF9F4' }}>
          <div className="max-w-content mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#F7A072' }}>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(product => (
                <div key={product.id}
                     className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
                     style={{ border: '1px solid #EBE3F0' }}>
                  <Link href={`/produkt/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill
                             className="object-cover group-hover:scale-105 transition-transform duration-300"
                             sizes="(max-width: 640px) 50vw, 25vw" />
                      {product.badge === 'new' && (
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#C874D9' }}>NOVÉ</span>
                      )}
                      {product.badge === 'sale' && product.originalPrice && (
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#F7A072' }}>AKCIA</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 font-sans" style={{ color: '#78716C' }}>
                      {product.category}
                    </p>
                    <Link href={`/produkt/${product.slug}`}>
                      <h3 className="text-sm font-semibold line-clamp-2 mb-3 leading-snug hover:text-coral transition-colors font-sans"
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

      {/* TRUST STRIP */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-content mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🏆', title: 'Overený predajca', desc: 'Sme certifikovaný slovenský e-shop' },
            { icon: '🚚', title: 'Doručenie do 3 dní', desc: 'Objednajte dnes, dostanete čoskoro' },
            { icon: '↩️', title: 'Vrátenie 14 dní', desc: 'Bez otázok vrátime peniaze' },
            { icon: '📞', title: 'Osobné poradenstvo', desc: 'Volejte nám kedykoľvek' },
          ].map(item => (
            <div key={item.title}
                 className="rounded-2xl p-6 text-center transition-all hover:shadow-md"
                 style={{ border: '1px solid #EBE3F0', background: '#FEF9F4' }}>
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h3 className="font-bold text-sm mb-1.5 font-sans" style={{ color: '#1C1917' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed font-sans" style={{ color: '#78716C' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
