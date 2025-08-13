import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, STORAGE_KEYS } from './types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      isLoading: false,

      // Actions
      setToken: (token: string) => {
        console.info('Auth: Token set');
        set({ token });
      },

      setUser: (user: User) => {
        console.info(`Auth: User set - ${user.name} (${user.email})`);
        set({ user });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      logout: () => {
        console.info('Auth: Logging out');
        set({ token: null, user: null, isLoading: false });
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return Boolean(token && user);
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
);
