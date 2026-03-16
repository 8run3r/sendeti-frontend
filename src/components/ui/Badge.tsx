import { cn } from "@/lib/utils";

const badgeConfig = {
  sale: { label: "SALE", className: "bg-accent text-white" },
  new: { label: "NOVÉ", className: "bg-primary text-white" },
  popular: { label: "HIT", className: "bg-accent-warm text-white" },
  bestseller: { label: "BESTSELLER", className: "bg-neutral-900 text-white" },
};

export function ProductBadge({ type }: { type: keyof typeof badgeConfig }) {
  const { label, className } = badgeConfig[type];
  return <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", className)}>{label}</span>;
}
