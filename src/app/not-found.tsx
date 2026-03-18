import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-bold mb-4" style={{ color: 'rgba(247,160,114,0.2)' }}>
          404
        </p>
        <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#1C1917' }}>
          Stránka nenájdená
        </h2>
        <p className="mb-8 font-sans" style={{ color: '#78716C' }}>
          Produkt alebo stránka ktorú hľadáte už neexistuje alebo bola presunutá.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/"
                className="px-6 py-3 text-white rounded-xl font-semibold font-sans transition-colors"
                style={{ background: '#F7A072' }}>
            Ísť domov
          </Link>
          <Link href="/kategoria/vsetky"
                className="px-6 py-3 rounded-xl font-semibold font-sans transition-all border-2"
                style={{ borderColor: '#F7A072', color: '#F7A072' }}>
            Všetky produkty
          </Link>
        </div>
      </div>
    </div>
  )
}
