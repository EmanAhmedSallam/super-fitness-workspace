import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader, DynamicForm } from '@org/ui';
import { FORGOT_PASSWORD_FIELDS } from '../../data/auth.fields';
import { translateFields } from '../../data/translate-fields';
import { AuthFeedback } from '../../ui/auth-feedback/auth-feedback';
import { PasswordResetFacade } from '../password-reset.facade';
import { PasswordResetState } from '../password-reset.state';

@Component({
  selector: 'app-forgot-password-page',
  imports: [AuthHeader, AuthFeedback, DynamicForm, TranslatePipe],
  providers: [PasswordResetFacade],
  host: { class: 'block' },
  templateUrl: './forgot-password-page.html',
  styleUrls: ['../../ui/auth-form.css', '../../ui/auth-page.css'],
})
export class ForgotPasswordPage {
  private readonly facade = inject(PasswordResetFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly fields = translateFields(FORGOT_PASSWORD_FIELDS);
  protected readonly submitting = this.facade.submitting;
  protected readonly errors = this.facade.errors;
  protected readonly initialData = signal({ email: inject(PasswordResetState).email() ?? '' });

  protected onSubmit(model: Record<string, unknown>): void {
    const email = String(model['email'] ?? '').trim();

    this.facade.sendCode(email, () =>
      this.router.navigate(['otp'], { relativeTo: this.route })
    );
  }
}
