"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-5xl",
};

export function AnimatedModal({ isOpen, onClose, children, size = "md" }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ perspective: "1200px" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformOrigin: "top center" }}
            className={cn("relative bg-white rounded-3xl shadow-2xl w-full z-10 overflow-hidden", sizeMap[size])}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-neutral-100 hover:bg-neutral-200 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
