import { XMLParser } from 'fast-xml-parser'
import { unstable_cache } from 'next/cache'

const FEED_URL = process.env.FEED_URL ||
  'https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  url: string
  shopUrl: string
  category: string
  categorySlug: string
  description: string
  inStock: boolean
  badge?: 'sale' | 'new' | 'popular'
}

// Backward-compat alias used by HeroSection
export type FeedProduct = Product

const CATEGORY_MAP: Record<string, { slug: string; name: string }> = {
  'bytový textil': { slug: 'bytovy-textil', name: 'Bytový textil' },
  'obliečky':      { slug: 'bytovy-textil', name: 'Bytový textil' },
  'plachty':       { slug: 'bytovy-textil', name: 'Bytový textil' },
  'oblečenie':     { slug: 'oblecenie',     name: 'Oblečenie' },
  'tričká':        { slug: 'oblecenie',     name: 'Oblečenie' },
  'pyžamá':        { slug: 'oblecenie',     name: 'Oblečenie' },
  'hračky':        { slug: 'hracky',        name: 'Hračky' },
  'školské':       { slug: 'skolske-potreby', name: 'Školské potreby' },
  'kojeneck':      { slug: 'kojenecke',     name: 'Kojenecké' },
  'kuchyňa':       { slug: 'kuchyna',       name: 'Kuchyňa' },
  'party':         { slug: 'party',         name: 'Party & Darčeky' },
  'doplnky':       { slug: 'doplnky',       name: 'Doplnky' },
}

function getCategoryInfo(category: string) {
  const lower = category.toLowerCase()
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val
  }
  return { slug: 'ostatne', name: category }
}

function slugify(text: string, id: string): string {
  const base = text
    .toLowerCase()
    .replace(/[áä]/g, 'a').replace(/č/g, 'c')
    .replace(/ď/g, 'd').replace(/[éě]/g, 'e')
    .replace(/í/g, 'i').replace(/[ľĺ]/g, 'l')
    .replace(/ň/g, 'n').replace(/[óô]/g, 'o')
    .replace(/[šś]/g, 's').replace(/ť/g, 't')
    .replace(/[úů]/g, 'u').replace(/ý/g, 'y')
    .replace(/[žź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${id}`
}

export function getShopUrl(url: string): string {
  return url
    .replace('http://www.sendeti.sk', 'https://www.sendeti.sk')
}

function parseCdata(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'object' && val !== null && '__cdata' in val) {
    return String((val as Record<string, unknown>)['__cdata'] ?? '')
  }
  return String(val)
}

function parsePrice(raw: unknown): number {
  if (!raw) return 0
  return parseFloat(
    String(raw).replace(',', '.').replace(/[^0-9.]/g, '')
  ) || 0
}

async function fetchProductsRaw(): Promise<Product[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SenDeti/1.0)' },
    })
    if (!res.ok) throw new Error(`Feed ${res.status}`)

    const xml = await res.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      processEntities: false,
      cdataPropName: '__cdata',
    })

    const data = parser.parse(xml)
    const rawItems = data?.rss?.channel?.item ?? []
    const items: unknown[] = Array.isArray(rawItems) ? rawItems : [rawItems]

    return items
      .filter(Boolean)
      .map((item, index) => {
        const i = item as Record<string, unknown>

        const name = parseCdata(i['g:title'] ?? i['title'] ?? '')
        const price = parsePrice(i['g:price'] ?? i['price'] ?? 0)
        const salePriceRaw = i['g:sale_price']
        const salePrice = salePriceRaw ? parsePrice(salePriceRaw) : undefined

        const image = String(i['g:image_link'] ?? i['image_link'] ?? '')
        const extra = i['g:additional_image_link']
        const extraImages: string[] = extra
          ? (Array.isArray(extra) ? extra : [extra]).map(String)
          : []

        const category = String(i['g:product_type'] ?? i['g:google_product_category'] ?? '')
        const catInfo = getCategoryInfo(category)

        const url = String(i['link'] ?? i['g:link'] ?? '')
        const id = String(i['g:id'] ?? i['id'] ?? index)
        const availability = String(i['g:availability'] ?? 'in stock')
        const inStock = !availability.toLowerCase().includes('out')
        const description = parseCdata(i['g:description'] ?? i['description'] ?? '')

        const finalPrice = salePrice ?? price

        return {
          id,
          name,
          slug: slugify(name, id),
          price: finalPrice,
          originalPrice: salePrice ? price : undefined,
          image,
          images: [image, ...extraImages].filter(Boolean),
          url,
          shopUrl: getShopUrl(url),
          category,
          categorySlug: catInfo.slug,
          description,
          inStock,
          badge: (salePrice ? 'sale' : index < 10 ? 'new' : undefined) as Product['badge'],
        } satisfies Product
      })
      .filter(p => p.name && p.price > 0 && p.image)
  } catch (err) {
    console.error('Feed error:', err)
    return []
  }
}

// Cache the parsed JS array (small) instead of the raw 21MB XML response
export const fetchProducts = unstable_cache(
  fetchProductsRaw,
  ['sendeti-feed-products'],
  { revalidate: 300 }
)

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await fetchProducts()
  if (!slug || slug === 'vsetky') return all
  return all.filter(p => p.categorySlug === slug)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await fetchProducts()
  return all.find(p => p.slug === slug) ?? null
}

export async function searchProducts(q: string): Promise<Product[]> {
  const all = await fetchProducts()
  const query = q.toLowerCase()
  return all.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )
}

export function formatPrice(n: number): string {
  return n.toFixed(2).replace('.', ',') + ' €'
}

// Backward-compat alias used by HeroSection
export const formatFeedPrice = formatPrice
