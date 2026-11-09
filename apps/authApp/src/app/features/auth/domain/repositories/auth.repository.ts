import { Observable } from 'rxjs';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
} from '../models/auth-requests.model';
import { MessageResult, SignInResult } from '../models/auth-results.model';
import { User } from '../models/user.model';

export abstract class AuthRepository {
  abstract signIn(request: SignInRequest): Observable<SignInResult>;
  abstract signUp(request: SignUpRequest): Observable<MessageResult>;
  abstract forgotPassword(request: ForgotPasswordRequest): Observable<MessageResult>;
  abstract verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResult>;
  abstract resetPassword(request: ResetPasswordRequest): Observable<MessageResult>;
  abstract changePassword(request: ChangePasswordRequest): Observable<MessageResult>;
  abstract loadProfile(): Observable<User>;
  abstract logout(): Observable<MessageResult>;
}
