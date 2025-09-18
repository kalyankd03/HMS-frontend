'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { isAuthenticated, removeToken, getStoredToken, isTokenExpired, getTokenExpirationTime } from '@hms/core';
import type { ParsedUser } from '@hms/core';
import { 
  getUserFromStorage, 
  clearUserFromStorage, 
  needsRefresh, 
  hasFreshUserData,
  AUTH_CONFIG,
  fetchAndCacheUserData,
  handleTokenExpiry
} from '@/lib/auth';

interface AuthContextType {
  user: ParsedUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ParsedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadUser = async () => {
    try {
      const token = getStoredToken();
      
      // Check token expiry first
      if (token && isTokenExpired(token)) {
        console.log('Token expired, performing automatic logout');
        handleTokenExpiry();
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        setUser(null);
        clearUserFromStorage();
        setIsLoading(false);
        return;
      }

      // Check if we have fresh cached data
      if (hasFreshUserData()) {
        const cachedUser = getUserFromStorage();
        console.log('Using fresh cached user data:', cachedUser);
        setUser(cachedUser);
        setIsLoading(false);
        return;
      }

      // Try to get cached data to show while fetching
      const cachedUser = getUserFromStorage();
      if (cachedUser) {
        console.log('Showing cached data while refreshing...');
        setUser(cachedUser);
        setIsLoading(false);
      }

      // Fetch fresh data
      const freshUser = await fetchAndCacheUserData();
      if (freshUser) {
        setUser(freshUser);
      } else if (!cachedUser) {
        // No cached data and failed to fetch - logout
        console.error('Failed to load user data, logging out');
        setUser(null);
        setIsLoggedIn(false);
        clearUserFromStorage();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsLoggedIn(false);
      clearUserFromStorage();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Set up periodic refresh and token expiry checking
    const refreshInterval = setInterval(() => {
      const token = getStoredToken();
      
      // Check token expiry first
      if (token && isTokenExpired(token)) {
        console.log('Token expired during periodic check, logging out');
        handleTokenExpiry();
        setUser(null);
        setIsLoggedIn(false);
        return;
      }
      
      if (isAuthenticated()) {
        const cachedUser = getUserFromStorage();
        if (cachedUser && needsRefresh(cachedUser)) {
          console.log('Periodic refresh triggered...');
          loadUser();
        }
      }
    }, AUTH_CONFIG.REFRESH_INTERVAL);

    // Set up token expiry timer
    let expiryTimeout: NodeJS.Timeout | null = null;
    const token = getStoredToken();
    
    if (token) {
      const expirationTime = getTokenExpirationTime(token);
      if (expirationTime) {
        const timeUntilExpiry = expirationTime - Date.now();
        
        if (timeUntilExpiry > 0) {
          console.log(`Token will expire in ${Math.floor(timeUntilExpiry / 60000)} minutes`);
          expiryTimeout = setTimeout(() => {
            console.log('Token expired, performing automatic logout');
            handleTokenExpiry();
            setUser(null);
            setIsLoggedIn(false);
          }, timeUntilExpiry);
        }
      }
    }

    // Listen for storage changes (login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hms_auth_token') {
        console.log('Auth token changed in another tab');
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(refreshInterval);
      if (expiryTimeout) {
        clearTimeout(expiryTimeout);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = useCallback(() => {
    try {
      removeToken();
      clearUserFromStorage();
      setUser(null);
      setIsLoggedIn(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (isAuthenticated()) {
      console.log('Manual user refresh requested...');
      const freshUser = await fetchAndCacheUserData();
      if (freshUser) {
        setUser(freshUser);
      }
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    isLoggedIn,
    logout,
    refreshUser,
  }), [user, isLoading, isLoggedIn, logout, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
