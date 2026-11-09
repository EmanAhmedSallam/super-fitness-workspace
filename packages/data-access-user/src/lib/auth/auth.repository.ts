import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiClient } from '../api/api-client';
import {
  AuthErrorBody,
  AuthResponse,
  AuthenticatedUser,
  ForgotPasswordRequest,
  PasswordResetResponse,
  ProfileResponse,
  ResetPasswordRequest,
  SigninRequest,
  SignupRequest,
  VerifyResetCodeRequest,
  UpdateMetricRequest,
  parseAuthError,
} from './auth.models';

export class AuthRequestError extends Error {
  constructor(
    readonly messages: string[],
    readonly status: number
  ) {
    super(messages[0] ?? 'Something went wrong. Please try again.');
    this.name = 'AuthRequestError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthRepository extends ApiClient<AuthenticatedUser> {
  protected readonly endpoint = 'auth';

  loadProfile(): Observable<ProfileResponse> {
    return this.withAuthErrors(
      this.http.get<ProfileResponse>(`${this.resourceUrl}/profile-data`)
    );
  }

  updateMetric(payload: UpdateMetricRequest): Observable<ProfileResponse> {
    return this.withAuthErrors(
      this.http.put<ProfileResponse>(`${this.resourceUrl}/editProfile`, payload)
    );
  }

  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.post$('signup', payload);
  }

  signin(payload: SigninRequest): Observable<AuthResponse> {
    return this.post$('signin', payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<PasswordResetResponse> {
    return this.withAuthErrors(
      this.http.post<PasswordResetResponse>(`${this.resourceUrl}/forgotPassword`, payload)
    );
  }

  verifyResetCode(payload: VerifyResetCodeRequest): Observable<PasswordResetResponse> {
    return this.withAuthErrors(
      this.http.post<PasswordResetResponse>(`${this.resourceUrl}/verifyResetCode`, payload)
    );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<PasswordResetResponse> {
    return this.withAuthErrors(
      this.http.put<PasswordResetResponse>(`${this.resourceUrl}/resetPassword`, payload)
    );
  }

  private post$(
    action: 'signup' | 'signin',
    payload: SignupRequest | SigninRequest
  ): Observable<AuthResponse> {
    return this.withAuthErrors(
      this.http.post<AuthResponse>(`${this.resourceUrl}/${action}`, payload)
    );
  }

  private withAuthErrors<T>(request: Observable<T>): Observable<T> {
    return request.pipe(catchError((error) => throwError(() => this.toAuthError(error))));
  }

  private toAuthError(error: unknown): AuthRequestError {
    if (!(error instanceof HttpErrorResponse)) {
      return new AuthRequestError(['Unexpected error. Please try again.'], 0);
    }

    const messages = parseAuthError(error.error as AuthErrorBody);

    if (messages.length && error.status >= 500) {
      return new AuthRequestError(
        ['Something went wrong on our side. Please try again later.'],
        error.status
      );
    }

    if (messages.length) {
      return new AuthRequestError(messages, error.status);
    }

    return new AuthRequestError(
      [
        error.status === 0
          ? 'Cannot reach the server. Check your connection.'
          : `Request failed (${error.status}). Please try again.`,
      ],
      error.status
    );
  }
}
