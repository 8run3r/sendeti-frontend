import { fetchProducts, formatPrice } from '@/lib/feed'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartBtn from '@/components/product/AddToCartBtn'

const CATEGORIES = [
  { name: 'Bytový textil',    slug: 'bytovy-textil',   emoji: '🛏️', bg: '#EBF4FF' },
  { name: 'Oblečenie',        slug: 'oblecenie',        emoji: '👗',  bg: '#FCE4EC' },
  { name: 'Hračky',           slug: 'hracky',           emoji: '🧸',  bg: '#E0F7FA' },
  { name: 'Školské potreby',  slug: 'skolske-potreby',  emoji: '🎒',  bg: '#FFF3E0' },
  { name: 'Kojenecké',        slug: 'kojenecke',        emoji: '👶',  bg: '#F3E5F5' },
  { name: 'Kuchyňa',          slug: 'kuchyna',          emoji: '🍽️', bg: '#FFF8E1' },
  { name: 'Party & Darčeky',  slug: 'party',            emoji: '🎉',  bg: '#E8F5E9' },
  { name: 'Doplnky',          slug: 'doplnky',          emoji: '✨',   bg: '#FFF0EB' },
]

export default async function HomePage() {
  let allProducts: Awaited<ReturnType<typeof fetchProducts>> = []
  try {
    allProducts = await fetchProducts()
  } catch {
    allProducts = []
  }
  const featured = allProducts.filter(p => p.inStock).slice(0, 8)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#FDF8F3] to-[#FCE4EC] py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white border border-pink
                             text-purple text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              🌸 Overený slovenský e-shop pre mamičky
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Všetko pre{' '}
              <span className="text-coral">radosť</span>
              {' '}vašich detí
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              Starostlivo vyberané detské oblečenie, obliečky a hračky.
              Bezpečné materiály, rýchle doručenie — s láskou pre vaše deti.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: '✅', text: 'Overený predajca' },
                { icon: '🚚', text: 'Doručenie 2-3 dni' },
                { icon: '↩️', text: 'Vrátenie 14 dní' },
                { icon: '📞', text: '+421 905 449 916' },
              ].map(item => (
                <div key={item.text}
                     className="flex items-center gap-2 bg-white rounded-xl px-3 py-2
                                border border-pink/50 text-sm text-gray-600 font-medium">
                  <span>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/kategoria/vsetky"
                className="px-8 py-3.5 bg-coral text-white font-bold rounded-xl
                           hover:bg-coral/90 transition-colors text-sm"
              >
                Nakupovať teraz
              </Link>
              <Link
                href="/kategoria/oblecenie"
                className="px-8 py-3.5 border-2 border-coral text-coral font-bold
                           rounded-xl hover:bg-coral/5 transition-colors text-sm"
              >
                Oblečenie →
              </Link>
            </div>
          </div>

          {/* Right — floating product cards */}
          <div className="relative h-[420px] hidden lg:block">
            {featured.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                href={`/produkt/${p.slug}`}
                className="absolute bg-white rounded-2xl shadow-xl p-3 w-44
                           hover:shadow-2xl hover:-translate-y-1 transition-all"
                style={{
                  top:  i === 0 ? '20px'  : i === 1 ? '160px' : '40px',
                  left: i === 0 ? '40px'  : i === 1 ? '20px'  : '210px',
                }}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-gray-50">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {p.name}
                </p>
                <p className="text-coral font-bold text-sm mt-1">
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Objavte naše kategórie
            </h2>
            <p className="text-gray-500 text-base">
              Od útleho veku po školský vek — všetko na jednom mieste
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/kategoria/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-6
                           rounded-2xl border-2 border-transparent
                           hover:border-coral hover:shadow-lg transition-all"
                style={{ background: cat.bg }}
              >
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform block">
                  {cat.emoji}
                </span>
                <span className="font-bold text-gray-800 text-sm text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      {featured.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-coral mb-1">
                  Produkty
                </p>
                <h2 className="font-display text-4xl font-bold text-gray-900">
                  Obľúbené u mamičiek
                </h2>
              </div>
              <Link
                href="/kategoria/vsetky"
                className="text-sm font-bold text-coral hover:underline hidden sm:block"
              >
                Zobraziť všetky →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <Link href={`/produkt/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      {product.badge === 'new' && (
                        <span className="absolute top-2 left-2 bg-purple text-white
                                         text-[10px] font-bold px-2 py-0.5 rounded-full">
                          NOVÉ
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/produkt/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2
                                     hover:text-coral transition-colors mb-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-coral">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-green-600 font-medium">✅ Skladom</span>
                    </div>
                    <AddToCartBtn product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      slug: product.slug,
                      shopUrl: product.shopUrl,
                      inStock: product.inStock,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/kategoria/vsetky"
                className="px-8 py-3 border-2 border-coral text-coral font-bold
                           rounded-xl hover:bg-coral/5 transition-colors text-sm inline-block"
              >
                Zobraziť všetky produkty →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST SECTION ── */}
      <section className="py-16 px-6 bg-[#FDF8F3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-gray-900 mb-10">
            Prečo nakupovať u nás?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Overený predajca', desc: 'Nakupujte s istotou — sme overený slovenský e-shop' },
              { icon: '🚚', title: 'Doručenie do 3 dní', desc: 'Objednajte dnes, dostanete pozajtra' },
              { icon: '↩️', title: 'Vrátenie 14 dní', desc: 'Nie ste spokojná? Vrátime peniaze bez otázok' },
              { icon: '📞', title: 'Poradenstvo', desc: 'Volajte nám — radi poradíme s výberom' },
            ].map(item => (
              <div key={item.title}
                   className="bg-white rounded-2xl p-6 border border-pink/30
                              hover:border-coral hover:shadow-md transition-all text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
