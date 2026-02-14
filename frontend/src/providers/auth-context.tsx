import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clear } from 'chip-cookies';
import { get, initializeSecurity } from '@/lib/api-client';
import { env } from '@/lib/env';
import type { User } from '@/types/auth';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  clearCookies: () => Promise<void>;
}

const AUTH_ME_KEY = ['auth', 'me'] as const;

const AuthContext = createContext<AuthState | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: () => get<User>('/v1/auth/me', { authenticated: true }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const migrated = useRef(false);

  useEffect(() => {
    if (!migrated.current) {
      migrated.current = true;
      initializeSecurity();
    }
  }, []);

  const clearCookies = useCallback(async () => {
    await clear(env.API_URL);
    queryClient.setQueryData(AUTH_ME_KEY, null);
  }, [queryClient]);

  const user = meQuery.data ?? null;

  const value = useMemo<AuthState>(
    () => ({
      isLoading: meQuery.isLoading,
      isAuthenticated: user !== null,
      user,
      clearCookies,
    }),
    [meQuery.isLoading, user, clearCookies]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
