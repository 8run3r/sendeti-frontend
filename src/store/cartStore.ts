import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartProduct {
  id: string
  name: string
  price: number
  image: string
  images?: string[]   // kept for backward compat — full Product is assignable here
  slug: string
  shopUrl: string
  inStock: boolean
}

export interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartStore {
  items: CartItem[]
  // New API
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
  // Backward-compat aliases (used by existing components)
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  clear: () => void
  // Shared
  addItem: (product: CartProduct, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  totalItems: () => number
  totalPrice: () => number
  hasItem: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isDrawerOpen: false,

      addItem: (product, qty = 1) =>
        set(state => {
          const existing = state.items.find(i => i.product.id === product.id)
          const newItems = existing
            ? state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              )
            : [...state.items, { product, quantity: qty }]
          return { items: newItems, isOpen: true, isDrawerOpen: true }
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

      openCart:    () => set({ isOpen: true, isDrawerOpen: true }),
      closeCart:   () => set({ isOpen: false, isDrawerOpen: false }),
      openDrawer:  () => set({ isOpen: true, isDrawerOpen: true }),
      closeDrawer: () => set({ isOpen: false, isDrawerOpen: false }),
      toggleDrawer: () =>
        set(s => ({ isOpen: !s.isOpen, isDrawerOpen: !s.isOpen })),

      clearCart: () => set({ items: [] }),
      clear:     () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      hasItem: id => get().items.some(i => i.product.id === id),
    }),
    { name: 'sendeti-cart-v3' }
  )
)
