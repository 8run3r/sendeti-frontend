import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartProduct {
  id: string
  name: string
  price: number
  image: string
  slug: string
  shopUrl: string
  inStock: boolean
}

interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: CartProduct) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) =>
        set((state) => {
          const exists = state.items.find(i => i.product.id === product.id)
          if (exists) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { product, quantity: 1 }],
            isOpen: true,
          }
        }),

      removeItem: (id) =>
        set(s => ({ items: s.items.filter(i => i.product.id !== id) })),

      updateQty: (id, qty) =>
        set(s => ({
          items: qty <= 0
            ? s.items.filter(i => i.product.id !== id)
            : s.items.map(i => i.product.id === id ? { ...i, quantity: qty } : i),
        })),

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    }),
    { name: 'sendeti-cart-v3' }
  )
)
