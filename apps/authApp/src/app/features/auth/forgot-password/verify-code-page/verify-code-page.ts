import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthHeader } from '@org/ui';
import { AuthFeedback } from '../../ui/auth-feedback/auth-feedback';
import { OtpInput } from '../../ui/otp-input/otp-input';
import { PasswordResetFacade } from '../password-reset.facade';

export const RESET_CODE_LENGTH = 4;

@Component({
  selector: 'app-verify-code-page',
  imports: [AuthHeader, AuthFeedback, OtpInput, TranslatePipe],
  providers: [PasswordResetFacade],
  host: { class: 'block' },
  templateUrl: './verify-code-page.html',
  styleUrls: ['../../ui/auth-form.css', '../../ui/auth-page.css'],
})
export class VerifyCodePage {
  private readonly facade = inject(PasswordResetFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  protected readonly length = signal(RESET_CODE_LENGTH);
  protected readonly submitting = this.facade.submitting;
  protected readonly errors = this.facade.errors;
  protected readonly email = this.facade.email;

  protected readonly code = signal('');
  protected readonly attempted = signal(false);
  protected readonly notice = signal<string | null>(null);

  protected readonly complete = computed(() => this.code().length === this.length());
  protected readonly invalid = computed(
    () => (this.attempted() && !this.complete()) || this.errors().length > 0
  );

  protected onCodeChange(code: string): void {
    this.code.set(code);
    this.facade.clearErrors();
  }

  protected submit(): void {
    this.attempted.set(true);
    this.notice.set(null);
    if (!this.complete()) return;

    this.facade.verifyCode(this.code(), () =>
      this.router.navigate(['../reset-password'], { relativeTo: this.route })
    );
  }

  protected resend(): void {
    const email = this.email();
    if (!email) return;

    this.notice.set(null);
    this.facade.sendCode(email, () => {
      this.code.set('');
      this.attempted.set(false);
      this.notice.set(this.translate.instant('auth.verifyCode.resent', { email }));
    });
  }
}
