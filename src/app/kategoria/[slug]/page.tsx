import { getProductsByCategory } from '@/lib/feed'
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

interface Props {
  params: { slug: string }
  searchParams: { sort?: string; inStock?: string }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  let products = await getProductsByCategory(params.slug)

  if (searchParams.inStock === '1') {
    products = products.filter(p => p.inStock)
  }

  if (searchParams.sort === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price)
  } else if (searchParams.sort === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price)
  } else {
    products = [
      ...products.filter(p => p.inStock),
      ...products.filter(p => !p.inStock),
    ]
  }

  const name = CAT_NAMES[params.slug] ?? params.slug
  const inStockCount = products.filter(p => p.inStock).length
  const currentSort = searchParams.sort ?? ''
  const isInStockOnly = searchParams.inStock === '1'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg, #F5E6F8 0%, #FFF0EB 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400 mb-2">
            <Link href="/" className="hover:text-orange-400 transition-colors">Domov</Link>
            {' › '}
            <span className="text-gray-600 font-medium">{name}</span>
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">{name}</h1>
          <p className="text-gray-500 text-sm">
            {products.length} produktov · {inStockCount} skladom
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-4">

            {/* Sort */}
            <div className="bg-white rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Zoradiť</p>
              {[
                { v: '', label: '⭐ Odporúčané' },
                { v: 'price-asc', label: '↑ Najlacnejšie' },
                { v: 'price-desc', label: '↓ Najdrahšie' },
              ].map(opt => (
                <Link
                  key={opt.v}
                  href={`/kategoria/${params.slug}?sort=${opt.v}${isInStockOnly ? '&inStock=1' : ''}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm mb-1 transition-colors ${
                    currentSort === opt.v
                      ? 'text-white font-semibold'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                  }`}
                  style={currentSort === opt.v ? { background: '#F7A072' } : {}}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Dostupnosť</p>
              <Link
                href={`/kategoria/${params.slug}?sort=${currentSort}&inStock=${isInStockOnly ? '' : '1'}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isInStockOnly ? 'text-white font-semibold' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                style={isInStockOnly ? { background: '#52C97E' } : {}}
              >
                {isInStockOnly ? '✅' : '⬜'} Iba skladom ({inStockCount})
              </Link>
            </div>

            {(currentSort || isInStockOnly) && (
              <Link
                href={`/kategoria/${params.slug}`}
                className="block text-center text-sm text-gray-400 hover:text-orange-400 transition-colors underline py-1"
              >
                Zrušiť filtre
              </Link>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter pills */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-1">
            {[
              { v: '', label: 'Odporúčané' },
              { v: 'price-asc', label: '↑ Cena' },
              { v: 'price-desc', label: '↓ Cena' },
            ].map(opt => (
              <Link
                key={opt.v}
                href={`/kategoria/${params.slug}?sort=${opt.v}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  currentSort === opt.v
                    ? 'text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
                style={currentSort === opt.v ? { background: '#F7A072' } : {}}
              >
                {opt.label}
              </Link>
            ))}
            <Link
              href={`/kategoria/${params.slug}?inStock=${isInStockOnly ? '' : '1'}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isInStockOnly ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
              style={isInStockOnly ? { background: '#52C97E' } : {}}
            >
              Skladom
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Žiadne produkty</h3>
              <Link
                href={`/kategoria/${params.slug}`}
                className="mt-4 inline-block px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: '#F7A072' }}
              >
                Zobraziť všetky
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <Link href={`/produkt/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                            NEDOSTUPNÉ
                          </span>
                        </div>
                      )}
                      {product.badge === 'sale' && product.inStock && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          AKCIA
                        </span>
                      )}
                      {product.badge === 'new' && product.inStock && (
                        <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full"
                          style={{ background: '#C874D9' }}>
                          NOVÉ
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link href={`/produkt/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 hover:text-orange-500 transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold" style={{ color: '#F7A072' }}>
                        {product.price.toFixed(2).replace('.', ',')} €
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toFixed(2).replace('.', ',')} €
                        </span>
                      )}
                    </div>
                    <AddToCartBtn product={product} />
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
    { slug: 'bytovy-textil' },
    { slug: 'oblecenie' },
    { slug: 'hracky' },
    { slug: 'skolske-potreby' },
    { slug: 'kojenecke' },
    { slug: 'kuchyna' },
    { slug: 'party' },
    { slug: 'doplnky' },
    { slug: 'vsetky' },
  ]
}
