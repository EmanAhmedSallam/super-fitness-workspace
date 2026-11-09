import { Route } from '@angular/router';

export const healthyRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/healthy-page').then((module) => module.HealthyPage),
  },
  {
    path: ':mealId',
    loadComponent: () =>
      import('./pages/meal-details/meal-details-page').then((module) => module.MealDetailsPage),
  },
];
