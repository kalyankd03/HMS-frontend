import { getStoredToken, userProfileToParsedUser, isTokenExpired, removeToken } from '@hms/core';
import type { ParsedUser } from '@hms/core';
import { authApi } from '@/lib/api';
import { saveUserToStorage, clearUserFromStorage } from './auth-storage';

/**
 * Fetch fresh user data from API and cache it
 */
export const fetchAndCacheUserData = async (): Promise<ParsedUser | null> => {
  try {
    const token = getStoredToken();
    if (!token) {
      console.warn('No auth token found');
      return null;
    }

    // Check if token is expired before making API calls
    if (isTokenExpired(token)) {
      console.warn('Token expired, clearing auth data');
      handleTokenExpiry();
      return null;
    }

    console.log('Fetching fresh user data from API...');
    
    // First get the user profile
    const profile = await authApi.getProfile(token);
    
    // Then get hospital data using the profile's hospital_id
    const hospitalInfo = await authApi.getHospital(profile.hospital_id, token);
    
    const enhancedUser = userProfileToParsedUser(profile, hospitalInfo.name);
    
    // Cache the user data
    saveUserToStorage(enhancedUser);
    
    console.log('User data fetched and cached successfully:', enhancedUser);
    return enhancedUser;
  } catch (error) {
    console.error('Failed to fetch user data from API:', error);
    
    // Check if error is due to token expiry/invalidity
    if (isAuthError(error)) {
      console.warn('Authentication error detected, clearing auth data');
      handleTokenExpiry();
      return null;
    }
    
    return null;
  }
};

/**
 * Handle token expiry by clearing all auth data
 */
export const handleTokenExpiry = (): void => {
  removeToken();
  clearUserFromStorage();
  
  // Trigger logout in the next tick to allow cleanup
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, 0);
};

/**
 * Check if an error is authentication-related
 */
export const isAuthError = (error: unknown): boolean => {
  const err = error as { isAuthError?: boolean; status?: number; message?: string };
  
  // Check for enhanced error with auth flag from HTTP client
  if (err?.isAuthError) {
    return true;
  }
  
  // Check for common auth error patterns
  return (
    err?.status === 401 ||
    err?.status === 403 ||
    err?.message?.toLowerCase().includes('unauthorized') === true ||
    err?.message?.toLowerCase().includes('forbidden') === true ||
    err?.message?.toLowerCase().includes('token') === true ||
    err?.message?.toLowerCase().includes('authentication') === true
  );
};

/**
 * Validate if the current token is still valid by making a lightweight API call
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    const token = getStoredToken();
    if (!token) return false;

    // Check if token is expired first
    if (isTokenExpired(token)) {
      handleTokenExpiry();
      return false;
    }

    // Make a lightweight API call to validate token
    await authApi.getProfile(token);
    return true;
  } catch (error) {
    console.warn('Token validation failed:', error);
    
    // Handle auth errors
    if (isAuthError(error)) {
      handleTokenExpiry();
    }
    
    return false;
  }
};
