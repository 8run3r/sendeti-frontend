"use client";
import { useEffect, useState } from "react";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { RippleButton } from "@/components/ui/RippleButton";
import { useUIStore } from "@/store/uiStore";
import { Gift } from "lucide-react";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { exitIntentShown, setExitIntentShown } = useUIStore();

  useEffect(() => {
    if (exitIntentShown) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setIsOpen(true);
        setExitIntentShown();
        document.removeEventListener("mouseleave", handler);
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handler);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handler);
    };
  }, [exitIntentShown, setExitIntentShown]);

  return (
    <AnimatedModal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-5">
          <Gift size={28} className="text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">
          Počkajte!
        </h2>
        <p className="text-neutral-600 mb-2">
          Ako špeciálny darček dostanete
        </p>
        <div className="text-4xl font-bold text-primary font-display mb-2">10% ZĽAVU</div>
        <p className="text-sm text-neutral-500 mb-6">na váš prvý nákup s kódom:</p>
        <div className="bg-primary-light border-2 border-dashed border-primary rounded-xl py-3 px-6 mb-6">
          <span className="font-mono text-xl font-bold text-primary tracking-widest">SENDETI10</span>
        </div>
        <RippleButton
          onClick={() => setIsOpen(false)}
          className="w-full h-12 bg-primary text-white font-semibold rounded-xl mb-3"
        >
          Použiť zľavu teraz
        </RippleButton>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Nie, ďakujem
        </button>
      </div>
    </AnimatedModal>
  );
}
