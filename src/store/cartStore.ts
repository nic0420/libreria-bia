import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          const quantityToAdd = newItem.quantity || 1;
          
          if (existingItem) {
            // Update quantity, maxing out at stock
            const newQuantity = Math.min(existingItem.quantity + quantityToAdd, existingItem.stock);
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          }
          
          // Add new item
          return {
            items: [...state.items, { ...newItem, quantity: Math.min(quantityToAdd, newItem.stock) }],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) };
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'libreria-bia-cart', // name of the item in the storage (must be unique)
    }
  )
);
