import { Route } from '@angular/router';

export const aboutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/about-page').then((module) => module.AboutPage),
  },
];
