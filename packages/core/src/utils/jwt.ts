import { STORAGE_KEYS, ROLE_NAMES } from '../constants';
import type { UserProfile } from '../types';
import { decode } from 'js-base64';


// JWT Payload structure based on backend implementation
export interface JWTPayload {
  sub: string; // Subject (user_id as string)
  email: string;
  name: string;
  role_id: number;
  hospital_id: number;
  iat: number; // Issued at
  exp: number; // Expires at
  iss: string; // Issuer
  aud: string; // Audience
}

export interface ParsedUser {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  hospital_id: number;
  hospital_name?: string;
}

export interface EnhancedUser extends ParsedUser {
  hospital_name: string;
}

/**
 * Cross-platform base64 decode function
 */

function base64Decode(str: string): string {
  return decode(str);
}

/**
 * Decode JWT token without verification (client-side parsing only)
 * Note: This should NOT be used for security validation
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64url to JSON
    const decodedPayload = base64Decode(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Check if JWT token will expire within a given time buffer (in milliseconds)
 */
export function isTokenExpiringSoon(token: string, bufferMs: number = 5 * 60 * 1000): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < (Date.now() + bufferMs);
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
}

/**
 * Get user information from JWT token
 */
export function getUserFromToken(token: string): ParsedUser | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  try {
    return {
      user_id: parseInt(payload.sub, 10),
      name: payload.name,
      email: payload.email,
      role_id: payload.role_id,
      role_name: ROLE_NAMES[payload.role_id] || 'Unknown',
      hospital_id: payload.hospital_id,
    };
  } catch (error) {
    console.error('Error parsing user from token:', error);
    return null;
  }
}

/**
 * Cross-platform storage interface
 */
interface CrossPlatformStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

/**
 * Get platform-appropriate storage
 */
function getStorage(): CrossPlatformStorage | null {
  // Web environment
  if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
    const window = (globalThis as any).window;
    if (window && typeof window.localStorage !== 'undefined') {
      return window.localStorage;
    }
  }
  
  // React Native environment - AsyncStorage should be injected if needed
  // For now, return null to indicate no storage available
  return null;
}

/**
 * Get stored auth token from platform storage
 */
export function getStoredToken(): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const result = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    // Handle both sync and async storage
    return typeof result === 'string' ? result : null;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
}

/**
 * Store auth token in platform storage
 */
export function storeToken(token: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

/**
 * Remove auth token from platform storage
 */
export function removeToken(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Also try session storage on web
    if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
      const window = (globalThis as any).window;
      if (window && typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

/**
 * Get current authenticated user from stored token
 */
export function getCurrentUser(): ParsedUser | null {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    removeToken(); // Clean up expired token
    return null;
  }

  return getUserFromToken(token);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getStoredToken();
  return token !== null && !isTokenExpired(token);
}

/**
 * Convert UserProfile from API to ParsedUser format
 */
export function userProfileToParsedUser(profile: UserProfile, hospitalName?: string): ParsedUser {
  return {
    user_id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`,
    email: profile.email,
    role_id: profile.role_id,
    role_name: ROLE_NAMES[profile.role_id] || 'Unknown',
    hospital_id: profile.hospital_id,
    hospital_name: hospitalName,
  };
}
