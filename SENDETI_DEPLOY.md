# SENDETI FRONTEND — Complete Fix & Deploy Guide
# Pre Claude Code — prečítaj celý súbor pred začatím

## KONTEXT
- Next.js 14 App Router + TypeScript + Tailwind + Framer Motion
- E-shop pre mamičky 30-65 rokov
- Produkty z XML feedu: https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml
- Košík na našom frontende, checkout presmeruje na shop.sendeti.sk
- Deploy: Vercel (auto-deploy cez GitHub push)

## FARBY
```
--coral:   #F7A072   (CTA, ceny, hover)
--purple:  #C874D9   (accenty, badges)
--pink:    #E1BBC9   (bordery)
--mint:    #E2FCEF   (pozadia)
--dark:    #1a1a1a
```

## FONTY
- Display: Lora (serif) — nadpisy
- Body: Source Sans 3 — text, UI
- Minimum font-size: 16px (audience 30-65!)

---

## WORKFLOW: LOKÁLNE vs VERCEL

**Lokálne je lepšie** pre túto prácu:
```bash
npm run dev          # vidíš zmeny okamžite
git add .
git commit -m "fix"
git push             # Vercel auto-deployuje
```

Vercel berie každý push na main branch automaticky.
NIKDY neupravuj priamo na Verceli.

---

## KROK 1 — DIAGNÓZA (urob PRVÝ)

```bash
# 1. Over feed
node -e "
const https = require('https');
https.get('https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('CONTENT-TYPE:', res.headers['content-type']);
    console.log('---FIRST 1000 CHARS---');
    console.log(d.substring(0, 1000));
    
    // Count lines
    const lines = d.split('\n').filter(l => l.trim());
    console.log('TOTAL LINES:', lines.length);
    console.log('---LINE 1---');
    console.log(lines[0]);
    console.log('---LINE 2---');
    console.log(lines[1]);
  });
}).on('error', e => console.error('ERROR:', e.message));
"

# 2. Over aktuálny stav súborov
cat src/lib/feed.ts
cat src/app/page.tsx
cat next.config.js
```

Zobraz mi kompletný output pred tým ako niečo meníš.

---

## KROK 2 — OPRAV /src/lib/feed.ts

Prepíš kompletne podľa skutočnej štruktúry feedu.

