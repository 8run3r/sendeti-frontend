import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/feed'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (product: Product, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  totalItems: () => number
  totalPrice: () => number
  hasItem: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, qty = 1) =>
        set(state => {
          const existing = state.items.find(i => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity: qty }] }
        }),

      removeItem: id =>
        set(state => ({ items: state.items.filter(i => i.product.id !== id) })),

      updateQty: (id, qty) =>
        set(state => ({
          items:
            qty <= 0
              ? state.items.filter(i => i.product.id !== id)
              : state.items.map(i =>
                  i.product.id === id ? { ...i, quantity: qty } : i
                ),
        })),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set(s => ({ isDrawerOpen: !s.isDrawerOpen })),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      hasItem: id => get().items.some(i => i.product.id === id),
    }),
    { name: 'sendeti-cart-v2' }
  )
)
