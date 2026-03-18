import type { Metadata } from 'next'
import { getProductsByCategory, formatPrice } from '@/lib/feed'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartBtn from '@/components/product/AddToCartBtn'

const CAT_NAMES: Record<string, string> = {
  'bytovy-textil':   '🛏️ Bytový textil',
  'oblecenie':       '👗 Oblečenie',
  'hracky':          '🧸 Hračky',
  'skolske-potreby': '🎒 Školské potreby',
  'kojenecke':       '👶 Kojenecké',
  'kuchyna':         '🍽️ Kuchyňa',
  'party':           '🎉 Party & Darčeky',
  'doplnky':         '✨ Doplnky',
  'vsetky':          'Všetky produkty',
}

const PRICE_RANGES = [
  { label: 'Do 10 €',    min: 0,   max: 10  },
  { label: '10 – 25 €',  min: 10,  max: 25  },
  { label: '25 – 50 €',  min: 25,  max: 50  },
  { label: 'Nad 50 €',   min: 50,  max: undefined },
]

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) p.set(k, v)
  }
  const qs = p.toString()
  return qs ? `${base}?${qs}` : base
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { sort?: string; stock?: string; q?: string; minPrice?: string; maxPrice?: string }
}) {
  let products = await getProductsByCategory(params.slug)

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }
  if (searchParams.stock === '1') products = products.filter(p => p.inStock)
  if (searchParams.minPrice) products = products.filter(p => p.price >= Number(searchParams.minPrice))
  if (searchParams.maxPrice) products = products.filter(p => p.price <= Number(searchParams.maxPrice))

  if (searchParams.sort === 'asc')       products = [...products].sort((a, b) => a.price - b.price)
  else if (searchParams.sort === 'desc') products = [...products].sort((a, b) => b.price - a.price)
  else products = [...products.filter(p => p.inStock), ...products.filter(p => !p.inStock)]

  const name = CAT_NAMES[params.slug] || params.slug
  const inStockCount = (await getProductsByCategory(params.slug)).filter(p => p.inStock).length
  const sort = searchParams.sort || ''
  const stock = searchParams.stock || ''
  const q = searchParams.q || ''
  const minPrice = searchParams.minPrice || ''
  const maxPrice = searchParams.maxPrice || ''
  const base = `/kategoria/${params.slug}`

  const hasFilters = !!(sort || stock || q || minPrice || maxPrice)

  function sidebarUrl(overrides: Record<string, string | undefined>) {
    return buildUrl(base, { sort, stock, q, minPrice, maxPrice, ...overrides })
  }

  const activePriceRange = PRICE_RANGES.find(
    r => String(r.min) === minPrice && (r.max === undefined ? !maxPrice : String(r.max) === maxPrice)
  )

  return (
    <div className="min-h-screen">
      {/* Header banner */}
      <div style={{ background: 'linear-gradient(135deg,#FEF9F4,#FDEEE5)', borderBottom: '1px solid #EBE3F0' }}
           className="py-12 px-6">
        <div className="max-w-content mx-auto">
          <p className="text-sm mb-3 font-sans" style={{ color: '#78716C' }}>
            <Link href="/" className="hover:text-coral transition-colors">Domov</Link>
            <span className="mx-2">›</span>
            <span style={{ color: '#1C1917', fontWeight: 600 }}>{name}</span>
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#1C1917' }}>
            {name}
          </h1>
          <p className="font-sans text-sm" style={{ color: '#78716C' }}>
            {products.length} produktov · {inStockCount} skladom
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #EBE3F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <p className="text-sm font-bold mb-4 font-sans" style={{ color: '#1C1917' }}>Filtrovať</p>

              {/* Sort */}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#78716C' }}>Zoradiť</p>
              {[
                { v: '',     label: 'Odporúčané' },
                { v: 'asc',  label: 'Cena ↑' },
                { v: 'desc', label: 'Cena ↓' },
              ].map(opt => (
                <Link key={opt.v}
                      href={sidebarUrl({ sort: opt.v || undefined })}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors font-sans ${
                        sort === opt.v ? 'text-white font-semibold' : 'hover:bg-blush hover:text-coral'
                      }`}
                      style={sort === opt.v ? { background: '#F7A072', color: 'white' } : { color: '#78716C' }}>
                  {opt.label}
                </Link>
              ))}

              <div className="my-4" style={{ borderTop: '1px solid #EBE3F0' }} />

              {/* Availability */}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#78716C' }}>Dostupnosť</p>
              <Link href={sidebarUrl({ stock: stock === '1' ? undefined : '1' })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors font-sans mb-1 ${
                      stock === '1' ? 'font-semibold' : 'hover:bg-blush hover:text-coral'
                    }`}
                    style={stock === '1' ? { background: '#DCFCE7', color: '#16A34A' } : { color: '#78716C' }}>
                {stock === '1' ? '✅' : '⬜'} Iba skladom
              </Link>

              <div className="my-4" style={{ borderTop: '1px solid #EBE3F0' }} />

              {/* Price */}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-sans" style={{ color: '#78716C' }}>Cena</p>
              {PRICE_RANGES.map(range => {
                const isActive = activePriceRange?.label === range.label
                return (
                  <Link key={range.label}
                        href={isActive
                          ? sidebarUrl({ minPrice: undefined, maxPrice: undefined })
                          : sidebarUrl({ minPrice: String(range.min), maxPrice: range.max !== undefined ? String(range.max) : undefined })
                        }
                        className={`flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors font-sans ${
                          isActive ? 'text-white font-semibold' : 'hover:bg-blush hover:text-coral'
                        }`}
                        style={isActive ? { background: '#F7A072', color: 'white' } : { color: '#78716C' }}>
                    {range.label}
                  </Link>
                )
              })}
            </div>

            {hasFilters && (
              <Link href={base}
                    className="block text-center text-sm font-medium py-2.5 rounded-xl border transition-colors font-sans hover:bg-coral hover:text-white hover:border-coral"
                    style={{ borderColor: '#EBE3F0', color: '#78716C' }}>
                Zrušiť filtre
              </Link>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter chips */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
            {[
              { v: '', label: 'Odporúčané' },
              { v: 'asc', label: '↑ Cena' },
              { v: 'desc', label: '↓ Cena' },
            ].map(opt => (
              <Link key={opt.v} href={sidebarUrl({ sort: opt.v || undefined })}
                    className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-sans"
                    style={sort === opt.v
                      ? { background: '#F7A072', color: 'white' }
                      : { background: 'white', border: '1px solid #EBE3F0', color: '#78716C' }}>
                {opt.label}
              </Link>
            ))}
            <Link href={sidebarUrl({ stock: stock === '1' ? undefined : '1' })}
                  className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-sans"
                  style={stock === '1'
                    ? { background: '#DCFCE7', color: '#16A34A' }
                    : { background: 'white', border: '1px solid #EBE3F0', color: '#78716C' }}>
              Skladom
            </Link>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {q && (
                <Link href={sidebarUrl({ q: undefined })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                      style={{ background: 'rgba(247,160,114,0.1)', color: '#F7A072', border: '1px solid rgba(247,160,114,0.2)' }}>
                  🔍 {q} ×
                </Link>
              )}
              {stock === '1' && (
                <Link href={sidebarUrl({ stock: undefined })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                      style={{ background: 'rgba(247,160,114,0.1)', color: '#F7A072', border: '1px solid rgba(247,160,114,0.2)' }}>
                  ✅ Skladom ×
                </Link>
              )}
              {activePriceRange && (
                <Link href={sidebarUrl({ minPrice: undefined, maxPrice: undefined })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                      style={{ background: 'rgba(247,160,114,0.1)', color: '#F7A072', border: '1px solid rgba(247,160,114,0.2)' }}>
                  💰 {activePriceRange.label} ×
                </Link>
              )}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-24 px-6">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
                Táto kategória je prázdna
              </h3>
              <p className="text-sm mb-6 font-sans" style={{ color: '#78716C' }}>
                Skúste inú kategóriu alebo nás kontaktujte
              </p>
              <a href="tel:+421905449916"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm font-sans"
                 style={{ background: '#F7A072' }}>
                📞 Zavolajte nám
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id}
                     className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(247,160,114,0.2)] group"
                     style={{ border: '1px solid #EBE3F0' }}>
                  <Link href={`/produkt/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill
                             className="object-cover group-hover:scale-105 transition-transform duration-300"
                             sizes="(max-width: 640px) 50vw, 25vw" />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white text-xs font-bold px-3 py-1 rounded-full font-sans" style={{ color: '#78716C' }}>NEDOSTUPNÉ</span>
                        </div>
                      )}
                      {product.badge === 'new' && product.inStock && (
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#C874D9' }}>NOVÉ</span>
                      )}
                      {product.badge === 'sale' && product.inStock && (
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                              style={{ background: '#F7A072' }}>AKCIA</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3.5">
                    <Link href={`/produkt/${product.slug}`}>
                      <h3 className="text-sm font-semibold line-clamp-2 mb-2.5 leading-snug hover:text-coral transition-colors font-sans"
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
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const name = CAT_NAMES[params.slug] || params.slug
  const cleanName = name.replace(/[^\w\s]/g, '').trim()
  return {
    title: cleanName,
    description: `Nakupujte ${cleanName} v overenom slovenskom e-shope Sen Detí. Rýchle doručenie, vrátenie 14 dní.`,
  }
}

export async function generateStaticParams() {
  return [
    { slug: 'bytovy-textil' }, { slug: 'oblecenie' }, { slug: 'hracky' },
    { slug: 'skolske-potreby' }, { slug: 'kojenecke' }, { slug: 'kuchyna' },
    { slug: 'party' }, { slug: 'doplnky' }, { slug: 'vsetky' },
  ]
}
