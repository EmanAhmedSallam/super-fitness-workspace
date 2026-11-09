import { Injectable } from '@angular/core';
import { TokenStorage } from '../domain/token-storage';

const TOKEN_KEY = 'elevate_auth_token';

@Injectable()
export class WebTokenStorage extends TokenStorage {
  save(token: string, remember: boolean): void {
    this.clear();

    try {
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(TOKEN_KEY, token);
    } catch {
    }
  }

  get(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  has(): boolean {
    return !!this.get();
  }

  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
    }
  }
}
