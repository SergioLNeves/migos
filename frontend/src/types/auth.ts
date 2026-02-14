interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: { field: string; message: string }[] | null;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface CreateAccountInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateProfileInput {
  name?: string;
  avatar?: string;
}

interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

interface ReactivateAccountInput {
  email: string;
  password: string;
}

export type {
  User,
  ProblemDetails,
  AuthResponse,
  LoginInput,
  CreateAccountInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ReactivateAccountInput,
};
