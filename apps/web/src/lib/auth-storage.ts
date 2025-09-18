import type { ParsedUser } from '@hms/core';

// localStorage keys
const USER_DATA_KEY = 'hms_user_data';
const LAST_REFRESH_KEY = 'hms_last_refresh';

// Configuration
export const AUTH_CONFIG = {
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
} as const;

/**
 * Get user data from localStorage
 */
export const getUserFromStorage = (): ParsedUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Failed to parse user data from localStorage:', error);
    return null;
  }
};

/**
 * Save user data to localStorage with timestamp
 */
export const saveUserToStorage = (user: ParsedUser): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    localStorage.setItem(LAST_REFRESH_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

/**
 * Get the last refresh timestamp
 */
export const getLastRefreshTime = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
    return lastRefresh ? parseInt(lastRefresh, 10) : 0;
  } catch (error) {
    console.warn('Failed to get last refresh time:', error);
    return 0;
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(LAST_REFRESH_KEY);
  } catch (error) {
    console.error('Failed to clear user data from localStorage:', error);
  }
};

/**
 * Check if cached user data needs refresh
 */
export const needsRefresh = (cachedUser: ParsedUser | null): boolean => {
  if (!cachedUser) return true;
  
  const lastRefresh = getLastRefreshTime();
  return (Date.now() - lastRefresh) > AUTH_CONFIG.REFRESH_INTERVAL;
};

/**
 * Check if user data exists and is fresh
 */
export const hasFreshUserData = (): boolean => {
  const cachedUser = getUserFromStorage();
  return cachedUser !== null && !needsRefresh(cachedUser);
};