```typescript
import { cache } from 'react'

const FEED_URL = 'https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml'

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

function slugify(text: string, id: string): string {
  return text
    .toLowerCase()
    .replace(/[áä]/g, 'a').replace(/[čć]/g, 'c')
    .replace(/ď/g, 'd').replace(/[éě]/g, 'e')
    .replace(/í/g, 'i').replace(/[ľĺ]/g, 'l')
    .replace(/ň/g, 'n').replace(/[óô]/g, 'o')
    .replace(/[šś]/g, 's').replace(/ť/g, 't')
    .replace(/[úů]/g, 'u').replace(/ý/g, 'y')
    .replace(/[žź]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + id
}

function getCategorySlug(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('obliečk') || t.includes('obliecka') ||
      t.includes('placht') || t.includes('deka') ||
      t.includes('vankúš') || t.includes('župan') ||
      t.includes('uterák') || t.includes('osušk') ||
      t.includes('pončo') || t.includes('bytový')) return 'bytovy-textil'
  if (t.includes('oblečen') || t.includes('tričk') ||
      t.includes('pyžam') || t.includes('mikin') ||
      t.includes('legín') || t.includes('šaty') ||
      t.includes('sukn') || t.includes('obuv') ||
      t.includes('plavk') || t.includes('dojčat') ||
      t.includes('čiapk') || t.includes('blúzk')) return 'oblecenie'
  if (t.includes('hračk') || t.includes('stavebnic') ||
      t.includes('plyš')) return 'hracky'
  if (t.includes('školsk') || t.includes('tašk') ||
      t.includes('ruksak') || t.includes('peračník') ||
      t.includes('papiernictv')) return 'skolske-potreby'
  if (t.includes('kojeneck') || t.includes('dojčenk') ||
      t.includes('bábätk')) return 'kojenecke'
  if (t.includes('kuchyn') || t.includes('pohár') ||
      t.includes('tanier') || t.includes('fľaš') ||
      t.includes('príbor') || t.includes('zaster')) return 'kuchyna'
  if (t.includes('party') || t.includes('tort') ||
      t.includes('balón') || t.includes('kostým') ||
      t.includes('sviečk') || t.includes('darček')) return 'party'
  if (t.includes('doplnk') || t.includes('hodinky') ||
      t.includes('lamp') || t.includes('kabelk')) return 'doplnky'
  return 'ostatne'
}

export function getShopUrl(url: string): string {
  if (!url) return 'https://shop.sendeti.sk'
  return url
    .replace('https://www.sendeti.sk', 'https://shop.sendeti.sk')
    .replace('http://www.sendeti.sk', 'https://shop.sendeti.sk')
    .replace('https://sendeti.sk', 'https://shop.sendeti.sk')
}

export const fetchProducts = cache(async (): Promise<Product[]> => {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SenDeti/1.0)' }
    })

    if (!res.ok) {
      console.error('[Feed] HTTP error:', res.status)
      return []
    }

    const text = await res.text()
    console.log('[Feed] Length:', text.length)

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20)
    console.log('[Feed] Lines:', lines.length)

    const products: Product[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Extract image URL
      const imgMatch = line.match(
        /https?:\/\/[^\s"'<>]+fotky[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)/i
      )
      if (!imgMatch) continue
      const image = imgMatch[0]

      // Extract product page URL
      const urlMatch = line.match(
        /https?:\/\/(?:www\.)?sendeti\.sk\/[^\s"'<>]+/i
      )
      const url = urlMatch ? urlMatch[0].split(/\s/)[0] : ''

      // Extract price
      const priceMatches = [...line.matchAll(/\b(\d{1,4})[,.](\d{2})\b/g)]
      const prices = priceMatches
        .map(m => parseFloat(`${m[1]}.${m[2]}`))
        .filter(p => p > 0.5 && p < 9999)
      if (prices.length === 0) continue
      const price = Math.min(...prices)

      // In stock check
      const inStock = !line.toLowerCase().includes('out of stock')

      // Category from line text
      const categorySlug = getCategorySlug(line)

      // Extract name - find the longest capitalized word sequence
      // that is not a URL and not a number pattern
      const words = line
        .replace(/https?:\/\/\S+/g, '')  // remove URLs
        .replace(/\d+x\d+/g, '')          // remove dimensions
        .replace(/\d+[.,]\d+/g, '')       // remove prices
        .replace(/\b(SK|EUR|FALSE|TRUE|new|in stock|out of stock)\b/gi, '')
        .trim()

      // Find product name - look for Slovak product name patterns
      const nameMatch = words.match(
        /([A-ZÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ][a-záäčďéíľĺňóôŕšťúýž]+(?:\s+[A-Za-záäčďéíľĺňóôŕšťúýž0-9]+){1,6})/
      )

      const name = nameMatch
        ? nameMatch[1].trim().substring(0, 80)
        : `Produkt ${i + 1}`

      if (name.length < 4) continue

      const id = String(i + 1)

      products.push({
        id,
        name,
        slug: slugify(name, id),
        price,
        originalPrice: prices.length > 1 ? Math.max(...prices) : undefined,
        image,
        images: [image],
        url,
        shopUrl: getShopUrl(url),
        category: categorySlug,
        categorySlug,
        description: '',
        inStock,
        badge: !inStock ? undefined : price < 10 ? 'sale' : i < 30 ? 'new' : undefined,
      })
    }

    // Sort: in stock first
    products.sort((a, b) => {
      if (a.inStock && !b.inStock) return -1
      if (!a.inStock && b.inStock) return 1
      return 0
    })

    console.log('[Feed] Parsed products:', products.length)
    console.log('[Feed] In stock:', products.filter(p => p.inStock).length)
    console.log('[Feed] Out of stock:', products.filter(p => !p.inStock).length)
    if (products[0]) console.log('[Feed] First:', JSON.stringify(products[0], null, 2))

    return products

  } catch (err) {
    console.error('[Feed] Error:', err)
    return []
  }
})

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
    p.categorySlug.includes(query)
  )
}

export function formatPrice(n: number): string {
  return n.toFixed(2).replace('.', ',') + '\u00a0€'
}
```

