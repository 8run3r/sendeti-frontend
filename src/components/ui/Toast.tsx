"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastItem { id: number; message: string; }

let toastId = 0;
const listeners: ((toast: ToastItem) => void)[] = [];

export function showToast(message: string) {
  const toast = { id: ++toastId, message };
  listeners.forEach((l) => l(toast));
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 2500);
    };
    listeners.push(handler);
    return () => { const i = listeners.indexOf(handler); if (i > -1) listeners.splice(i, 1); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className="bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[220px]"
          >
            <CheckCircle2 size={18} className="text-accent-green flex-shrink-0" />
            <span className="text-sm font-medium text-neutral-900">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
