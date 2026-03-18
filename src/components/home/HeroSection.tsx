"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { RippleButton } from "@/components/ui/RippleButton";
import { ImagesBadge } from "@/components/ui/ImagesBadge";
import { ShoppingBag, Star, Truck, Shield } from "lucide-react";
import type { FeedProduct } from "@/lib/feed";
import { formatFeedPrice } from "@/lib/feed";

const fallbackCards = [
  { name: "Plyšový medveď", price: "19,90 €", image: "https://picsum.photos/seed/hero1/200/200", delay: 0 },
  { name: "Dino stavebnica", price: "34,90 €", image: "https://picsum.photos/seed/hero2/200/200", delay: 1.2 },
  { name: "Vesmírny batoh", price: "44,90 €", image: "https://picsum.photos/seed/hero3/200/200", delay: 0.6 },
];

const trustItems = [
  { icon: Truck, text: "Doprava od 2,90 €" },
  { icon: Shield, text: "Certifikované produkty" },
  { icon: Star, text: "Overený predajca" },
  { icon: ShoppingBag, text: "Vrátenie do 14 dní" },
];

interface HeroSectionProps {
  heroProducts?: FeedProduct[];
}

export function HeroSection({ heroProducts }: HeroSectionProps) {
  const delays = [0, 1.2, 0.6];
  const floatingCards =
    heroProducts && heroProducts.length > 0
      ? heroProducts.slice(0, 3).map((p, i) => ({
          name: p.name.slice(0, 24),
          price: formatFeedPrice(p.price),
          image: p.image,
          delay: delays[i] ?? 0,
          href: `/produkt/${p.slug}`,
        }))
      : fallbackCards.map((c) => ({ ...c, href: "/kategoria/vsetky" }));

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Diagonal split */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-primary-light clip-diagonal hidden lg:block" />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block"
        style={{
          background: "linear-gradient(135deg, #EBF4FF 0%, #f0f7ff 100%)",
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)"
        }}
      />

      <div className="relative max-w-content mx-auto px-4 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Overený slovenský e-shop pre mamičky
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6"
            >
              Sen{" "}
              <span className="text-primary">detí</span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-normal italic text-neutral-600">
                všetko pre úsmev
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-neutral-600 mb-8 max-w-md leading-relaxed"
            >
              Obliečky, oblečenie, hračky a školské potreby — všetko bezpečné a s láskou vybrané pre vaše deti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link href="/kategoria/hracky">
                <RippleButton className="h-14 px-8 bg-primary text-white font-semibold rounded-2xl text-base hover:bg-primary-dark transition-colors">
                  Objavovať teraz
                </RippleButton>
              </Link>
              <Link href="/kategoria/bytovy-textil">
                <RippleButton
                  color="rgba(74,144,217,0.15)"
                  className="h-14 px-8 bg-white border-2 border-primary text-primary font-semibold rounded-2xl text-base hover:bg-primary-light transition-colors"
                >
                  Bytový textil
                </RippleButton>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ImagesBadge
                images={[
                  { src: "https://picsum.photos/seed/av1/100/100", alt: "Zákazník 1" },
                  { src: "https://picsum.photos/seed/av2/100/100", alt: "Zákazník 2" },
                  { src: "https://picsum.photos/seed/av3/100/100", alt: "Zákazník 3" },
                  { src: "https://picsum.photos/seed/av4/100/100", alt: "Zákazník 4" },
                  { src: "https://picsum.photos/seed/av5/100/100", alt: "Zákazník 5" },
                ]}
                badgeText="4 800+"
                label="produktov v ponuke"
              />
            </motion.div>
          </div>

          {/* Right — floating product cards */}
          <div className="relative h-[500px] hidden lg:block">
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4 + card.delay, duration: 0.6, type: "spring" }}
                style={{
                  position: "absolute",
                  top: i === 0 ? "5%" : i === 1 ? "40%" : "65%",
                  left: i === 0 ? "20%" : i === 1 ? "55%" : "5%",
                  animation: `float ${3 + i * 0.5}s ease-in-out ${card.delay}s infinite`,
                }}
                className="bg-white rounded-2xl shadow-lg p-3 w-44 cursor-pointer hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Link href={card.href}>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 bg-neutral-100">
                    <Image src={card.image} alt={card.name} fill className="object-cover" sizes="176px" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-900 leading-tight mb-1">{card.name}</p>
                  <p className="text-sm font-bold font-mono-price text-primary">{card.price}</p>
                </Link>
              </motion.div>
            ))}

            {/* Decorative circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-primary/20 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 py-3">
        <div className="max-w-content mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 items-center">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 text-white"
              >
                <item.icon size={16} className="text-primary" />
                <span className="text-xs font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
