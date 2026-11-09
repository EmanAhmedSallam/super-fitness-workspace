export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  age: number;
  goal: string;
  activityLevel: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}
