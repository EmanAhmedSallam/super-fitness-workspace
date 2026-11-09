import { Route } from '@angular/router';
import { provideHttpClient, withInterceptors, withRequestsMadeViaParent } from '@angular/common/http';
import { MainLayout } from '../shared/components/main-layout/main-layout.component';
import { errorInterceptor } from '../core/http/interceptors/error.interceptor';
import { loadingInterceptor } from '../core/http/interceptors/loading.interceptor';
import { MealsService } from '../features/home/services/meals.service';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: MainLayout,
    providers: [
      provideHttpClient(
        withInterceptors([loadingInterceptor, errorInterceptor]),
        withRequestsMadeViaParent(),
      ),
      MealsService,
    ],
    children: [
      {
        path: 'account',
        loadChildren: () =>
          import('../features/account/account.routes').then(
            (module) => module.accountRoutes,
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../features/about/about.routes').then(
            (module) => module.aboutRoutes,
          ),
      },
      {
        path: 'classes',
        loadChildren: () =>
          import('../features/classes/classes.routes').then(
            (module) => module.classesRoutes,
          ),
      },
      {
        path: 'healthy',
        loadChildren: () =>
          import('../features/healthy/healthy.routes').then(
            (module) => module.healthyRoutes,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('../features/home/home.routes').then(
            (module) => module.homeRoutes,
          ),
      },
    ],
  },
];
