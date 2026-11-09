import { UserDto } from './user.dto';

export interface SignInRequestDto {
  email: string;
  password: string;
}

export interface SignUpRequestDto {
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

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface VerifyResetCodeRequestDto {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequestDto {
  password: string;
  newPassword: string;
}

export interface MessageResponseDto {
  message: string;
}

export interface SignInResponseDto {
  message: string;
  token: string;
  user: UserDto;
}

export interface ProfileResponseDto {
  message: string;
  user: UserDto;
}
