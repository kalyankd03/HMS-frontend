'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, removeToken, getStoredToken, userProfileToParsedUser } from '@hms/core';
import type { ParsedUser } from '@hms/core';
import { authApi } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<ParsedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsLoggedIn(authenticated);

        if (authenticated) {
          // First try to get user from token
          const tokenUser = getCurrentUser();
          if (tokenUser) {
            setUser(tokenUser);
          }

          // Then fetch fresh user data from API
          const token = getStoredToken();
          if (token) {
            try {
              const profile = await authApi.getProfile(token);
              const hospitalData = await authApi.getHospital(profile.hospital_id, token);
              const enhancedUser = userProfileToParsedUser(profile, hospitalData.name);
              setUser(enhancedUser);
              console.log('User profile refreshed from API:', enhancedUser);
            } catch (error) {
              console.warn('Failed to refresh user profile from API, using token data:', error);
              // Keep the token-based user data if API call fails
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hms_auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    try {
      removeToken();
      setUser(null);
      setIsLoggedIn(false);
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const authenticated = isAuthenticated();
      if (authenticated) {
        const token = getStoredToken();
        if (token) {
          try {
            const profile = await authApi.getProfile(token);
            const hospitalData = await authApi.getHospital(profile.hospital_id, token);
            const enhancedUser = userProfileToParsedUser(profile, hospitalData.name);
            setUser(enhancedUser);
            setIsLoggedIn(true);
            console.log('User profile refreshed:', enhancedUser);
          } catch (error) {
            console.warn('Failed to refresh user profile, falling back to token data:', error);
            const currentUser = getCurrentUser();
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('User refresh failed:', error);
      logout();
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn,
    logout,
    refreshUser,
  };
}
