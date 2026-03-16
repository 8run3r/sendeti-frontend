"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface Card {
  id: string;
  category: string;
  title: string;
  src: string;
  content: React.ReactNode;
}

interface Props {
  cards: Card[];
}

export function AppleCardCarousel({ cards }: Props) {
  const [selected, setSelected] = useState<Card | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden">
      <motion.div ref={constraintsRef} className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          className="flex gap-4 cursor-grab active:cursor-grabbing px-4 md:px-8"
          style={{ width: "max-content" }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layoutId={`card-${card.id}`}
              onClick={() => setSelected(card)}
              className="relative flex-shrink-0 w-64 md:w-80 h-96 rounded-3xl overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Image src={card.src} alt={card.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">{card.category}</p>
                <h3 className="font-display text-xl font-bold leading-tight">{card.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              layoutId={`card-${selected.id}`}
              className="fixed inset-4 md:inset-12 z-50 bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-64 md:h-80 flex-shrink-0">
                <Image src={selected.src} alt={selected.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">{selected.category}</p>
                  <h2 className="font-display text-3xl font-bold">{selected.title}</h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto p-6 md:p-8" style={{ maxHeight: "calc(100% - 320px)" }}>
                {selected.content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
