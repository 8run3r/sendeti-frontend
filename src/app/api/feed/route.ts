import { NextResponse } from 'next/server'
import { fetchProducts } from '@/lib/feed'

export async function GET() {
  const products = await fetchProducts()
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
