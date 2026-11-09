import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from '../../config/api-base-url.token';
import { AuthStore } from '../../../features/auth/store/auth.store';
import { TokenStorage } from '../../../features/auth/domain/token-storage';

const AUTH_ENDPOINTS = /\/auth\/(signin|signup|forgotPassword|verifyResetCode|resetPassword|logout)$/;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_BASE_URL);
  const tokens = inject(TokenStorage);
  const store = inject(AuthStore);

  if (!req.url.startsWith(apiUrl)) {
    return next(req);
  }

  const token = tokens.get();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !AUTH_ENDPOINTS.test(req.url)) {
        store.expireSession();
      }

      return throwError(() => error);
    }),
  );
};
