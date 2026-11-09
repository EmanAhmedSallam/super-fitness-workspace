import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthHeader, DynamicForm } from '@org/ui';
import { AuthFacade } from '../auth.facade';
import { LOGIN_FIELDS } from '../data/auth.fields';
import { translateFields } from '../data/translate-fields';
import { AuthFeedback } from '../ui/auth-feedback/auth-feedback';
import { SocialSignIn } from '../ui/social-sign-in/social-sign-in';

const HOME_URL = '/superFitness';

@Component({
  selector: 'app-login-page',
  imports: [
    AuthHeader,
    AuthFeedback,
    DynamicForm,
    SocialSignIn,
    RouterLink,
    TranslatePipe,
  ],
  providers: [AuthFacade],
  templateUrl: './login-page.html',
  styleUrls: ['../ui/auth-form.css', '../ui/auth-page.css'],
})
export class LoginPage {
  private readonly facade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly fields = translateFields(LOGIN_FIELDS);
  protected readonly submitting = this.facade.submitting;
  protected readonly errors = this.facade.errors;
  protected readonly user = this.facade.user;

  protected readonly notice = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.facade.user()) return;

      this.router.navigateByUrl(HOME_URL).then(
        (ok) => {
          if (!ok) this.signedInWithoutHome();
        },
        () => this.signedInWithoutHome()
      );
    });
  }

  protected onSubmit(model: Record<string, unknown>): void {
    this.notice.set(null);
    this.facade.signin(model);
  }

  protected onUnavailable(provider: string): void {
    const name = this.translate.instant(`auth.social.providers.${provider}`);
    this.notice.set(this.translate.instant('auth.social.unavailable', { provider: name }));
  }

  private signedInWithoutHome(): void {
    this.notice.set(this.translate.instant('auth.login.signedInNoHome', { url: HOME_URL }));
  }
}
