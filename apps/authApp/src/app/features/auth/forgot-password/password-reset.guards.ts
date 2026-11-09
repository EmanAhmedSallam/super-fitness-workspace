import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { PasswordResetState } from './password-reset.state';

function stepUrl(route: ActivatedRouteSnapshot, step: string): UrlTree {
  const flowPath = (route.parent?.pathFromRoot ?? []).flatMap((r) =>
    r.url.map((segment) => segment.path)
  );
  return inject(Router).createUrlTree(['/', ...flowPath, ...(step ? [step] : [])]);
}

export const codeSentGuard: CanActivateFn = (route) =>
  inject(PasswordResetState).codeSent() || stepUrl(route, '');

export const codeVerifiedGuard: CanActivateFn = (route) => {
  const state = inject(PasswordResetState);
  if (state.canReset()) return true;
  return stepUrl(route, state.codeSent() ? 'otp' : '');
};
