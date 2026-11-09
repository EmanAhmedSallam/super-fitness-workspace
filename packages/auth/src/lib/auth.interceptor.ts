import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '@super-fitness/data-access-user';
import { catchError, throwError } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { AUTH_ROUTES, SKIP_AUTH } from './auth.tokens';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const document = inject(DOCUMENT);
  const apiBaseUrl = inject(API_BASE_URL);
  const session = inject(AuthSessionService);
  const router = inject(Router);
  const routes = inject(AUTH_ROUTES);

  if (request.context.get(SKIP_AUTH)) return next(request);

  const apiUrl = new URL(apiBaseUrl, document.baseURI);
  const requestUrl = new URL(request.url, document.baseURI);
  const apiPath = apiUrl.pathname.replace(/\/+$/, '');

  if (
    requestUrl.origin !== apiUrl.origin ||
    (requestUrl.pathname !== apiPath &&
      !requestUrl.pathname.startsWith(`${apiPath}/`))
  ) {
    return next(request);
  }

  const token = session.getToken();
  const outgoing = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(outgoing).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        session.clearSession();
        const login = router.parseUrl(routes.login);
        const navigation = router.currentNavigation();
        const pendingPath = navigation?.extractedUrl
          .toString()
          .split(/[?#]/)[0];

        if (
          !router.isActive(login, {
            paths: 'exact',
            queryParams: 'ignored',
            fragment: 'ignored',
            matrixParams: 'ignored',
          }) &&
          pendingPath !== login.toString().split(/[?#]/)[0]
        ) {
          void router.navigateByUrl(login).catch(() => undefined);
        }
      }

      return throwError(() => error);
    }),
  );
};
