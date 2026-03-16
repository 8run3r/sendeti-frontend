"use client";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  duration?: number;
  children: React.ReactNode;
}

export function RippleButton({ children, color = "rgba(255,255,255,0.3)", duration = 600, className, onClick, ...rest }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      transform: scale(0);
      animation: ripple ${duration}ms ease-out forwards;
      pointer-events: none;
    `;
    buttonRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), duration);
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
