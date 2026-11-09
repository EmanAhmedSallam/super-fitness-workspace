import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map } from 'rxjs';
import { AuthStore } from './store/auth.store';

const AUTH_AREA = '/auth';

@Injectable({ providedIn: 'root' })
export class SessionRedirect {
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);

  constructor() {
    const url$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    );

    combineLatest([this.store.isAuthenticated$, url$]).subscribe(([isAuthenticated, url]) => {
      const inAuthArea = url === AUTH_AREA || url.startsWith(`${AUTH_AREA}/`) || url.startsWith(`${AUTH_AREA}?`);

      if (!isAuthenticated && !inAuthArea) {
        void this.router.navigate(['/auth/login'], {
          queryParams: url !== '/' ? { returnUrl: url } : {},
          replaceUrl: true,
        });
      } else if (isAuthenticated && inAuthArea) {
        const returnUrl = this.router.parseUrl(url).queryParams['returnUrl'] as string | undefined;
        void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/', {
          replaceUrl: true,
        });
      }
    });
  }
}
