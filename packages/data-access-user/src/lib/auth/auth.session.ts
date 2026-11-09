import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse, AuthenticatedUser } from './auth.models';

const TOKEN_KEY = 'super-fitness.token';
const USER_KEY = 'super-fitness.user';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
  }
}

@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly _token = signal<string | null>(read(TOKEN_KEY));
  private readonly _user = signal<AuthenticatedUser | null>(readUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  save(response: AuthResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);

    write(TOKEN_KEY, response.token);
    write(USER_KEY, JSON.stringify(response.user));
  }

  updateUser(user: AuthenticatedUser): void {
    const updated = { ...this._user(), ...user };
    this._user.set(updated);
    write(USER_KEY, JSON.stringify(updated));
  }

  clear(): void {
    this._token.set(null);
    this._user.set(null);

    write(TOKEN_KEY, null);
    write(USER_KEY, null);
  }
}

function readUser(): AuthenticatedUser | null {
  const raw = read(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}
