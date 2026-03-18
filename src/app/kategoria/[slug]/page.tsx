import { Suspense } from 'react'
import { getProductsByCategory } from '@/lib/feed'
import { CategoryClient } from './CategoryClient'

const CATEGORY_NAMES: Record<string, string> = {
  'bytovy-textil': 'Bytový textil',
  'oblecenie': 'Oblečenie',
  'hracky': 'Hračky',
  'skolske-potreby': 'Školské potreby',
  'kojenecke': 'Kojenecké',
  'kuchyna': 'Kuchyňa',
  'party': 'Party & Darčeky',
  'doplnky': 'Doplnky',
}

interface Props {
  params: { slug: string }
  searchParams: { sort?: string; inStock?: string; maxPrice?: string }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = params
  const sort = searchParams.sort ?? 'default'
  const inStock = searchParams.inStock === '1'
  const maxPrice = Math.min(250, Math.max(0, Number(searchParams.maxPrice ?? 250)))

  let products = await getProductsByCategory(slug)

  if (inStock) products = products.filter(p => p.inStock)
  if (maxPrice < 250) products = products.filter(p => p.price <= maxPrice)
  if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price)

  const categoryName = CATEGORY_NAMES[slug] ?? slug

  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="py-20 text-center text-neutral-400">Načítavam...</div>}>
        <CategoryClient
          products={products}
          categoryName={categoryName}
          sort={sort}
          inStock={inStock}
          maxPrice={maxPrice}
        />
      </Suspense>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_NAMES).map(slug => ({ slug }))
}
