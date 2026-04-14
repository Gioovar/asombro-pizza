import { create } from "zustand";
import { Pizza } from "../data/pizzas";

export interface CartItem extends Pizza {
  quantity: number;
}

interface PromoState {
  id: string;
  code: string;
  discount: number;
  type: string; // 'PERCENTAGE' | 'FLAT' | 'COMBO' | 'TWO_FOR_ONE'
}

interface CartStore {
  isCartOpen: boolean;
  toggleCart: () => void;
  items: CartItem[];
  appliedPromo: PromoState | null;
  addItem: (product: any, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  getTotalPrice: () => number;
  applyPromo: (promo: PromoState | null) => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  items: [],
  appliedPromo: null,
  
  addItem: (product, quantity = 1) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
       return { items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) };
    }
    return { items: [...state.items, { ...product, quantity }] };
  }),
  
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  
  applyPromo: (promo) => set({ appliedPromo: promo }),

  getTotalPrice: () => {
    const { items, appliedPromo } = get();
    let total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (appliedPromo) {
       if (appliedPromo.type === "PERCENTAGE") {
          total = total - (total * (appliedPromo.discount / 100));
       } else if (appliedPromo.type === "FLAT") {
          total = Math.max(0, total - appliedPromo.discount);
       }
    }
    
    return Number(total.toFixed(2));
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
