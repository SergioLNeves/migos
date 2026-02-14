import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post, patch, del } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-context';
import type {
  AuthResponse,
  LoginInput,
  CreateAccountInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ReactivateAccountInput,
} from '@/types/auth';

const AUTH_ME_KEY = ['auth', 'me'] as const;

function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      post<AuthResponse>('/v1/auth/login', {
        body: { email: input.email, password: input.password },
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: AUTH_ME_KEY });
    },
  });
}

function useCreateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAccountInput) =>
      post<AuthResponse>('/v1/user/create-account', {
        body: { name: input.name, email: input.email, password: input.password },
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: AUTH_ME_KEY });
    },
  });
}

function useLogoutMutation() {
  const { clearCookies } = useAuth();

  return useMutation({
    mutationFn: () => post<void>('/v1/auth/logout', { authenticated: true }),
    onSuccess: async () => {
      await clearCookies();
    },
    onError: async () => {
      await clearCookies();
    },
  });
}

function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      const body: Record<string, string> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.avatar !== undefined) body.avatar = input.avatar;
      return patch<AuthResponse>('/v1/user/profile', { body, authenticated: true });
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: AUTH_ME_KEY });
    },
  });
}

function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      patch<AuthResponse>('/v1/user/password', {
        body: { current_password: input.current_password, new_password: input.new_password },
        authenticated: true,
      }),
  });
}

function useDeleteAccountMutation() {
  const { clearCookies } = useAuth();

  return useMutation({
    mutationFn: () => del<void>('/v1/user/account', { authenticated: true }),
    onSuccess: async () => {
      await clearCookies();
    },
  });
}

function useReactivateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReactivateAccountInput) =>
      post<AuthResponse>('/v1/user/reactivate', {
        body: { email: input.email, password: input.password },
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: AUTH_ME_KEY });
    },
  });
}

export {
  useLoginMutation,
  useCreateAccountMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useReactivateAccountMutation,
};
