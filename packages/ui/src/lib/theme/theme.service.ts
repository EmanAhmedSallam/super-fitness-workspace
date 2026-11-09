import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly selectedTheme = signal<'light' | 'dark'>('dark');

  readonly theme = this.selectedTheme.asReadonly();

  constructor() {
    let theme: 'light' | 'dark' = 'dark';
    try {
      if (
        this.document.defaultView?.localStorage.getItem(
          'super-fitness.theme',
        ) === 'light'
      ) {
        theme = 'light';
      }
    } catch {
      theme = 'dark';
    }
    this.applyTheme(theme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.applyTheme(theme);
    try {
      this.document.defaultView?.localStorage.setItem(
        'super-fitness.theme',
        theme,
      );
    } catch {
      return;
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.selectedTheme.set(theme);
    this.document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
