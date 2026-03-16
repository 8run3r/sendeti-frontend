import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, qty?: number, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  hasItem: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (product, qty = 1, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
        );
        if (existing) {
          set({ items: items.map((i) => i === existing ? { ...i, quantity: i.quantity + qty } : i) });
        } else {
          set({ items: [...items, { product, quantity: qty, selectedSize: size, selectedColor: color }] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQty: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        set({ items: get().items.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i) });
      },
      clear: () => set({ items: [] }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      hasItem: (productId) => get().items.some((i) => i.product.id === productId),
    }),
    { name: "sendeti-cart" }
  )
);
