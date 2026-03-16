"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  { author: "Martina S.", text: "Obliečky sú úžasne mäkké, moje dieťa spí ako anjel. Určite budem nakupovať znova!", rating: 5, avatar: "https://picsum.photos/seed/t1/60/60", product: "Detská obliečka Hviezdičky" },
  { author: "Peter K.", text: "Rýchle dodanie, krásne zabalené. Plyšák bol pre synčeka ako darček na narodeniny, bol nadšený!", rating: 5, avatar: "https://picsum.photos/seed/t2/60/60", product: "Plyšový medveď Bonifác" },
  { author: "Jana H.", text: "Skvelý e-shop pre deti! Veľký výber, výborné ceny a profesionálny prístup.", rating: 5, avatar: "https://picsum.photos/seed/t3/60/60", product: "LEGO DUPLO Farma" },
  { author: "Lucia M.", text: "Šaty na dcérke vyzerajú rozkošne. Materiál je kvalitný a ľahko sa udržiava.", rating: 4, avatar: "https://picsum.photos/seed/t4/60/60", product: "Dievčenské šaty Kvetinky" },
  { author: "Michal R.", text: "Batoh pre prváčika je výborný - priestranný, ľahký a dieťaťu sa páči motív.", rating: 5, avatar: "https://picsum.photos/seed/t5/60/60", product: "Školský batoh Vesmír" },
  { author: "Zuzana P.", text: "Darčekový set pre novorodenca bol perfektný. Všetko certifikované a bezpečné.", rating: 5, avatar: "https://picsum.photos/seed/t6/60/60", product: "Darčekový set Prvý krok" },
  { author: "Tomáš B.", text: "Trampolína je výborná, synček sa na nej hrá hodiny. Montáž bola jednoduchá.", rating: 4, avatar: "https://picsum.photos/seed/t7/60/60", product: "Trampolína záhradná" },
  { author: "Eva L.", text: "Stan Indiáni je krása! Dcérka v ňom hrá každý deň a chce tam aj spať.", rating: 5, avatar: "https://picsum.photos/seed/t8/60/60", product: "Stan detský Indiáni" },
  { author: "Richard N.", text: "Drevená kuchynka prekonala všetky naše očakávania. Kvalita na úrovni!", rating: 5, avatar: "https://picsum.photos/seed/t9/60/60", product: "Drevená kuchynka" },
  { author: "Katarína V.", text: "Spací vak je presne ako opisujú - teplý, mäkký a bábätko v ňom skvele spí.", rating: 5, avatar: "https://picsum.photos/seed/t10/60/60", product: "Spací vak Hviezdy" },
];

const row1 = testimonials.slice(0, 5);
const row2 = testimonials.slice(5, 10);

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mx-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={testimonial.avatar} alt={testimonial.author} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{testimonial.author}</p>
          <p className="text-xs text-neutral-500">{testimonial.product}</p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={12} className="fill-accent-warm text-accent-warm" />
          ))}
        </div>
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <section className="py-20 bg-neutral-50 overflow-hidden">
      <div className="max-w-content mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Čo hovoria rodičia
          </h2>
          <p className="text-lg text-neutral-600">Viac ako 2400 spokojných zákazníkov nám dôveruje</p>
        </motion.div>
      </div>

      {/* Row 1 - left */}
      <div className="relative mb-4 group">
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 - right */}
      <div className="relative group">
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
