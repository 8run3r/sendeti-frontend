"use client";
import { AppleCardCarousel } from "@/components/ui/AppleCardCarousel";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { motion } from "framer-motion";

const collections = [
  {
    id: "col-1",
    category: "Bytový textil",
    title: "Snový spánok pre deti",
    src: "https://picsum.photos/seed/col1/800/600",
    categoryId: "bytovy-textil",
  },
  {
    id: "col-2",
    category: "Hračky",
    title: "Hry plné dobrodružstiev",
    src: "https://picsum.photos/seed/col2/800/600",
    categoryId: "hracky",
  },
  {
    id: "col-3",
    category: "Oblečenie",
    title: "Módny štýl pre najmenších",
    src: "https://picsum.photos/seed/col3/800/600",
    categoryId: "oblecenie",
  },
  {
    id: "col-4",
    category: "Kojenecké",
    title: "Všetko pre novorodenca",
    src: "https://picsum.photos/seed/col4/800/600",
    categoryId: "kojenecke",
  },
  {
    id: "col-5",
    category: "Party & Darčeky",
    title: "Darčeky plné radosti",
    src: "https://picsum.photos/seed/col5/800/600",
    categoryId: "party",
  },
];

function CollectionContent({ categoryId }: { categoryId: string }) {
  const catProducts = products.filter((p) => p.category === categoryId).slice(0, 4);
  return (
    <div>
      <p className="text-neutral-600 mb-6">Objavte náš výber prémiových produktov z tejto kolekcie.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {catProducts.map((p) => (
          <Link key={p.id} href={`/produkt/${p.slug}`} className="group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-2">
              <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-sm font-medium text-neutral-900 line-clamp-2 mb-1">{p.name}</p>
            <p className="text-sm font-bold text-primary font-mono-price">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CollectionsCarousel() {
  const cards = collections.map((col) => ({
    ...col,
    content: <CollectionContent categoryId={col.categoryId} />,
  }));

  return (
    <section className="py-20 bg-neutral-50 overflow-hidden">
      <div className="max-w-content mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              Naše kolekcie
            </h2>
            <p className="text-lg text-neutral-600">Ťahajte doprava pre viac →</p>
          </div>
        </motion.div>
      </div>
      <AppleCardCarousel cards={cards} />
    </section>
  );
}
