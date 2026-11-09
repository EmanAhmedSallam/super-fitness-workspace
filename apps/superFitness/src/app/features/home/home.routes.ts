import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page').then((module) => module.HomePage),
  },
];
