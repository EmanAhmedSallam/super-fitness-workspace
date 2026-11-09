import { Injectable } from '@angular/core';
import { TokenStorage } from '../domain/token-storage';

@Injectable({ providedIn: 'root' })
export class TokenStorageService extends TokenStorage {
  private readonly storageKey = 'elevate_auth_token';

  save(token: string, remember: boolean): void {
    try {
      const storage = remember ? window.localStorage : window.sessionStorage;
      this.clear();
      storage.setItem(this.storageKey, token);
    } catch {
    }
  }

  get(): string | null {
    try {
      const localToken = window.localStorage.getItem(this.storageKey);
      if (localToken) {
        return localToken;
      }

      return window.sessionStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  has(): boolean {
    return this.get() !== null;
  }

  clear(): void {
    try {
      window.localStorage.removeItem(this.storageKey);
      window.sessionStorage.removeItem(this.storageKey);
    } catch {
    }
  }
}
