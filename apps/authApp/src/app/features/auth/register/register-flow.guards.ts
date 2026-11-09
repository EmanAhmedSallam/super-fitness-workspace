import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { RegistrationFlowService } from './services/registration-flow.service';

/**
 * Registration steps in the order the user walks through them, with the
 * draft keys each step fills in. A step is reachable only when every
 * earlier step has saved its keys.
 */
export const REGISTRATION_FLOW = [
  { path: 'account', keys: ['firstName', 'lastName', 'email', 'password'] },
  { path: 'gender', keys: ['gender'] },
  { path: 'age', keys: ['age'] },
  { path: 'weight', keys: ['weight'] },
  { path: 'height', keys: ['height'] },
  { path: 'goal', keys: ['goal'] },
  { path: 'activity', keys: ['activityLevel'] },
] as const;

export type RegistrationStepPath = (typeof REGISTRATION_FLOW)[number]['path'];

function stepUrl(route: ActivatedRouteSnapshot, step: string): UrlTree {
  const flowPath = (route.parent?.pathFromRoot ?? []).flatMap((r) =>
    r.url.map((segment) => segment.path)
  );
  return inject(Router).createUrlTree(['/', ...flowPath, step]);
}

/** Redirects to the first earlier step that is still missing a value. */
export function registrationStepGuard(step: RegistrationStepPath): CanActivateFn {
  return (route) => {
    const draft = inject(RegistrationFlowService).draft();
    const filled = (key: string) => draft[key] !== undefined && draft[key] !== '';

    const earlier = REGISTRATION_FLOW.slice(
      0,
      REGISTRATION_FLOW.findIndex((s) => s.path === step)
    );
    const missing = earlier.find((s) => !s.keys.every(filled));

    return missing ? stepUrl(route, missing.path) : true;
  };
}
