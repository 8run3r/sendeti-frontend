"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RippleButton } from "@/components/ui/RippleButton";
import { Clock } from "lucide-react";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function PromoBanner() {
  const saleEnd = new Date(Date.now() + 18 * 3600000 + 42 * 60000 + 15000);
  const { hours, minutes, seconds } = useCountdown(saleEnd);

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-content mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Blue promo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-64"
            style={{ background: "linear-gradient(135deg, #4A90D9 0%, #2C6BAD 100%)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="relative z-10">
              <span className="text-sm font-semibold text-blue-200 uppercase tracking-widest mb-3 block">Špeciálna ponuka</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                Doprava zadarmo
                <br />
                nad 35 €
              </h3>
              <p className="text-blue-100 mb-6">Pri každej objednávke nad 35 € máte dopravu zadarmo. Bez akýchkoľvek podmienok.</p>
              <Link href="/kategoria/hracky">
                <RippleButton
                  color="rgba(255,255,255,0.2)"
                  className="h-12 px-6 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors"
                >
                  Nakupovať teraz →
                </RippleButton>
              </Link>
            </div>
          </motion.div>

          {/* Pink promo with countdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-64"
            style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FF3D7F 100%)" }}
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
            <div className="relative z-10">
              <span className="text-sm font-semibold text-pink-200 uppercase tracking-widest mb-3 block">Časovo obmedzená ponuka</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                Výpredaj -30%
                <br />
                na oblečenie
              </h3>
              <p className="text-pink-100 mb-5">Akcia platí len obmedzený čas. Nepremeškajte to!</p>

              {/* Countdown */}
              <div className="flex items-center gap-3 mb-6">
                <Clock size={16} className="text-pink-200" />
                <div className="flex gap-2">
                  {[
                    { val: hours, label: "hod" },
                    { val: minutes, label: "min" },
                    { val: seconds, label: "sek" },
                  ].map((unit, i) => (
                    <div key={i} className="text-center">
                      <div className="bg-white/20 rounded-lg px-3 py-1 min-w-[44px]">
                        <span className="font-mono text-xl font-bold text-white">
                          {String(unit.val).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] text-pink-200 mt-1 block">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/kategoria/oblecenie">
                <RippleButton
                  color="rgba(255,255,255,0.2)"
                  className="h-12 px-6 bg-white text-accent font-semibold rounded-xl text-sm hover:bg-pink-50 transition-colors"
                >
                  Zobraziť výpredaj →
                </RippleButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
