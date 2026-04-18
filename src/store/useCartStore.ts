import { create } from "zustand";
import { MenuItem } from "../data/menuData";

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: Record<string, any>;
  cartItemId: string; // Unique ID for this specific combination
}

interface PromoState {
  id: string;
  code: string;
  discount: number;
  type: string;
}

interface CartStore {
  isCartOpen: boolean;
  toggleCart: () => void;
  items: CartItem[];
  appliedPromo: PromoState | null;
  addItem: (product: MenuItem, quantity?: number, options?: Record<string, any>, finalPrice?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  getTotalPrice: () => number;
  applyPromo: (promo: PromoState | null) => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  items: [],
  appliedPromo: null,
  
  addItem: (product, quantity = 1, options = {}, finalPrice) => set((state) => {
    const cartItemId = `${product.id}-${JSON.stringify(options)}`;
    const existing = state.items.find(i => i.cartItemId === cartItemId);
    if (existing) {
      return { items: state.items.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i) };
    }
    const newItem: CartItem = {
      ...product,
      price: finalPrice ?? product.price,
      quantity,
      selectedOptions: options,
      cartItemId,
    };
    return { items: [...state.items, newItem] };
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
