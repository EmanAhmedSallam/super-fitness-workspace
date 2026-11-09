import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppLanguage, LanguageService } from '@org/i18n';
import {  ThemeService } from '@org/ui';
import { AuthSessionService } from '@super-fitness/auth';
import { AccountSettingsCard } from '../account-settings-card/account-settings-card.component';

@Component({
  selector: 'app-account-settings-section',
  standalone: true,
  imports: [AccountSettingsCard, TranslatePipe],
  templateUrl: './account-settings-section.component.html',
  styleUrl: './account-settings-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsSection {
  private readonly _router = inject(Router);
  private readonly _authSession = inject(AuthSessionService);
  private readonly _languageService = inject(LanguageService);
  protected readonly _themeService = inject(ThemeService);

  readonly currentLang = this._languageService.currentLang;
  readonly langLabel = computed(() => (this.currentLang() === 'en' ? 'English' : 'العربية'));


  protected toggleLanguage(): void {
    const language: AppLanguage = this._languageService.currentLang() === 'en' ? 'ar' : 'en';
    this._languageService.switchLanguage(language);
  }

  protected toggleTheme(): void {
    this._themeService.toggleTheme();
  }
  protected goToChangePassword(){
    void this._router.navigateByUrl('/auth/change-password');
  }

  protected logout(){
    this._authSession.clearSession();
    void this._router.navigateByUrl('/auth/login');
  }
}
