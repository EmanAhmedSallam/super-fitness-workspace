import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../loading.service';
import { REQUEST_STATE } from '../request-state';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const state = request.context.get(REQUEST_STATE);
  if (!state) return next(request);

  const loading = inject(LoadingService);
  loading.start(state.key);

  return next(request).pipe(finalize(() => loading.stop(state.key)));
};
