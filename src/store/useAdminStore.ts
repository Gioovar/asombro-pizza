import { create } from "zustand";

interface AdminStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  isStoreOpen: boolean;
  toggleStoreOpen: () => void;

  urgentOrdersCount: number;
  setUrgentOrdersCount: (count: number) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  isStoreOpen: true,
  toggleStoreOpen: () => set((state) => ({ isStoreOpen: !state.isStoreOpen })),

  urgentOrdersCount: 0,
  setUrgentOrdersCount: (count) => set({ urgentOrdersCount: count }),
}));
