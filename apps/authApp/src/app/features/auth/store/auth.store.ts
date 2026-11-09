import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { extractError } from '../../../core/utils/http-error.util';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
} from '../domain/models/auth-requests.model';
import { MessageResult, SignInResult } from '../domain/models/auth-results.model';
import { User } from '../domain/models/user.model';
import { ChangePasswordUseCase } from '../domain/use-cases/change-password.use-case';
import { ForgotPasswordUseCase } from '../domain/use-cases/forgot-password.use-case';
import { LoadProfileUseCase } from '../domain/use-cases/load-profile.use-case';
import { LogoutUseCase } from '../domain/use-cases/logout.use-case';
import { ResetPasswordUseCase } from '../domain/use-cases/reset-password.use-case';
import { SignInUseCase } from '../domain/use-cases/sign-in.use-case';
import { SignUpUseCase } from '../domain/use-cases/sign-up.use-case';
import { VerifyResetCodeUseCase } from '../domain/use-cases/verify-reset-code.use-case';
import { TokenStorage } from '../domain/token-storage';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly router = inject(Router);
  private readonly signInUseCase = inject(SignInUseCase);
  private readonly signUpUseCase = inject(SignUpUseCase);
  private readonly forgotPasswordUseCase = inject(ForgotPasswordUseCase);
  private readonly verifyResetCodeUseCase = inject(VerifyResetCodeUseCase);
  private readonly resetPasswordUseCase = inject(ResetPasswordUseCase);
  private readonly changePasswordUseCase = inject(ChangePasswordUseCase);
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly tokenStorage = inject(TokenStorage);

  private readonly state$ = new BehaviorSubject<AuthState>(initialState);

  readonly user$ = this.select((state) => state.user);
  readonly isAuthenticated$ = this.select((state) => state.user !== null);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);
  readonly initialized$ = this.select((state) => state.initialized);

  readonly user: WritableSignal<User | null> = signal(null);
  readonly isAuthenticated: Signal<boolean> = computed(() => this.user() !== null);
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string | null> = signal(null);
  readonly initialized: WritableSignal<boolean> = signal(false);

  get currentUser(): User | null {
    return this.state$.value.user;
  }

  setUser(user: User | null): void {
    this.patch({ user, error: null });
  }

  clearSession(): void {
    this.tokenStorage.clear();
    this.reset();
  }

  restoreSession(): Observable<void> {
    if (!this.tokenStorage.has()) {
      this.patch({ user: null, initialized: true });
      return of(void 0);
    }

    return this.loadProfileUseCase.execute().pipe(
      tap((user) => this.patch({ user, initialized: true })),
      map(() => void 0),
      catchError(() => {
        this.tokenStorage.clear();
        this.patch({ user: null, initialized: true });
        return of(void 0);
      }),
    );
  }

  async initSession(): Promise<void> {
    await firstValueFrom(this.restoreSession());
  }

  signIn(request: SignInRequest, remember = false): Observable<SignInResult> {
    this.patch({ loading: true, error: null });

    return this.signInUseCase.execute(request).pipe(
      tap((result) => {
        this.tokenStorage.save(result.token, remember);
        this.patch({ user: result.user, loading: false });
      }),
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
    );
  }

  signUp(request: SignUpRequest): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.signUpUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => this.patch({ loading: false })),
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.forgotPasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => this.patch({ loading: false })),
    );
  }

  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.verifyResetCodeUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => this.patch({ loading: false })),
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.resetPasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => this.patch({ loading: false })),
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.changePasswordUseCase.execute(request).pipe(
      catchError((error: unknown) => {
        const message = extractError(error);
        this.patch({ loading: false, error: message });
        return throwError(() => new Error(message));
      }),
      finalize(() => this.patch({ loading: false })),
    );
  }

  logout(): Observable<MessageResult> {
    this.patch({ loading: true, error: null });

    return this.logoutUseCase.execute().pipe(
      catchError(() => of({ message: 'Logged out' })),
      tap(() => {
        this.clearSession();
        void this.router.navigate(['/auth/login']);
      }),
      map((result) => result),
      finalize(() => this.patch({ loading: false })),
    );
  }

  expireSession(): void {
    this.tokenStorage.clear();
    this.reset();
  }

  clearError(): void {
    this.patch({ error: null });
  }

  private reset(): void {
    this.state$.next({ ...initialState, initialized: true });
    this.syncSignals(this.state$.value);
  }

  private patch(partial: Partial<AuthState>): void {
    const nextState = { ...this.state$.value, ...partial };
    this.state$.next(nextState);
    this.syncSignals(nextState);
  }

  private syncSignals(state: AuthState): void {
    this.user.set(state.user);
    this.loading.set(state.loading);
    this.error.set(state.error);
    this.initialized.set(state.initialized);
  }

  private select<T>(selector: (state: AuthState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }
}
