import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DynamicForm } from '@org/ui';
import { REGISTER_ACCOUNT_FIELDS } from '../../../data/auth.fields';
import { translateFields } from '../../../data/translate-fields';
import { AuthFeedback } from '../../../ui/auth-feedback/auth-feedback';
import { SocialSignIn } from '../../../ui/social-sign-in/social-sign-in';
import { REGISTER_STEPPER, RegistrationDraft } from '../../register-stepper';

@Component({
  selector: 'app-register-account-step',
  imports: [DynamicForm, AuthFeedback, SocialSignIn, RouterLink, TranslatePipe],
  templateUrl: './register-account-step.html',
  styleUrls: ['../../../ui/auth-form.css', '../../../ui/auth-page.css'],
})
export class RegisterAccountStep {
  protected readonly stepper = inject(REGISTER_STEPPER);
  private readonly translate = inject(TranslateService);
  protected readonly fields = translateFields(REGISTER_ACCOUNT_FIELDS);

  protected readonly notice = signal<string | null>(null);

  protected onSubmit(values: RegistrationDraft): void {
    this.notice.set(null);
    this.stepper.next({ ...values, rePassword: values['password'] });
  }

  protected onUnavailable(provider: string): void {
    const name = this.translate.instant(`auth.social.providers.${provider}`);
    this.notice.set(this.translate.instant('auth.social.unavailable', { provider: name }));
  }
}
