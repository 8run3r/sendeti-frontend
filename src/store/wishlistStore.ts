import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggle: (id: string) => void;
  hasItem: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => {
        const items = get().items;
        set({ items: items.includes(id) ? items.filter((i) => i !== id) : [...items, id] });
      },
      hasItem: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: "sendeti-wishlist" }
  )
);
