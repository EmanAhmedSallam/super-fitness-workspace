import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { RegistrationStepPath, registrationStepGuard } from './register-flow.guards';
import { RegistrationFlowService } from './services/registration-flow.service';

const ACCOUNT = { firstName: 'Ali', lastName: 'Omar', email: 'a@b.co', password: 'Passw0rd!' };

describe('registrationStepGuard', () => {
  let flow: RegistrationFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    flow = TestBed.inject(RegistrationFlowService);
  });

  function run(step: RegistrationStepPath): string | true {
    const route = {
      parent: { pathFromRoot: [{ url: [{ path: 'auth' }] }, { url: [{ path: 'register' }] }] },
    } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      registrationStepGuard(step)(route, {} as RouterStateSnapshot)
    );
    return result instanceof UrlTree ? TestBed.inject(Router).serializeUrl(result) : (result as true);
  }

  it('sends an empty draft back to the account step', () => {
    expect(run('activity')).toBe('/auth/register/account');
  });

  it('redirects to the first step that is still missing', () => {
    flow.patch({ ...ACCOUNT, gender: 'male', age: 25 });
    expect(run('goal')).toBe('/auth/register/weight');
  });

  it('allows a step once every earlier step is filled', () => {
    flow.patch({ ...ACCOUNT, gender: 'female', age: 30, weight: 60, height: 165, goal: 'get fitter' });
    expect(run('activity')).toBe(true);
  });
});