---

## KROK 3 — OPRAV next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.sendeti.sk', pathname: '/**' },
      { protocol: 'https', hostname: 'sendeti.sk', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
}
export default nextConfig
```

---

## KROK 4 — OPRAV HOMEPAGE /src/app/page.tsx

```typescript
import { fetchProducts, formatPrice } from '@/lib/feed'
import { Suspense } from 'react'
// ... ostatné importy

export default async function HomePage() {
  const products = await fetchProducts()
  
  const featured = products.filter(p => p.inStock).slice(0, 8)
  const heroProducts = products.filter(p => p.inStock).slice(0, 3)
  
  console.log('[Page] Total products:', products.length)
  console.log('[Page] Featured:', featured.length)

  return (
    <>
      <HeroSection products={heroProducts} />
      <CategoriesSection />
      {featured.length > 0 && (
        <section className="py-16 px-6">
          <h2 className="font-display text-3xl mb-8">Bestsellery</h2>
          <ProductGrid products={featured} />
        </section>
      )}
      {featured.length === 0 && (
        <p className="text-center py-20 text-gray-500">
          Načítavanie produktov...
        </p>
      )}
    </>
  )
}
```

---

## KROK 5 — OPRAV KATEGÓRIE /src/app/kategoria/[slug]/page.tsx

```typescript
import { getProductsByCategory } from '@/lib/feed'

export default async function CategoryPage({
  params
}: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug)
  
  // In stock first, out of stock last
  const sorted = [
    ...products.filter(p => p.inStock),
    ...products.filter(p => !p.inStock)
  ]

  return (
    <div>
      <CategoryHeader slug={params.slug} count={sorted.length} />
      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductGrid products={sorted} />
      )}
    </div>
  )
}
```

---

## KROK 6 — SPRÁVNY FLOW TLAČIDIEL

### Pravidlo:
```
ProductCard klik → /produkt/[slug]        (náš frontend)
"Pridať do košíka" → addToCart(product)   (Zustand store)
Cart Drawer "Objednať" → shop.sendeti.sk  (eshoprychlo)
```

### ProductCard.tsx
```typescript
// Klik na kartu
<Link href={`/produkt/${product.slug}`}>

// Tlačidlo košík
<button onClick={(e) => {
  e.preventDefault()
  e.stopPropagation()
  addToCart(product)
  openCart()
}}>
  Pridať do košíka
</button>
```

### CartDrawer.tsx — JEDINÉ miesto pre eshoprychlo link
```typescript
<button onClick={() => {
  if (items.length === 1) {
    window.location.href = items[0].product.shopUrl
  } else {
    window.location.href = 'https://shop.sendeti.sk'
  }
}}>
  Prejsť k objednávke →
</button>
<p className="text-xs text-center text-gray-400 mt-2">
  🔒 Bezpečná platba cez sendeti.sk
