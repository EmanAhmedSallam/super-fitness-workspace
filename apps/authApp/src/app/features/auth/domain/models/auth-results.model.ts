import { User } from './user.model';

export interface MessageResult {
  message: string;
}

export interface SignInResult {
  token: string;
  user: User;
}
