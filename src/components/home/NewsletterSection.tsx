"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RippleButton } from "@/components/ui/RippleButton";
import { Mail, Check } from "lucide-react";

const orbitItems = [
  { src: "https://picsum.photos/seed/orb1/80/80", delay: 0 },
  { src: "https://picsum.photos/seed/orb2/80/80", delay: 2 },
  { src: "https://picsum.photos/seed/orb3/80/80", delay: 4 },
  { src: "https://picsum.photos/seed/orb4/80/80", delay: 6 },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-content mx-auto px-4">
        <div className="bg-primary-light rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left content */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Mail size={14} />
                  Newsletter
                </div>
                <h2 className="font-display text-4xl font-bold text-neutral-900 mb-4">
                  Nenechajte si ujsť
                  <br />
                  žiadnu novinku
                </h2>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Prihláste sa na odber noviniek a ako prvý sa dozviete o nových produktoch,
                  špeciálnych akciách a exkluzívnych zľavách len pre našich odberateľov.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Exkluzívne zľavy 10% na prvý nákup", "Novinky ako prví", "Tipy na darčeky pre deti"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                      <Check size={16} className="text-accent-green flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.sk"
                      className="flex-1 h-12 px-5 bg-white rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                    <RippleButton
                      type="submit"
                      className="h-12 px-6 bg-primary text-white font-semibold rounded-xl text-sm whitespace-nowrap hover:bg-primary-dark transition-colors"
                    >
                      Prihlásiť sa
                    </RippleButton>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-accent-green/10 text-accent-green font-semibold px-5 py-3 rounded-xl"
                  >
                    <Check size={20} />
                    Ďakujeme! Prihlásenie prebehlo úspešne.
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right — orbiting products */}
            <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 min-h-80">
              <div className="relative w-48 h-48">
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-md">
                    <span className="font-display text-white font-bold text-xs text-center leading-tight px-2">SEN DETÍ</span>
                  </div>
                </div>

                {/* Orbit ring */}
                <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full" style={{ width: 200, height: 200, top: -26, left: -26 }} />

                {/* Orbiting items */}
                {orbitItems.map((item, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      width: 56,
                      height: 56,
                      top: "50%",
                      left: "50%",
                      marginTop: -28,
                      marginLeft: -28,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, delay: -item.delay, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, delay: -item.delay, repeat: Infinity, ease: "linear" }}
                      style={{ translateX: 100 }}
                      className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md"
                    >
                      <Image src={item.src} alt="" fill className="object-cover" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
