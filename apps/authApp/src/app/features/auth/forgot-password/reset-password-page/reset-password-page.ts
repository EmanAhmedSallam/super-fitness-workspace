import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader, DynamicForm } from '@org/ui';
import { RESET_PASSWORD_FIELDS } from '../../data/auth.fields';
import { translateFields } from '../../data/translate-fields';
import { AuthFeedback } from '../../ui/auth-feedback/auth-feedback';
import { PasswordResetFacade } from '../password-reset.facade';

const REDIRECT_AFTER_MS = 3000;

@Component({
  selector: 'app-reset-password-page',
  imports: [AuthHeader, AuthFeedback, DynamicForm, RouterLink, TranslatePipe],
  providers: [PasswordResetFacade],
  host: { class: 'block' },
  templateUrl: './reset-password-page.html',
  styleUrls: ['../../ui/auth-form.css', '../../ui/auth-page.css'],
})
export class ResetPasswordPage {
  private readonly facade = inject(PasswordResetFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly fields = translateFields(RESET_PASSWORD_FIELDS);
  protected readonly submitting = this.facade.submitting;
  protected readonly errors = this.facade.errors;
  protected readonly done = signal(false);

  protected onSubmit(model: Record<string, unknown>): void {
    this.facade.resetPassword(String(model['password'] ?? ''), () => {
      this.done.set(true);

      const timer = setTimeout(() => this.goToLogin(), REDIRECT_AFTER_MS);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  private goToLogin(): void {
    void this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }
}
