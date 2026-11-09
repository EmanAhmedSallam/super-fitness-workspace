import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ar';
export type AppDirection = 'ltr' | 'rtl';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly defaultLanguage: AppLanguage = 'en';

  readonly currentLang = signal<AppLanguage>(this.defaultLanguage);
  readonly dir = computed<AppDirection>(() =>
    this.currentLang() === 'ar' ? 'rtl' : 'ltr',
  );
  readonly isRtl = computed(() => this.dir() === 'rtl');

  init() {
    const savedLanguage = localStorage.getItem('lang');
    const language: AppLanguage = savedLanguage === 'ar' ? 'ar' : 'en';
    return this.switchLanguage(language);
  }

  switchLanguage(language: AppLanguage) {
    this.currentLang.set(language);
    localStorage.setItem('lang', language);
    this.setDirection(language);
    return this.translateService.use(language);
  }

  private setDirection(language: AppLanguage): void {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }
}
