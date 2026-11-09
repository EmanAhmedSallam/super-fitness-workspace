import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  ActivityLevel,
  AuthRepository,
  AuthRequestError,
  AuthResponse,
  AuthSession,
  AuthenticatedUser,
  Gender,
  SigninRequest,
  SignupRequest,
} from '@super-fitness/data-access-user';

export function toSignupRequest(model: Record<string, unknown>): SignupRequest {
  return {
    firstName: String(model['firstName'] ?? '').trim(),
    lastName: String(model['lastName'] ?? '').trim(),
    email: String(model['email'] ?? '').trim(),
    gender: model['gender'] as Gender,
    password: String(model['password'] ?? ''),
    rePassword: String(model['rePassword'] ?? ''),
    goal: String(model['goal'] ?? ''),
    height: Number(model['height']),
    weight: Number(model['weight']),
    age: Number(model['age']),
    activityLevel: model['activityLevel'] as ActivityLevel,
  };
}

export function toSigninRequest(model: Record<string, unknown>): SigninRequest {
  return {
    email: String(model['email'] ?? '').trim(),
    password: String(model['password'] ?? ''),
  };
}

@Injectable()
export class AuthFacade {
  private readonly repository = inject(AuthRepository);
  private readonly session = inject(AuthSession);
  private readonly translate = inject(TranslateService);

  private readonly _submitting = signal(false);
  private readonly _errors = signal<string[]>([]);
  private readonly _user = signal<AuthenticatedUser | null>(null);

  readonly submitting = this._submitting.asReadonly();
  readonly errors = this._errors.asReadonly();

  readonly user = this._user.asReadonly();

  signup(model: Record<string, unknown>): boolean {
    return this.run(() => this.repository.signup(toSignupRequest(model)));
  }

  signin(model: Record<string, unknown>): boolean {
    return this.run(() => this.repository.signin(toSigninRequest(model)));
  }

  clearErrors(): void {
    this._errors.set([]);
  }

  private run(request: () => Observable<AuthResponse>): boolean {
    if (this._submitting()) return false;

    this._submitting.set(true);
    this._errors.set([]);

    request().subscribe({
      next: (response) => {
        this.session.save(response);
        this._user.set(response.user);
        this._submitting.set(false);
      },
      error: (error: unknown) => {
        this._errors.set(
          error instanceof AuthRequestError
            ? error.messages
            : [this.translate.instant('auth.errors.generic')]
        );
        this._submitting.set(false);
      },
    });

    return true;
  }
}
