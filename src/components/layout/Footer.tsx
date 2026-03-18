export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-20">
      <div className="h-1 bg-gradient-to-r from-coral to-purple" />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-2xl font-bold text-coral mb-2">SEN DETÍ</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Starostlivo vyberané detské oblečenie, obliečky a hračky.
            S láskou pre vaše deti.
          </p>
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">
            Informácie
          </p>
          <div className="space-y-2">
            {([
              ['Dodacie podmienky', 'https://shop.sendeti.sk/DODACIE-PODMIENKY-a4_0.htm'],
              ['Obchodné podmienky', 'https://shop.sendeti.sk/OBCHODNE-PODMIENKY-a3_0.htm'],
              ['GDPR', 'https://shop.sendeti.sk/GDPR-a6_0.htm'],
              ['Kontakty', 'https://shop.sendeti.sk/KONTAKTY-a2_0.htm'],
            ] as [string, string][]).map(([name, url]) => (
              <a key={name} href={url}
                 className="block text-gray-400 text-sm hover:text-coral transition-colors">
                {name}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">
            Kontakt
          </p>
          <div className="space-y-2">
            <a href="tel:+421905449916"
               className="block text-coral font-bold text-lg hover:opacity-80">
              +421 905 449 916
            </a>
            <a href="mailto:sendeti@centrum.sk"
               className="block text-gray-400 text-sm hover:text-coral">
              sendeti@centrum.sk
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center">
        <p className="text-gray-600 text-xs">
          © 2026 Sen Detí
        </p>
      </div>
    </footer>
  )
}
