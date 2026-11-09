import { TestBed } from '@angular/core/testing';
import { Route, provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';

function byPath(path: string): Route {
  const route = appRoutes.find((r) => r.path === path);
  if (!route) throw new Error(`No route configured for "${path}"`);
  return route;
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the routed remote through an outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});

describe('appRoutes', () => {
  it('lands on the auth remote', () => {
    const root = byPath('');

    expect(root.pathMatch).toBe('full');
    expect(root.redirectTo).toBe('auth');
  });

  it('sends unknown URLs to auth as well', () => {
    expect(byPath('**').redirectTo).toBe('auth');
  });

  it('lazily loads each remote rather than bundling it', () => {
    for (const path of ['auth', 'superFitness']) {
      expect(typeof byPath(path).loadChildren, path).toBe('function');
      expect(byPath(path).component, path).toBeUndefined();
    }
  });

  it('keeps the catch-all last so it cannot shadow a real route', () => {
    expect(appRoutes.at(-1)?.path).toBe('**');
  });
});
