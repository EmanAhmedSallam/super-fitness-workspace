export type Gender = 'male' | 'female';

export type ActivityLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  password: string;
  rePassword: string;
  goal: string;
  height: number;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: Gender;
  photo?: string;
  goal?: string;
  activityLevel?: ActivityLevel;
  weight?: number;
}

export interface ProfileResponse {
  message: string;
  user: AuthenticatedUser;
}

export type UpdateMetricRequest =
  | { goal: string }
  | { activityLevel: ActivityLevel }
  | { weight: number };

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthenticatedUser;
}

export type SignupResponse = AuthResponse;

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  message?: string;
  status?: string;
  token?: string;
}

export interface AuthErrorBody {
  error?: string;
  message?: string;
}

export const PASSWORD_PATTERN =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export function parseAuthError(body: AuthErrorBody | null | undefined): string[] {
  const raw = body?.error ?? body?.message;
  if (!raw) return [];

  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
