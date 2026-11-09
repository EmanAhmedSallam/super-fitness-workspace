import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthSession } from '@super-fitness/data-access-user';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly authSession = inject(AuthSession);
  private readonly cookieName = 'super_fitness_token';

  setToken(token: string): void {
    if (!token.trim()) {
      this.clearSession();
      return;
    }

    if (this.isBrowser) {
      this.document.cookie = `${this.cookieName}=${encodeURIComponent(token)}; ${this.cookieOptions}`;
    }
  }

  getToken(): string | null {
    const sessionToken = this.authSession.token();
    if (sessionToken?.trim()) return sessionToken;
    if (!this.isBrowser) return null;

    const prefix = `${this.cookieName}=`;
    const cookie = this.document.cookie
      .split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith(prefix));

    if (!cookie) return null;

    try {
      const token = decodeURIComponent(cookie.slice(prefix.length));
      return token.trim() ? token : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  clearSession(): void {
    this.authSession.clear();
    if (this.isBrowser) {
      this.document.cookie = `${this.cookieName}=; Max-Age=0; ${this.cookieOptions}`;
    }
  }

  private get cookieOptions(): string {
    return `Path=/; SameSite=Lax${this.document.location.protocol === 'https:' ? '; Secure' : ''}`;
  }
}
