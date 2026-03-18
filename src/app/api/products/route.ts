import { fetchProducts } from '@/lib/feed'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')

  let products = await fetchProducts()

  if (category && category !== 'vsetky') {
    products = products.filter(p => p.categorySlug === category)
  }

  if (q) {
    const query = q.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return NextResponse.json(products)
}
