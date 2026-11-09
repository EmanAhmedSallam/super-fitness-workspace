import { Route } from '@angular/router';

export const classesRoutes: Route[] = [
 
  {
    path: '',
    loadComponent: () =>
      import('./pages/classes-page/classes-page').then((module) => module.ClassesPage),
  },
  
  {
    path: 'workout-details/:id',
    loadComponent: () =>
      import('./pages/workout-details-page/workout-details-page').then(
        (module) => module.WorkoutDetailsPage,
      ),
  },
];
