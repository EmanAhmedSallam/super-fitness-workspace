import { Route } from '@angular/router';
import { authGuard } from '@super-fitness/auth';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [

  { path: '', pathMatch: 'full', redirectTo: 'superFitness' },
  {
    path: 'superFitness',
    
    loadChildren: () =>
      loadRemote<typeof import('superFitness/Routes')>(
        'superFitness/Routes',
      ).then((remote) => {
        if (!remote) {
          throw new Error('Unable to load superFitness routes');
        }
        return remote.remoteRoutes;
      }),
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemote<typeof import('authApp/Routes')>('authApp/Routes').then(
        (remote) => {
          if (!remote) {
            throw new Error('Unable to load authApp routes');
          }
          return remote.remoteRoutes;
        },
      ),
  },
  { path: '**', redirectTo: 'superFitness' },
];
