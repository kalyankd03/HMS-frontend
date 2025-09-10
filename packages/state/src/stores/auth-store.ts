import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Hospital } from '@hms/core';
import { STORAGE_KEYS } from '@hms/core';

// JWT token utilities
function decodeJWT(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Invalid JWT token:', error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

interface AuthState {
  token: string | null;
  user: User | null;
  hospital: Hospital | null;
  isLoading: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setHospital: (hospital: Hospital) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  checkTokenExpiration: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      hospital: null,
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

      setHospital: (hospital: Hospital) => {
        console.info(`Auth: Hospital set - ${hospital.name} (ID: ${hospital.id})`);
        set({ hospital });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      logout: () => {
        console.info('Auth: Logging out');
        set({ token: null, user: null, hospital: null, isLoading: false });
      },

      isAuthenticated: () => {
        const { token, user } = get();
        if (!token || !user) return false;
        
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn('Auth: Token expired, logging out');
          get().logout();
          return false;
        }
        
        return true;
      },

      checkTokenExpiration: () => {
        const { token } = get();
        if (!token) return false;
        
        if (isTokenExpired(token)) {
          console.warn('Auth: Token expired during check, auto-logout');
          get().logout();
          return false;
        }
        
        return true;
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        hospital: state.hospital
      }),
    }
  )
);