</p>
```

---

## KROK 7 — PRODUKT DETAIL /src/app/produkt/[slug]/page.tsx

```typescript
import { getProductBySlug, formatPrice } from '@/lib/feed'
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params
}: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Obrázok */}
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Info */}
      <div>
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
          {product.category}
        </p>
        <h1 className="font-display text-3xl text-gray-900 mb-4">
          {product.name}
        </h1>
        <p className="text-3xl font-bold text-coral mb-2">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice && (
          <p className="text-gray-400 line-through text-lg mb-4">
            {formatPrice(product.originalPrice)}
          </p>
        )}
        
        {/* Stock status */}
        <p className={`text-sm font-semibold mb-6 ${
          product.inStock ? 'text-green-600' : 'text-gray-400'
        }`}>
          {product.inStock ? '✅ Skladom' : '❌ Momentálne nedostupné'}
        </p>
        
        {/* Add to cart */}
        <AddToCartButton product={product} />
        
        {/* Direct buy */}
        <a
          href={product.shopUrl}
          className="block text-center mt-3 text-sm text-gray-500 underline"
        >
          Kúpiť priamo na sendeti.sk →
        </a>
      </div>
    </div>
  )
}
```

---

## KROK 8 — ENVIRONMENT VARIABLES

```bash
# .env.local (lokálne)
FEED_URL=https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml
NEXT_PUBLIC_SHOP_URL=https://shop.sendeti.sk

# Vercel Dashboard → Settings → Environment Variables
# Pridaj rovnaké hodnoty
```

---

## KROK 9 — DEPLOY CHECKLIST

```bash
# 1. Over lokálne
npm run dev
# Otestuj: homepage, kategória, produkt detail, košík

# 2. Build test
npm run build
# Ak build prejde bez chýb → môžeš pushnúť

# 3. Push na GitHub → Vercel auto-deployuje
git add .
git commit -m "feat: real products from feed, fix all buttons"
git push

# 4. Over na Verceli
# vercel.com → projekt → Deployments → pozri logy
# sendeti-frontend.vercel.app → otestuj
```

---

## KROK 10 — AK FEED STÁLE VRACIA 0 PRODUKTOV

```bash
# Skús alternatívny feed
node -e "
const https = require('https');
const urls = [
  'https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml',
  'https://www.sendeti.sk/fotky46145/xml/facebook.xml',
];
urls.forEach(url => {
  https.get(url, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(url, '→ STATUS:', res.statusCode, '| LENGTH:', d.length);
      console.log('SAMPLE:', d.substring(0, 300));
      console.log('---');
    });
  }).on('error', e => console.error(url, 'ERROR:', e.message));
});
"
```

Ak oba feedy vrátia chybu → feed je blokovaný pre externé requesty.
Riešenie: vytvor Next.js API route ako proxy:

```typescript
// /src/app/api/feed/route.ts
export async function GET() {
  const res = await fetch(
    'https://www.sendeti.sk/fotky46145/xml/google_nakupy.xml',
    { 
      headers: { 
        'Referer': 'https://www.sendeti.sk',
        'User-Agent': 'Mozilla/5.0'
      },
      next: { revalidate: 300 }
    }
  )
  const text = await res.text()
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

Potom v feed.ts použi:
```typescript
const FEED_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/feed`
  : 'http://localhost:3000/api/feed'
```

---

## DESIGN PRAVIDLÁ (zachovaj)

```
✅ Warm cream background: #FDF8F3
✅ Warm rose primary: #E8647A  
✅ Amber accent: #F4A535
✅ Font: Lora (headings) + Source Sans 3 (body)
✅ Min font-size: 16px
✅ Min button height: 44px (pre prsty 50+)
✅ Trust badges viditeľné above the fold
✅ Telefónne číslo v headeri vždy
✅ Stock status na každej karte
✅ "Pridať do košíka" — vždy plný text, nie ikona
```

---

## ZÁVER — PORADIE AKCIÍ

1. ✅ `node` diagnostika feedu
2. ✅ Prepíš `feed.ts`
3. ✅ Oprav `next.config.js`
4. ✅ Oprav `page.tsx` (homepage)
5. ✅ Oprav `kategoria/[slug]/page.tsx`
6. ✅ Oprav tlačidlá (ProductCard, CartDrawer)
7. ✅ `npm run build` — over že build prechádza
8. ✅ `git push` — Vercel deployuje automaticky
9. ✅ Over na sendeti-frontend.vercel.app
