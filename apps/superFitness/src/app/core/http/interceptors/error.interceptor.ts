import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
import { HttpErrorService } from '../http-error.service';
import { REQUEST_STATE } from '../request-state';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const state = request.context.get(REQUEST_STATE);
  if (!state?.errorMessage) return next(request);

  const errors = inject(HttpErrorService);
  const { key, errorMessage } = state;
  errors.clear(key);

  return next(request).pipe(
    catchError(() => {
      errors.set(key, errorMessage);
      return EMPTY;
    }),
  );
};
