import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  selectedColor?: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, selectedColor?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedColor?: string) => void;
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
          const colorKey = newItem.selectedColor || '';
          const existingItem = state.items.find(
            (item) => item.id === newItem.id && (item.selectedColor || '') === colorKey
          );
          const quantityToAdd = newItem.quantity || 1;
          
          if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantityToAdd, existingItem.stock);
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && (item.selectedColor || '') === colorKey
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...newItem, quantity: Math.min(quantityToAdd, newItem.stock) }],
          };
        });
      },
      
      removeItem: (id, selectedColor) => {
        set((state) => ({
          items: selectedColor
            ? state.items.filter((item) => !(item.id === id && (item.selectedColor || '') === selectedColor))
            : state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity, selectedColor) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id && (item.selectedColor || '') === (selectedColor || '')) {
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
      name: 'libreria-bia-cart',
    }
  )
);
