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

const CATEGORY_MAP: Record<string, string> = {
  'Bytový textil': 'bytovy-textil',
  'Obliečky': 'bytovy-textil',
  'Plachty': 'bytovy-textil',
  'Deky': 'bytovy-textil',
  'Vankúšiky': 'bytovy-textil',
  'Oblečenie': 'oblecenie',
  'Tričká': 'oblecenie',
  'Pyžamá': 'oblecenie',
  'Mikiny': 'oblecenie',
  'Hračky': 'hracky',
  'Hračky mix': 'hracky',
  'Školské potreby': 'skolske-potreby',
  'Školské tašky': 'skolske-potreby',
  'Kojenecký': 'kojenecke',
  'Kuchyňa': 'kuchyna',
  'Party doplnky': 'party',
  'Doplnky': 'doplnky',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áä]/g, 'a')
    .replace(/[čč]/g, 'c')
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
      parseAttributeValue: false,
      processEntities: false,
    })

    const parsed = parser.parse(xml)

    const channel = parsed?.rss?.channel
    const items = channel?.item || []
    const itemArray = Array.isArray(items) ? items : [items]

    return itemArray
      .filter((item: unknown) => item)
      .map((item: Record<string, unknown>) => {
        const name = String(item['title'] || item['g:title'] || '')
        const priceRaw = item['g:price'] || item['price'] || '0'
        const price = parseFloat(String(priceRaw).replace(/[^0-9.]/g, '')) || 0

        const salePriceRaw = item['g:sale_price'] || ''
        const salePrice = salePriceRaw
          ? parseFloat(String(salePriceRaw).replace(/[^0-9.]/g, ''))
          : undefined

        const image = String(
          item['g:image_link'] || item['image_link'] || ''
        )

        const additionalImages = item['g:additional_image_link']
          ? Array.isArray(item['g:additional_image_link'])
            ? (item['g:additional_image_link'] as unknown[]).map(String)
            : [String(item['g:additional_image_link'])]
          : []

        const category = String(
          item['g:product_type'] ||
            item['g:google_product_category'] ||
            item['product_type'] ||
            ''
        )

        const categorySlug =
          Object.entries(CATEGORY_MAP).find(([key]) =>
            category.toLowerCase().includes(key.toLowerCase())
          )?.[1] || 'ostatne'

        const url = String(item['link'] || item['g:link'] || '')
        const id = String(item['g:id'] || item['id'] || slugify(name))
        const availability = String(item['g:availability'] || 'in stock')

        return {
          id,
          name,
          slug: slugify(name) + '-' + id,
          price: salePrice || price,
          originalPrice: salePrice ? price : undefined,
          image,
          images: [image, ...additionalImages].filter(Boolean),
          url,
          category,
          categorySlug,
          description: String(
            item['description'] || item['g:description'] || ''
          ),
          inStock: !availability.includes('out'),
          brand: String(item['g:brand'] || ''),
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
  return products.find((p) => p.slug === slug) || null
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
