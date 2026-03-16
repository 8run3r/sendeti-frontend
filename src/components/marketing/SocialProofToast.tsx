"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { products } from "@/data/products";
import { ShoppingBag } from "lucide-react";

const names = ["Martina", "Jana", "Peter", "Lucia", "Tomáš", "Eva", "Richard", "Zuzana", "Michal", "Katarína", "Andrej", "Mária"];

function getRandomItem() {
  const name = names[Math.floor(Math.random() * names.length)];
  const surname = ["S.", "K.", "H.", "M.", "B.", "L."][Math.floor(Math.random() * 6)];
  const product = products[Math.floor(Math.random() * products.length)];
  const minutesAgo = Math.floor(Math.random() * 30) + 1;
  return { name: `${name} ${surname}`, product, minutesAgo };
}

export function SocialProofToast() {
  const [notification, setNotification] = useState<ReturnType<typeof getRandomItem> | null>(null);

  useEffect(() => {
    const show = () => {
      setNotification(getRandomItem());
      setTimeout(() => setNotification(null), 5000);
    };

    // First show after 30s
    const firstTimer = setTimeout(show, 30000);
    // Then every 60-120s
    const intervalId = setInterval(() => {
      show();
    }, 60000 + Math.random() * 60000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.9 }}
            className="bg-white shadow-xl rounded-2xl p-3 flex items-center gap-3 max-w-xs"
          >
            <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
              <Image
                src={notification.product.images[0]}
                alt={notification.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <ShoppingBag size={12} className="text-accent-green" />
                <span className="text-xs font-semibold text-accent-green">Práve kúpené</span>
              </div>
              <p className="text-xs font-semibold text-neutral-900 line-clamp-1">{notification.product.name}</p>
              <p className="text-xs text-neutral-500">{notification.name} · pred {notification.minutesAgo} min</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
