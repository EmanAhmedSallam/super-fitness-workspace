import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppLanguage, LanguageService, LanguageSwitcher } from '@org/i18n';
import { FieldIcon, SiteButton, ThemeService, ThemeToggle } from '@org/ui';
import { AuthSessionService } from '@super-fitness/auth';

type NavbarLink = {
  label: string;
  route: string;
  fragment?: string;
  // Home is the parent of every other route, so it must match exactly to avoid always being active
  exact?: boolean;
};

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    FieldIcon,
    SiteButton,
    TranslatePipe,
    ThemeToggle,
    LanguageSwitcher,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);
  protected readonly themeService = inject(ThemeService);

  links = signal<NavbarLink[]>([
    { label: 'navbar.home', route: '/superFitness', exact: true },
    { label: 'navbar.about', route: 'about' },
    { label: 'navbar.classes', route: 'classes' },
    { label: 'navbar.healthy', route: 'healthy' },
  ]);

  menuOpen = signal(false);
  scrolled = signal(false);

  protected readonly loginAction = (): void => this.navigateToLogin();
  protected readonly registerAction = (): void => this.navigateToRegister();

  get isAuthenticated(): boolean {
    return this.authSession.isAuthenticated();
  }

  navigateToLogin(): void {
    void this.router.navigateByUrl('/auth/login');
  }

  logout(): void {
    this.authSession.clearSession();
    void this.router.navigateByUrl('/auth/login');
  }

  navigateToRegister(): void {
    void this.router.navigateByUrl('/auth/register');
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleLanguage(): void {
    const language: AppLanguage =
      this.languageService.currentLang() === 'en' ? 'ar' : 'en';
    void this.languageService.switchLanguage(language);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }
}
