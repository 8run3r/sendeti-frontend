export const SITE_CONTENT = {
  shopName: 'SEN DETÍ',
  tagline: 'všetko pre úsmev a radosť detí',
  phone: '+421 905 449 916',
  email: 'sendeti@centrum.sk',
  website: 'www.sendeti.sk',

  hero: {
    badge: 'Overený slovenský e-shop pre mamičky',
    headline: 'Sen detí',
    subheadline: 'všetko pre úsmev a radosť detí',
    description:
      'Obliečky, oblečenie, hračky a školské potreby — všetko bezpečné a s láskou vybrané pre vaše deti.',
    cta1: 'Nakupovať teraz',
    cta2: 'Bytový textil',
    trustItems: [
      { icon: '🚚', text: 'Doprava od 2,90 €' },
      { icon: '↩️', text: 'Vrátenie do 14 dní' },
      { icon: '✅', text: 'Overený predajca' },
      { icon: '📞', text: '+421 905 449 916' },
    ],
    stats: [
      { value: 4800, suffix: '+', label: 'produktov v ponuke' },
      { value: 2400, suffix: '+', label: 'spokojných rodičov' },
      { value: 98, suffix: '%', label: 'certifikovaných produktov' },
    ],
  },

  categories: [
    {
      name: 'Bytový textil',
      slug: 'bytovy-textil',
      emoji: '🛏️',
      description:
        'Široký výber kvalitného bytového textilu pre deti za dobrú cenu. Obliečky, plachty, osušky, pončá, vankúšiky, deky.',
      subcategories: [
        { name: 'Obliečky', shopUrl: 'https://shop.sendeti.sk/obliecky-pre-deti-detske-obliecky' },
        { name: 'Plachty', shopUrl: 'https://shop.sendeti.sk/plachty-pre-deti-detske-plachty' },
        { name: 'Deky', shopUrl: 'https://shop.sendeti.sk/deky-detske-deky-deky-pre-deti' },
        { name: 'Vankúšiky', shopUrl: 'https://shop.sendeti.sk/vankusiky-detske-vankuse-vankusiky-pre-deti' },
        { name: 'Župany', shopUrl: 'https://shop.sendeti.sk/zupany-detske-zupany-zupany-pre-deti' },
        { name: 'Uteráky', shopUrl: 'https://shop.sendeti.sk/uteraky-detske-uteraky-uteraky-pre-deti-uteraciky' },
        { name: 'Osušky', shopUrl: 'https://shop.sendeti.sk/osusky-osusky-pre-deti-detske-osusky-plazove-osusky' },
        { name: 'Pončá', shopUrl: 'https://shop.sendeti.sk/ponca-detske-ponca-ponca-pre-deti-osuska-s-kapucnou' },
        { name: 'Spacie vaky', shopUrl: 'https://shop.sendeti.sk/spacie-vaky-a-prehozy-detske-prehozy-prehoz-na-postel' },
      ],
    },
    {
      name: 'Oblečenie',
      slug: 'oblecenie',
      emoji: '👕',
      description:
        'Hľadáte pekné a kvalitné oblečenie pre deti? Veselé kúsky s rozprávkovými motívmi — tričká, pyžamá, mikiny a ďalšie.',
      subcategories: [
        { name: 'Tričká', shopUrl: 'https://shop.sendeti.sk/tricka-detske-tricka-tricka-pre-deti' },
        { name: 'Pyžamá', shopUrl: 'https://shop.sendeti.sk/pyzama-pyzama-pre-deti-detske-pyzamo' },
        { name: 'Mikiny & Bundy', shopUrl: 'https://shop.sendeti.sk/mikiny-vesty-bundy-bundy-a-mikiny-pre-deti' },
        { name: 'Legíny & Tepláky', shopUrl: 'https://shop.sendeti.sk/leginy-teplaky-kratase-leginy-pre-deti-detske-teplaky' },
        { name: 'Šaty & Sukne', shopUrl: 'https://shop.sendeti.sk/sukne-saty-supravy-pre-deti-detske-teplakove-supravy' },
        { name: 'Plavky', shopUrl: 'https://shop.sendeti.sk/plavky-detske-plavky-plavky-pre-deti' },
        { name: 'Obuv', shopUrl: 'https://shop.sendeti.sk/obuv-pre-deti-detska-obuv-detske-tenisky-detske-slapky' },
        { name: 'Dojčatá', shopUrl: 'https://shop.sendeti.sk/dojcata' },
        { name: 'Čiapky', shopUrl: 'https://shop.sendeti.sk/ciapky-siltovky-nakrcniky-pre-deti-detske-ciapky' },
      ],
    },
    {
      name: 'Hračky',
      slug: 'hracky',
      emoji: '🧸',
      description:
        'Puzzle, kreatívne sady, detské vysielačky a mnoho ďalšieho. Hračky pre deti všetkých vekových kategórií.',
      subcategories: [
        { name: 'Hračky mix', shopUrl: 'https://shop.sendeti.sk/hracky-detske-hrycky-hry-pre-deti' },
        { name: 'Boxy na hračky', shopUrl: 'https://shop.sendeti.sk/boxy-na-hracky' },
        { name: 'Puzzle', shopUrl: 'https://shop.sendeti.sk/hracky-detske-hrycky-hry-pre-deti' },
        { name: 'Plyšové hračky', shopUrl: 'https://shop.sendeti.sk/hracky-detske-hrycky-hry-pre-deti' },
      ],
    },
    {
      name: 'Školské potreby',
      slug: 'skolske-potreby',
      emoji: '🎒',
      description:
        'Školské potreby, školské pomôcky a školské tašky v rôznych dizajnoch. Všetko čo školák potrebuje.',
      subcategories: [
        { name: 'Školské tašky', shopUrl: 'https://shop.sendeti.sk/skolske-tasky' },
        { name: 'Ruksaky', shopUrl: 'https://shop.sendeti.sk/ruksaky-a-skolske-tasky-detske-skolske-batohy' },
        { name: 'Peračníky', shopUrl: 'https://shop.sendeti.sk/peracniky-plnene-peracniky-detske-peracniky' },
        { name: 'Papiernictvo', shopUrl: 'https://shop.sendeti.sk/papiernictvo-detske-omalovanky-sady-na-pisanie-a-kreslenie' },
        { name: 'Nálepky', shopUrl: 'https://shop.sendeti.sk/nalepky-detske-nalepky' },
        { name: 'Vrecká na prezúvky', shopUrl: 'https://shop.sendeti.sk/vrecka-na-prezuvky-skolske-vrecka-pre-deti' },
      ],
    },
    {
      name: 'Kojenecké',
      slug: 'kojenecke',
      emoji: '👶',
      description: 'Všetko pre najmenších — oblečenie, obliečky a hračky pre bábätká.',
      subcategories: [
        { name: 'Kojenecký sortiment', shopUrl: 'https://shop.sendeti.sk/kojenecky' },
      ],
    },
    {
      name: 'Kuchyňa',
      slug: 'kuchyna',
      emoji: '🍽️',
      description: 'Poháre, hrnčeky, taniere, fľaše a desiatové boxy pre deti. Farebné a odolné.',
      subcategories: [
        { name: 'Poháre & Hrnčeky', shopUrl: 'https://shop.sendeti.sk/pohare-hrnceky-detske-pohariky-hrnceky-pre-deti' },
        { name: 'Taniere & Sety', shopUrl: 'https://shop.sendeti.sk/taniere-sety-detske-jedalenske-supravy' },
        { name: 'Fľaše', shopUrl: 'https://shop.sendeti.sk/flase-detske-flase-flasky-pre-deti' },
        { name: 'Príbory', shopUrl: 'https://shop.sendeti.sk/pribory-pribor-pre-deti-detsky-pribor' },
        { name: 'Desiatové boxy', shopUrl: 'https://shop.sendeti.sk/desiatove-boxy-krabicky-na-desiatu-pre-deti' },
        { name: 'Zástery', shopUrl: 'https://shop.sendeti.sk/zastery-kuchynske-zastery-pre-det-detske-zasterky' },
      ],
    },
    {
      name: 'Party & Darčeky',
      slug: 'party',
      emoji: '🎉',
      description: 'Tortové zápichy, party sety, balóny, kostýmy a sviečky na každú oslavu.',
      subcategories: [
        { name: 'Tortové zápichy', shopUrl: 'https://shop.sendeti.sk/tortove-zapichy-zapichy-na-tortu' },
        { name: 'Party sety', shopUrl: 'https://shop.sendeti.sk/party-sety' },
        { name: 'Balóny', shopUrl: 'https://shop.sendeti.sk/BALONY-c7_63_2.htm' },
        { name: 'Kostýmy', shopUrl: 'https://shop.sendeti.sk/KOSTYMY-c7_50_2.htm' },
        { name: 'Sviečky', shopUrl: 'https://shop.sendeti.sk/SVIECKY-c7_59_2.htm' },
      ],
    },
    {
      name: 'Doplnky',
      slug: 'doplnky',
      emoji: '✨',
      description: 'Tašky, kabelky, hodinky, lampy a ďalšie doplnky pre deti.',
      subcategories: [
        { name: 'Tašky & Kabelky', shopUrl: 'https://shop.sendeti.sk/tasky-a-kabelky' },
        { name: 'Hodiny & Hodinky', shopUrl: 'https://shop.sendeti.sk/hodiny-a-hodinky-pre-deti' },
        { name: 'Do vlasov', shopUrl: 'https://shop.sendeti.sk/do-vlasov' },
        { name: 'Lampy', shopUrl: 'https://shop.sendeti.sk/lampy-lampicky-svietidla-pre-deti' },
      ],
    },
  ],

  footer: {
    tagline: 'všetko pre úsmev a radosť detí',
    about: 'Rodinný slovenský e-shop s láskou vyberanými produktmi pre vaše deti.',
    links: [
      { name: 'Dodacie podmienky', url: 'https://shop.sendeti.sk/DODACIE-PODMIENKY-a4_0.htm' },
      { name: 'Obchodné podmienky', url: 'https://shop.sendeti.sk/OBCHODNE-PODMIENKY-a3_0.htm' },
      { name: 'GDPR', url: 'https://shop.sendeti.sk/GDPR-a6_0.htm' },
      { name: 'Kontakty', url: 'https://shop.sendeti.sk/KONTAKTY-a2_0.htm' },
      { name: 'Blog', url: 'https://shop.sendeti.sk/blog' },
    ],
  },
}
