import Link from 'next/link'

const SHOP_LINKS = [
  ['Bytový textil',   '/kategoria/bytovy-textil'],
  ['Oblečenie',       '/kategoria/oblecenie'],
  ['Hračky',          '/kategoria/hracky'],
  ['Školské potreby', '/kategoria/skolske-potreby'],
  ['Kojenecké',       '/kategoria/kojenecke'],
  ['Všetky produkty', '/kategoria/vsetky'],
] as const

const INFO_LINKS = [
  ['Dodacie podmienky', 'https://shop.sendeti.sk/DODACIE-PODMIENKY-a4_0.htm'],
  ['Obchodné podmienky','https://shop.sendeti.sk/OBCHODNE-PODMIENKY-a3_0.htm'],
  ['GDPR',              'https://shop.sendeti.sk/GDPR-a6_0.htm'],
  ['Kontakty',          'https://shop.sendeti.sk/KONTAKTY-a2_0.htm'],
] as const

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-24">
      {/* Gradient accent line */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg,#C874D9,#F7A072)' }} />

      <div className="max-w-content mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <p className="font-display text-3xl font-bold text-coral mb-3">SEN DETÍ</p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#A09890' }}>
            Starostlivo vyberané detské oblečenie, obliečky a hračky.
            S láskou pre vaše deti od roku 2010.
          </p>
          <div className="flex flex-col gap-1.5">
            <a href="tel:+421905449916" className="text-coral font-bold text-base hover:opacity-80 transition-opacity">
              📞 +421 905 449 916
            </a>
            <a href="mailto:sendeti@centrum.sk" className="text-sm hover:text-coral transition-colors" style={{ color: '#A09890' }}>
              ✉️ sendeti@centrum.sk
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#6B6460' }}>Nakupovanie</p>
          <ul className="space-y-2.5">
            {SHOP_LINKS.map(([name, href]) => (
              <li key={name}>
                <Link href={href} className="text-sm transition-colors hover:text-coral" style={{ color: '#A09890' }}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#6B6460' }}>Informácie</p>
          <ul className="space-y-2.5">
            {INFO_LINKS.map(([name, href]) => (
              <li key={name}>
                <a href={href} className="text-sm transition-colors hover:text-coral" style={{ color: '#A09890' }}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#6B6460' }}>Prečo my</p>
          <ul className="space-y-3">
            {[
              '✅ Overený slovenský predajca',
              '🚚 Doprava od 2,90 €',
              '↩️ Vrátenie do 14 dní',
              '🔒 Bezpečná platba',
              '📦 Doručenie do 3 dní',
            ].map(item => (
              <li key={item} className="text-sm" style={{ color: '#A09890' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-5 text-center text-xs" style={{ borderTop: '1px solid #2C2825', color: '#6B6460' }}>
        © 2026 Sen Detí · Všetky práva vyhradené
      </div>
    </footer>
  )
}
