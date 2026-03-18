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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { sort?: string; stock?: string }
}) {
  let products = await getProductsByCategory(params.slug)

  if (searchParams.stock === '1') products = products.filter(p => p.inStock)
  if (searchParams.sort === 'asc')       products = [...products].sort((a, b) => a.price - b.price)
  else if (searchParams.sort === 'desc') products = [...products].sort((a, b) => b.price - a.price)
  else products = [...products.filter(p => p.inStock), ...products.filter(p => !p.inStock)]

  const name = CAT_NAMES[params.slug] || params.slug
  const inStockCount = products.filter(p => p.inStock).length
  const sort = searchParams.sort || ''
  const stock = searchParams.stock || ''

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
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #EBE3F0' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 font-sans" style={{ color: '#78716C' }}>Zoradiť</p>
              {[
                { v: '',      label: '⭐ Odporúčané' },
                { v: 'asc',   label: '↑ Najlacnejšie' },
                { v: 'desc',  label: '↓ Najdrahšie' },
              ].map(opt => (
                <Link key={opt.v}
                      href={`/kategoria/${params.slug}?sort=${opt.v}${stock ? '&stock='+stock : ''}`}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors font-sans ${
                        sort === opt.v ? 'text-white font-semibold' : 'hover:text-coral'
                      }`}
                      style={sort === opt.v
                        ? { background: '#F7A072', color: 'white' }
                        : { color: '#78716C' }}>
                  {opt.label}
                </Link>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #EBE3F0' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 font-sans" style={{ color: '#78716C' }}>Dostupnosť</p>
              <Link href={`/kategoria/${params.slug}?sort=${sort}&stock=${stock === '1' ? '' : '1'}`}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors font-sans ${
                      stock === '1' ? 'font-semibold' : ''
                    }`}
                    style={stock === '1'
                      ? { background: '#DCFCE7', color: '#16A34A' }
                      : { color: '#78716C' }}>
                {stock === '1' ? '✅' : '⬜'} Iba skladom ({inStockCount})
              </Link>
            </div>
            {(sort || stock) && (
              <Link href={`/kategoria/${params.slug}`}
                    className="block text-center text-sm underline py-1 font-sans transition-colors hover:text-coral"
                    style={{ color: '#78716C' }}>
                Zrušiť filtre
              </Link>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter pills */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
            {[
              { v: '', label: 'Odporúčané' },
              { v: 'asc', label: '↑ Cena' },
              { v: 'desc', label: '↓ Cena' },
            ].map(opt => (
              <Link key={opt.v} href={`/kategoria/${params.slug}?sort=${opt.v}`}
                    className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-sans"
                    style={sort === opt.v
                      ? { background: '#F7A072', color: 'white' }
                      : { background: 'white', border: '1px solid #EBE3F0', color: '#78716C' }}>
                {opt.label}
              </Link>
            ))}
            <Link href={`/kategoria/${params.slug}?stock=${stock === '1' ? '' : '1'}`}
                  className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors font-sans"
                  style={stock === '1'
                    ? { background: '#DCFCE7', color: '#16A34A' }
                    : { background: 'white', border: '1px solid #EBE3F0', color: '#78716C' }}>
              Skladom
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-5">🔍</p>
              <h3 className="font-display text-2xl font-bold mb-3" style={{ color: '#1C1917' }}>Žiadne produkty</h3>
              <Link href={`/kategoria/${params.slug}`}
                    className="inline-block px-7 py-3 rounded-xl font-bold text-white text-sm font-sans"
                    style={{ background: '#F7A072' }}>
                Zobraziť všetky
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id}
                     className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
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

export async function generateStaticParams() {
  return [
    { slug: 'bytovy-textil' }, { slug: 'oblecenie' }, { slug: 'hracky' },
    { slug: 'skolske-potreby' }, { slug: 'kojenecke' }, { slug: 'kuchyna' },
    { slug: 'party' }, { slug: 'doplnky' }, { slug: 'vsetky' },
  ]
}
