import { create } from 'zustand';

interface AuthGuardStore {
  isOpen: boolean;
  intentMessage: string;
  pendingAction: (() => void) | null;
  openModal: (pendingAction?: () => void, message?: string) => void;
  closeModal: () => void;
  executePending: () => void;
}

export const useAuthGuardStore = create<AuthGuardStore>((set, get) => ({
  isOpen: false,
  intentMessage: '',
  pendingAction: null,
  openModal: (pendingAction, message = '') =>
    set({ isOpen: true, pendingAction: pendingAction ?? null, intentMessage: message }),
  closeModal: () => set({ isOpen: false, pendingAction: null, intentMessage: '' }),
  executePending: () => {
    const { pendingAction } = get();
    if (pendingAction) pendingAction();
    set({ isOpen: false, pendingAction: null, intentMessage: '' });
  },
}));
