import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LanguageService, languageInterceptor, provideI18n } from '@org/i18n';

import {
  API_BASE_URL,
  DEV_API_CONFIG,
  PRODUCTION_API_CONFIG,
} from '@super-fitness/data-access-user';
import { AUTH_ROUTES, authInterceptor } from '@super-fitness/auth';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AUTH_ROUTES,
      useValue: {
        login: '/login',
        authenticated: '/superFitness',
      },
    },

    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(LanguageService).init()),

    provideHttpClient(
      withInterceptors([authInterceptor, languageInterceptor])
    ),

    {
      provide: API_BASE_URL,
      useFactory: () =>
        (isDevMode() ? DEV_API_CONFIG : PRODUCTION_API_CONFIG).apiBaseUrl,
    },

    provideI18n(['shell', 'auth']),

    provideRouter(appRoutes),
  ],
};