"use client";
import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

interface Props {
  children: React.ReactNode;
  intensity?: number;
  radius?: number;
  className?: string;
}

export function ScalesEffect({ children, intensity = 0.5, radius = 200, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition();

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, i) => (
        <ScaleChild key={i} mousePos={mousePos} containerRef={containerRef} intensity={intensity} radius={radius}>
          {child}
        </ScaleChild>
      ))}
    </div>
  );
}

function ScaleChild({
  children, mousePos, containerRef, intensity, radius,
}: {
  children: React.ReactNode;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  intensity: number;
  radius: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);
    const maxScale = 1 + intensity * 0.4;
    const newScale = dist < radius
      ? maxScale - ((maxScale - 1) * dist) / radius
      : 1;
    setScale(newScale);
  }, [mousePos, intensity, radius]);

  const springScale = useSpring(scale, { stiffness: 200, damping: 20 });

  return (
    <motion.div ref={ref} style={{ scale: springScale }}>
      {children}
    </motion.div>
  );
}
