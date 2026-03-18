import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-content mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-bold text-white block mb-2">SEN DETÍ</span>
            <p className="text-sm text-neutral-400 mb-2">všetko pre úsmev a radosť detí</p>
            <p className="text-sm text-neutral-400 mb-6">Rodinný e-shop so srdcom 💙</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-neutral-400 mb-4">Nakupovanie</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="/kategoria/vsetky" className="hover:text-white transition-colors">Všetky produkty</Link></li>
              <li><Link href="/kategoria/bytovy-textil" className="hover:text-white transition-colors">Bytový textil</Link></li>
              <li><Link href="/kategoria/oblecenie" className="hover:text-white transition-colors">Oblečenie</Link></li>
              <li><Link href="/kategoria/hracky" className="hover:text-white transition-colors">Hračky</Link></li>
              <li><Link href="/kategoria/skolske-potreby" className="hover:text-white transition-colors">Školské potreby</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-neutral-400 mb-4">Pomoc a info</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="https://shop.sendeti.sk/DODACIE-PODMIENKY-a4_0.htm"  className="hover:text-white transition-colors">Dodacie podmienky</a></li>
              <li><a href="https://shop.sendeti.sk/OBCHODNE-PODMIENKY-a3_0.htm"  className="hover:text-white transition-colors">Obchodné podmienky</a></li>
              <li><a href="https://shop.sendeti.sk/GDPR-a6_0.htm"  className="hover:text-white transition-colors">GDPR</a></li>
              <li><a href="https://shop.sendeti.sk/KONTAKTY-a2_0.htm"  className="hover:text-white transition-colors">Kontakty</a></li>
              <li><a href="https://shop.sendeti.sk/blog"  className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-neutral-400 mb-4">Kontakt</h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary flex-shrink-0" /><a href="tel:+421905449916" className="hover:text-white transition-colors">+421 905 449 916</a></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary flex-shrink-0" /><a href="mailto:sendeti@centrum.sk" className="hover:text-white transition-colors">sendeti@centrum.sk</a></li>
              <li className="flex items-center gap-2"><Clock size={14} className="text-primary flex-shrink-0" /> Po–Pia: 9:00–17:00</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-content mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">© 2026 Sen Detí. Všetky práva vyhradené.</p>
          <div className="flex items-center gap-3 text-neutral-400 text-xs">
            <span className="border border-neutral-600 px-2 py-0.5 rounded">VISA</span>
            <span className="border border-neutral-600 px-2 py-0.5 rounded">MC</span>
            <span className="border border-neutral-600 px-2 py-0.5 rounded">PayPal</span>
            <span className="border border-neutral-600 px-2 py-0.5 rounded">GoPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
