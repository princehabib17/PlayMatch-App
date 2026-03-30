import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect } from 'react';
import { useAuthModal, useAuthStore, authKey } from './store';


/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { isOpen, close, open } = useAuthModal();

  const initiate = useCallback(() => {
    SecureStore.getItemAsync(authKey)
      .then((storedAuth) => {
        let parsedAuth = null;
        if (storedAuth) {
          try {
            parsedAuth = JSON.parse(storedAuth);
          } catch (parseError) {
            console.warn('Failed to parse stored auth:', parseError);
          }
        }
        useAuthStore.setState({
          auth: parsedAuth,
          isReady: true,
        });
      })
      .catch((error) => {
        // If SecureStore fails, still mark as ready so app can load
        console.warn('Auth initialization error:', error);
        useAuthStore.setState({
          auth: null,
          isReady: true,
        });
      });
  }, []);

  const signIn = useCallback(() => {
    open({ mode: 'signin' });
  }, [open]);
  const signUp = useCallback(() => {
    open({ mode: 'signup' });
  }, [open]);

  const signOut = useCallback(() => {
    setAuth(null);
    close();
  }, [close]);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    auth,
    setAuth,
    initiate,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();
  const { open } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      open({ mode: options?.mode });
    }
  }, [isAuthenticated, open, options?.mode, isReady]);
};

export default useAuth;