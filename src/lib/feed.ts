import { XMLParser } from 'fast-xml-parser'

const FEED_URL = 'https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml'

export interface FeedProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  url: string
  category: string
  categorySlug: string
  description: string
  inStock: boolean
  brand?: string
}

// Feed uses uppercase categories — match case-insensitively
const CATEGORY_MAP: Record<string, string> = {
  'bytový textil': 'bytovy-textil',
  'oblečenie': 'oblecenie',
  'hračky': 'hracky',
  'školské potreby': 'skolske-potreby',
  'kojenecké': 'kojenecke',
  'kuchyňa': 'kuchyna',
  'party': 'party',
  'doplnky': 'doplnky',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áä]/g, 'a')
    .replace(/[čć]/g, 'c')
    .replace(/[ď]/g, 'd')
    .replace(/[éě]/g, 'e')
    .replace(/[í]/g, 'i')
    .replace(/[ľĺ]/g, 'l')
    .replace(/[ň]/g, 'n')
    .replace(/[óô]/g, 'o')
    .replace(/[ŕ]/g, 'r')
    .replace(/[šś]/g, 's')
    .replace(/[ť]/g, 't')
    .replace(/[úů]/g, 'u')
    .replace(/[ý]/g, 'y')
    .replace(/[žź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Parse "29,50 EUR" → 29.50
 * The feed uses European comma decimals.
 */
function parsePrice(raw: unknown): number {
  if (!raw) return 0
  const str = String(raw)
    .replace(',', '.')   // "29,50" → "29.50"
    .replace(/[^0-9.]/g, '') // strip "EUR", spaces, etc.
  return parseFloat(str) || 0
}

export async function fetchProducts(): Promise<FeedProduct[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`)

    const xml = await res.text()

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      processEntities: false,  // avoids entity expansion limit on large feeds
      cdataPropName: '__cdata', // parse CDATA sections explicitly
    })

    const parsed = parser.parse(xml)

    const channel = parsed?.rss?.channel
    const items: unknown[] = channel?.item
      ? Array.isArray(channel.item)
        ? channel.item
        : [channel.item]
      : []

    return items
      .filter(Boolean)
      .map((item) => {
        const i = item as Record<string, unknown>

        // Title — may be plain string or CDATA object
        const titleRaw = i['g:title']
        const name = String(
          typeof titleRaw === 'object' && titleRaw !== null
            ? (titleRaw as Record<string, unknown>)['__cdata'] ?? ''
            : titleRaw ?? ''
        ).trim()

        // Description — may be CDATA
        const descRaw = i['g:description']
        const description = String(
          typeof descRaw === 'object' && descRaw !== null
            ? (descRaw as Record<string, unknown>)['__cdata'] ?? ''
            : descRaw ?? ''
        ).trim()

        // Price: "29,50 EUR"
        const price = parsePrice(i['g:price'])

        // No sale_price in this feed — skip
        const image = String(i['g:image_link'] ?? '')

        // Additional images (not present in this feed, but keep for future)
        const additionalImages = i['g:additional_image_link']
          ? Array.isArray(i['g:additional_image_link'])
            ? (i['g:additional_image_link'] as unknown[]).map(String)
            : [String(i['g:additional_image_link'])]
          : []

        // Category — uppercase in this feed e.g. "BYTOVÝ TEXTIL "
        const category = String(i['g:product_type'] ?? '').trim()
        const categoryLower = category.toLowerCase()

        const categorySlug =
          Object.entries(CATEGORY_MAP).find(([key]) =>
            categoryLower.includes(key)
          )?.[1] ?? 'ostatne'

        const url = String(i['link'] ?? '')
        const id = String(i['g:id'] ?? slugify(name))
        const availability = String(i['g:availability'] ?? 'in stock')

        return {
          id,
          name,
          slug: slugify(name) + '-' + id,
          price,
          image,
          images: [image, ...additionalImages].filter(Boolean),
          url,
          category,
          categorySlug,
          description,
          inStock: !availability.toLowerCase().includes('out'),
          brand: String(i['g:brand'] ?? '').trim() || undefined,
        } satisfies FeedProduct
      })
      .filter((p) => p.name && p.price > 0 && p.image)
  } catch (error) {
    console.error('Feed error:', error)
    return []
  }
}

export async function getProductBySlug(
  slug: string
): Promise<FeedProduct | null> {
  const products = await fetchProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<FeedProduct[]> {
  const products = await fetchProducts()
  if (categorySlug === 'vsetky') return products
  return products.filter((p) => p.categorySlug === categorySlug)
}

export async function searchProducts(query: string): Promise<FeedProduct[]> {
  const products = await fetchProducts()
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}

export function formatFeedPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €'
}
