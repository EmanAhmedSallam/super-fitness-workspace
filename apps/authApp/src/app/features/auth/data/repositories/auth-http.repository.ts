import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url.token';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
} from '../../domain/models/auth-requests.model';
import { MessageResult, SignInResult } from '../../domain/models/auth-results.model';
import { User } from '../../domain/models/user.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  MessageResponseDto,
  ProfileResponseDto,
  ResetPasswordRequestDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  VerifyResetCodeRequestDto,
} from '../dto/auth.dto';
import { mapUserDtoToDomain } from '../mappers/auth.mapper';

@Injectable({ providedIn: 'root' })
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${inject(API_BASE_URL)}/auth`;

  signIn(request: SignInRequest): Observable<SignInResult> {
    const payload: SignInRequestDto = {
      email: request.email,
      password: request.password,
    };

    return this.http
      .post<SignInResponseDto>(`${this.apiUrl}/signin`, payload)
      .pipe(
        map((response) => ({
          token: response.token,
          user: mapUserDtoToDomain(response.user),
        }))
      );
  }

  signUp(request: SignUpRequest): Observable<MessageResult> {
    const payload: SignUpRequestDto = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: request.password,
      gender: request.gender,
      height: request.height,
      weight: request.weight,
      age: request.age,
      goal: request.goal,
      activityLevel: request.activityLevel,
    };

    return this.http
      .post<MessageResponseDto>(`${this.apiUrl}/signup`, payload)
      .pipe(map((response) => ({ message: response.message })));
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResult> {
    const payload: ForgotPasswordRequestDto = { email: request.email };

    return this.http
      .post<MessageResponseDto>(`${this.apiUrl}/forgotPassword`, payload)
      .pipe(map((response) => ({ message: response.message })));
  }

  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResult> {
    const payload: VerifyResetCodeRequestDto = {
      email: request.email,
      resetCode: request.resetCode,
    };

    return this.http
      .post<MessageResponseDto>(`${this.apiUrl}/verifyResetCode`, payload)
      .pipe(map((response) => ({ message: response.message })));
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResult> {
    const payload: ResetPasswordRequestDto = {
      email: request.email,
      newPassword: request.newPassword,
    };

    return this.http
      .put<MessageResponseDto>(`${this.apiUrl}/resetPassword`, payload)
      .pipe(map((response) => ({ message: response.message })));
  }

  changePassword(request: ChangePasswordRequest): Observable<MessageResult> {
    const payload: ChangePasswordRequestDto = {
      password: request.password,
      newPassword: request.newPassword,
    };

    return this.http
      .patch<MessageResponseDto>(`${this.apiUrl}/change-password`, payload)
      .pipe(map((response) => ({ message: response.message })));
  }

  loadProfile(): Observable<User> {
    return this.http
      .get<ProfileResponseDto>(`${this.apiUrl}/profile-data`)
      .pipe(map((response) => mapUserDtoToDomain(response.user)));
  }

  logout(): Observable<MessageResult> {
    return this.http
      .get<MessageResponseDto>(`${this.apiUrl}/logout`)
      .pipe(map((response) => ({ message: response.message })));
  }
}
