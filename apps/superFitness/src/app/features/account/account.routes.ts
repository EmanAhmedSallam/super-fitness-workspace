import { Route } from '@angular/router';

export const accountRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/account-page').then((module) => module.AccountPage),
  },
];
