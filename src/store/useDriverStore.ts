import { create } from "zustand";

interface DriverStore {
  isOnline: boolean;
  toggleOnline: () => void;
  
  driverId: string | null;
  setDriverId: (id: string) => void;

  incomingOrder: any | null;
  setIncomingOrder: (order: any | null) => void;
  
  activeOrder: any | null;
  setActiveOrder: (order: any | null) => void;
  
  showIncomingModal: boolean;
  setShowIncomingModal: (show: boolean) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  isOnline: false,
  toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
  
  driverId: null, // Set during login
  setDriverId: (id) => set({ driverId: id }),

  incomingOrder: null,
  setIncomingOrder: (order) => set({ incomingOrder: order }),

  activeOrder: null,
  setActiveOrder: (order) => set({ activeOrder: order }),

  showIncomingModal: false,
  setShowIncomingModal: (show) => set({ showIncomingModal: show })
}));
