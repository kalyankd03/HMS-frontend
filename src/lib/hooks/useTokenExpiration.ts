import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

/**
 * Hook to automatically check for token expiration and logout when expired
 * Checks every 30 seconds while the user is active
 */
export function useTokenExpiration() {
  const router = useRouter();
  const { checkTokenExpiration, token } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Only run if we have a token
    if (!token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    console.info('Auth: Starting token expiration monitoring');

    // Check immediately
    const isValid = checkTokenExpiration();
    if (!isValid) {
      console.warn('Auth: Token already expired, redirecting to login');
      router.push('/');
      return;
    }

    // Set up periodic checks every 30 seconds
    intervalRef.current = setInterval(() => {
      const isStillValid = checkTokenExpiration();
      if (!isStillValid) {
        console.warn('Auth: Token expired, redirecting to login');
        router.push('/');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
      }
    }, 30000); // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        console.info('Auth: Stopping token expiration monitoring');
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [token, checkTokenExpiration, router]);

  // Also check on window focus (user came back to the app)
  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        console.info('Auth: Window focused, checking token expiration');
        const isValid = checkTokenExpiration();
        if (!isValid) {
          console.warn('Auth: Token expired on focus, redirecting to login');
          router.push('/');
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token, checkTokenExpiration, router]);
}
