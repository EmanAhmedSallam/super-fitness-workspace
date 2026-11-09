import { HttpContextToken } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export const AUTH_ROUTES = new InjectionToken<{
  login: string;
  authenticated: string;
}>('AUTH_ROUTES', {
  providedIn: 'root',
  factory: () => ({ login: '/auth/login', authenticated: '/superFitness' }),
});

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
