import { Route } from '@angular/router';
import { authGuard } from '@super-fitness/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./remote-entry/entry.routes').then((m) => m.remoteRoutes),
  },
];
