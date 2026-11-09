import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { API_BASE_URL } from '@super-fitness/data-access-user';
import { Navbar } from '../../navbar/navbar';
import { remoteRoutes } from '../../../remote-entry/entry.routes';

@Component({ imports: [Navbar, RouterOutlet], template: '<app-navbar /><router-outlet />' })
class RoutingHost {}

describe('Account routing', () => {
  afterEach(() => {
    localStorage.removeItem('super-fitness.theme');
    document.documentElement.classList.remove('dark');
  });

  it.each(['', 'superFitness'])('loads Account and links to it with the %s route prefix', async (prefix) => {
    const children = remoteRoutes[0].children;
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: prefix, component: RoutingHost, children }]),
        provideHttpClient(), provideHttpClientTesting(), provideTranslateService(),
        { provide: API_BASE_URL, useValue: 'https://fitness.elevateegy.com/api/v1' },
      ],
    }).compileComponents();
    const path = prefix ? `/${prefix}/account` : '/account';
    const harness = await RouterTestingHarness.create(path);
    TestBed.inject(HttpTestingController).expectOne('https://fitness.elevateegy.com/api/v1/auth/profile-data')
      .flush({ message: 'success', user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', goal: 'get fitter', activityLevel: 'level2', weight: 62 } });
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement;
    if (!host) throw new Error('Account route did not render');
    expect(host.querySelector('app-account-page')).not.toBeNull();
    expect(host.querySelectorAll('app-account-basic-metrics').length).toBe(1);
    expect(host.querySelectorAll('app-account-settings-section').length).toBe(1);
    expect(host.querySelectorAll('app-account-settings-card').length).toBe(7);
    expect(host.querySelectorAll('app-navbar').length).toBe(1);
    expect(host.querySelector<HTMLAnchorElement>('.actions a.btn')?.getAttribute('href')).toBe(path);
    expect(host.querySelectorAll('router-outlet').length).toBe(1);
    TestBed.inject(HttpTestingController).verify();
  });
});
