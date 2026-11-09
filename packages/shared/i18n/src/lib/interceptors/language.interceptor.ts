import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.includes('/assets/') || request.url.endsWith('.json')) {
    return next(request);
  }
  
  const languageService = inject(LanguageService);
  const language = languageService.currentLang();

 const clonedRequest = request.clone({
  setHeaders: {
    'Accept-Language': language,
  },
  });

  return next(clonedRequest);
};
