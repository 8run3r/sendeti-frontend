"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Package, Users, Award } from "lucide-react";

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ target, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("sk")}{suffix}
    </span>
  );
}

const stats = [
  { icon: Users, label: "Spokojných zákazníkov", value: 2400, suffix: "+" },
  { icon: Package, label: "Produktov v ponuke", value: 4800, suffix: "+" },
  { icon: Star, label: "Rokov na trhu", value: 10, suffix: "+" },
  { icon: Award, label: "Certifikovaných produktov", value: 98, suffix: "%" },
];

export function SocialProofBar() {
  return (
    <section className="py-16 bg-neutral-900">
      <div className="max-w-content mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-2xl mb-4">
                <stat.icon size={22} className="text-primary" />
              </div>
              <div className="font-display text-4xl font-bold text-white mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-neutral-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
