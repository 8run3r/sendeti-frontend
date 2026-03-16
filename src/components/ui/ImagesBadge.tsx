"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface AvatarImage { src: string; alt: string; }

interface Props {
  images: AvatarImage[];
  maxVisible?: number;
  size?: number;
  label?: string;
  badgeText?: string;
}

export function ImagesBadge({ images, maxVisible = 5, size = 36, label, badgeText }: Props) {
  const visible = images.slice(0, maxVisible);
  const overflow = images.length - maxVisible;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" style={{ paddingLeft: size * 0.3 }}>
        {visible.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.15, zIndex: 10 }}
            className="relative rounded-full border-2 border-white overflow-hidden cursor-pointer"
            style={{
              width: size,
              height: size,
              marginLeft: -(size * 0.3),
              zIndex: i,
            }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </motion.div>
        ))}
        {overflow > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: maxVisible * 0.05 }}
            className="relative rounded-full border-2 border-white bg-primary flex items-center justify-center text-white font-bold"
            style={{ width: size, height: size, marginLeft: -(size * 0.3), zIndex: maxVisible, fontSize: size * 0.33 }}
          >
            +{overflow}
          </motion.div>
        )}
      </div>
      {(label || badgeText) && (
        <div className="flex items-center gap-1 text-sm text-neutral-600">
          {badgeText && <span className="font-semibold text-neutral-900">{badgeText}</span>}
          {label && <span>{label}</span>}
        </div>
      )}
    </div>
  );
}
