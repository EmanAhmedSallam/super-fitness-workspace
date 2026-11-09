import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthSessionService } from '@super-fitness/auth';
import { of } from 'rxjs';
import { appRoutes } from '../../../app.routes';
import { remoteRoutes } from '../../../remote-entry/entry.routes';
import { MusclesService } from '../../../features/classes/services/muscles.service';
import { MealsService } from '../../../features/home/services/meals.service';

describe.each(['shell', 'standalone'])('%s MainLayout pages', (mode) => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('preserves Home, About, and Classes with one shared layout and full-width marquees', async () => {
    const routes: Routes = mode === 'shell'
      ? [{ path: 'superFitness', loadChildren: async () => remoteRoutes }]
      : appRoutes;
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideTranslateService(),
        { provide: AuthSessionService, useValue: { isAuthenticated: () => true } },
        { provide: MusclesService, useValue: {
          getAllMuscleGroups: () => of({ musclesGroup: [] }),
        } },
        { provide: MealsService, useValue: {
          getCategories: () => of({ categories: [] }),
        } },
      ],
    });
    const harness = await RouterTestingHarness.create();
    const prefix = mode === 'shell' ? '/superFitness' : '';
    for (const page of ['classes', '', 'about']) {
      await harness.navigateByUrl((prefix + (page ? '/' + page : '')) || '/');
      await harness.fixture.whenStable();
      const host: HTMLElement = harness.fixture.nativeElement;
      expect(host.querySelectorAll('app-main-layout')).toHaveLength(1);
      expect(host.querySelectorAll('app-navbar')).toHaveLength(1);
      expect(host.querySelectorAll('app-footer')).toHaveLength(1);
      expect(host.querySelectorAll('app-fitness-marquee')).toHaveLength(page === '' ? 2 : 1);
      expect(host.querySelector('app-footer')?.previousElementSibling?.tagName).toBe('APP-FITNESS-MARQUEE');
      if (page !== 'classes') expect(host.querySelectorAll('app-about-us')).toHaveLength(1);
    }
  });
});
