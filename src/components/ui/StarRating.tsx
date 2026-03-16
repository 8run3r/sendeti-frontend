import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? "fill-accent-warm text-accent-warm" : "fill-neutral-200 text-neutral-200"}
        />
      ))}
      {count !== undefined && <span className="text-xs text-neutral-600 ml-1">({count})</span>}
    </div>
  );
}
