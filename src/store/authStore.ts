import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '../types';
import * as authApi from '../api/auth';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        const result = await authApi.login(email, password);
        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
          return true;
        }
        set({ error: result.error ?? 'Ошибка входа', isLoading: false });
        return false;
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        const result = await authApi.register(email, password, name);
        if (result.success && result.user) {
          set({ user: result.user, isLoading: false });
          return true;
        }
        set({ error: result.error ?? 'Ошибка регистрации', isLoading: false });
        return false;
      },

      logout: () => set({ user: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'skilltrack_auth' },
  ),
);
