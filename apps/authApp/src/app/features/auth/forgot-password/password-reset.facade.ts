import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthRepository, AuthRequestError } from '@super-fitness/data-access-user';
import { PasswordResetState } from './password-reset.state';

const GENERIC_ERROR = 'auth.errors.generic';
const NO_ACCOUNT = 'auth.errors.noAccount';
const BAD_CODE = 'auth.errors.badCode';

@Injectable()
export class PasswordResetFacade {
  private readonly repository = inject(AuthRepository);
  private readonly state = inject(PasswordResetState);
  private readonly translate = inject(TranslateService);

  private readonly _submitting = signal(false);
  private readonly _errors = signal<string[]>([]);

  readonly submitting = this._submitting.asReadonly();
  readonly errors = this._errors.asReadonly();
  readonly email = this.state.email;

  sendCode(email: string, onSent: () => void): boolean {
    return this.run(
      () => this.repository.forgotPassword({ email }),
      { 404: NO_ACCOUNT },
      () => {
        this.state.codeSentTo(email);
        onSent();
      }
    );
  }

  verifyCode(resetCode: string, onVerified: () => void): boolean {
    return this.run(
      () => this.repository.verifyResetCode({ resetCode }),
      { 400: BAD_CODE, 404: BAD_CODE },
      () => {
        this.state.markVerified();
        onVerified();
      }
    );
  }

  resetPassword(newPassword: string, onReset: () => void): boolean {
    const email = this.state.email();
    if (!email || !this.state.canReset()) {
      this._errors.set([this.translate.instant('auth.errors.sessionExpired')]);
      return false;
    }

    return this.run(
      () => this.repository.resetPassword({ email, newPassword }),
      { 404: NO_ACCOUNT },
      () => {
        this.state.clear();
        onReset();
      }
    );
  }

  clearErrors(): void {
    this._errors.set([]);
  }

  private run(
    request: () => Observable<unknown>,
    wording: Partial<Record<number, string>>,
    onSuccess: () => void
  ): boolean {
    if (this._submitting()) return false;

    this._submitting.set(true);
    this._errors.set([]);

    request().subscribe({
      next: () => {
        this._submitting.set(false);
        onSuccess();
      },
      error: (error: unknown) => {
        this._errors.set(this.toMessages(error, wording));
        this._submitting.set(false);
      },
    });

    return true;
  }

  private toMessages(error: unknown, wording: Partial<Record<number, string>>): string[] {
    if (!(error instanceof AuthRequestError)) return [this.translate.instant(GENERIC_ERROR)];

    const known = wording[error.status];
    return known ? [this.translate.instant(known)] : error.messages;
  }
}
