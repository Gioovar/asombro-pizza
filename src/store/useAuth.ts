import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
          set({ user: null, token: null });
          if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-storage');
          }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
