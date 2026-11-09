import '@angular/compiler';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthStore } from './auth.store';
import { TokenStorage } from '../domain/token-storage';
import { SignInUseCase } from '../domain/use-cases/sign-in.use-case';
import { SignUpUseCase } from '../domain/use-cases/sign-up.use-case';
import { ForgotPasswordUseCase } from '../domain/use-cases/forgot-password.use-case';
import { VerifyResetCodeUseCase } from '../domain/use-cases/verify-reset-code.use-case';
import { ResetPasswordUseCase } from '../domain/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../domain/use-cases/change-password.use-case';
import { LoadProfileUseCase } from '../domain/use-cases/load-profile.use-case';
import { LogoutUseCase } from '../domain/use-cases/logout.use-case';

const buildStore = () => {
  const tokenStorage = {
    save: vi.fn(),
    get: vi.fn(() => null),
    has: vi.fn(() => false),
    clear: vi.fn(),
  } satisfies Partial<TokenStorage> as TokenStorage;

  const user = {
    _id: '1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    gender: 'female',
    age: 36,
    height: 170,
    weight: 62,
    goal: 'stay-fit',
    activityLevel: 'level3',
  };

  const router = {
    navigate: vi.fn(),
    parseUrl: vi.fn(() => ({ queryParams: {} })),
  } as unknown as Router;

  const signInUseCase = { execute: vi.fn(() => of({ token: 'jwt-token', user })) } as unknown as SignInUseCase;
  const signUpUseCase = { execute: vi.fn(() => of({ message: 'created' })) } as unknown as SignUpUseCase;
  const forgotPasswordUseCase = { execute: vi.fn(() => of({ message: 'sent' })) } as unknown as ForgotPasswordUseCase;
  const verifyResetCodeUseCase = { execute: vi.fn(() => of({ message: 'verified' })) } as unknown as VerifyResetCodeUseCase;
  const resetPasswordUseCase = { execute: vi.fn(() => of({ message: 'reset' })) } as unknown as ResetPasswordUseCase;
  const changePasswordUseCase = { execute: vi.fn(() => of({ message: 'password updated' })) } as unknown as ChangePasswordUseCase;
  const loadProfileUseCase = { execute: vi.fn(() => of(user)) } as unknown as LoadProfileUseCase;
  const logoutUseCase = { execute: vi.fn(() => of({ message: 'logged out' })) } as unknown as LogoutUseCase;

  const injector = Injector.create({
    providers: [
      AuthStore,
      { provide: Router, useValue: router },
      { provide: SignInUseCase, useValue: signInUseCase },
      { provide: SignUpUseCase, useValue: signUpUseCase },
      { provide: ForgotPasswordUseCase, useValue: forgotPasswordUseCase },
      { provide: VerifyResetCodeUseCase, useValue: verifyResetCodeUseCase },
      { provide: ResetPasswordUseCase, useValue: resetPasswordUseCase },
      { provide: ChangePasswordUseCase, useValue: changePasswordUseCase },
      { provide: LoadProfileUseCase, useValue: loadProfileUseCase },
      { provide: LogoutUseCase, useValue: logoutUseCase },
      { provide: TokenStorage, useValue: tokenStorage },
    ],
  });
  const store = injector.get(AuthStore);
  return { store, tokenStorage };
};

describe('AuthStore', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      configurable: true,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      configurable: true,
    });
  });

  it('starts unauthenticated and marks initialization complete', () => {
    const { store } = buildStore();

    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.initialized()).toBe(false);

    store.restoreSession().subscribe();

    expect(store.initialized()).toBe(true);
    expect(store.isAuthenticated()).toBe(false);
  });

  it('expires the session and clears persisted auth state', () => {
    const { store, tokenStorage } = buildStore();

    tokenStorage.save('jwt-token', true);
    store.setUser({
      _id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      gender: 'female',
      age: 36,
      height: 170,
      weight: 62,
      goal: 'stay-fit',
      activityLevel: 'level3',
    });

    store.expireSession();

    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
    expect(tokenStorage.clear).toHaveBeenCalled();
  });
});
