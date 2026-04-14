import { create } from "zustand";
import { persist } from "zustand/middleware"; // Important for keeping session active

interface Address {
  id: string;
  alias: string;
  fullPath: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  payments: PaymentMethod[];
}

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  addAddress: (address: Address) => void;
  addPayment: (payment: PaymentMethod) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      addAddress: (address) => set((state) => ({
        user: state.user ? { ...state.user, addresses: [...state.user.addresses, address] } : null
      })),
      addPayment: (payment) => set((state) => ({
        user: state.user ? { ...state.user, payments: [...state.user.payments, payment] } : null
      }))
    }),
    {
      name: "asombro-identity-storage"
    }
  )
);
