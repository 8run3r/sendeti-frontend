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

  if (searchParams.stock === '1') {
    products = products.filter(p => p.inStock)
  }
  if (searchParams.sort === 'asc') {
    products = [...products].sort((a, b) => a.price - b.price)
  } else if (searchParams.sort === 'desc') {
    products = [...products].sort((a, b) => b.price - a.price)
  } else {
    products = [
      ...products.filter(p => p.inStock),
      ...products.filter(p => !p.inStock),
    ]
  }

  const name = CAT_NAMES[params.slug] || params.slug
  const inStockCount = products.filter(p => p.inStock).length
  const currentSort = searchParams.sort || ''
  const currentStock = searchParams.stock || ''

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FDF8F3] to-[#FCE4EC] border-b border-pink/30 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-400 mb-3">
            <Link href="/" className="hover:text-coral transition-colors">Domov</Link>
            {' › '}
            <span className="text-gray-600 font-medium">{name}</span>
          </p>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">{name}</h1>
          <p className="text-gray-500">
            {products.length} produktov
            {inStockCount < products.length && ` · ${inStockCount} skladom`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-4">

            {/* Sort */}
            <div className="bg-white rounded-2xl border border-pink/30 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Zoradiť
              </p>
              {[
                { v: '',      label: '⭐ Odporúčané' },
                { v: 'asc',   label: '↑ Najlacnejšie' },
                { v: 'desc',  label: '↓ Najdrahšie' },
              ].map(opt => (
                <Link
                  key={opt.v}
                  href={`/kategoria/${params.slug}?sort=${opt.v}${currentStock ? '&stock=' + currentStock : ''}`}
                  className={`flex items-center px-3 py-2 rounded-xl text-sm mb-1 transition-colors ${
                    currentSort === opt.v
                      ? 'bg-coral text-white font-semibold'
                      : 'text-gray-600 hover:bg-coral/10 hover:text-coral'
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-pink/30 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Dostupnosť
              </p>
              <Link
                href={`/kategoria/${params.slug}?sort=${currentSort}&stock=${currentStock === '1' ? '' : '1'}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  currentStock === '1'
                    ? 'bg-green-500 text-white font-semibold'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                {currentStock === '1' ? '✅' : '⬜'} Iba skladom ({inStockCount})
              </Link>
            </div>

            {(currentSort || currentStock) && (
              <Link
                href={`/kategoria/${params.slug}`}
                className="block text-center text-sm text-gray-400 hover:text-coral underline py-1"
              >
                Zrušiť filtre
              </Link>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">

          {/* Mobile filters */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-1">
            {[
              { v: '',     label: 'Odporúčané' },
              { v: 'asc',  label: '↑ Cena' },
              { v: 'desc', label: '↓ Cena' },
            ].map(opt => (
              <Link
                key={opt.v}
                href={`/kategoria/${params.slug}?sort=${opt.v}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  currentSort === opt.v
                    ? 'bg-coral text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {opt.label}
              </Link>
            ))}
            <Link
              href={`/kategoria/${params.slug}?stock=${currentStock === '1' ? '' : '1'}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                currentStock === '1'
                  ? 'bg-green-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              Skladom
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="font-display text-2xl font-bold text-gray-700 mb-3">
                Žiadne produkty
              </h3>
              <Link
                href={`/kategoria/${params.slug}`}
                className="inline-block px-6 py-3 bg-coral text-white rounded-xl font-semibold"
              >
                Zobraziť všetky
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
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
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                            NEDOSTUPNÉ
                          </span>
                        </div>
                      )}
                      {product.badge === 'new' && product.inStock && (
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
                                     hover:text-coral transition-colors mb-2 leading-snug min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-coral">
                        {formatPrice(product.price)}
                      </span>
                      {product.inStock
                        ? <span className="text-xs text-green-600 font-medium">✅ Skladom</span>
                        : <span className="text-xs text-gray-400">Nedostupné</span>
                      }
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
