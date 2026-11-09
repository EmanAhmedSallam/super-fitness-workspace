import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '@super-fitness/auth';
import { API_BASE_URL, AuthRepository, AuthSession, UpdateMetricRequest } from '@super-fitness/data-access-user';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';

describe('Authenticated account profile requests', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: BASE_URL },
    ] });
    TestBed.inject(AuthSession).save({ message: 'success', token: 'saved-token', user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' } });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
  });

  it('attaches the existing session token to the profile read', () => {
    TestBed.inject(AuthRepository).loadProfile().subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne(`${BASE_URL}/auth/profile-data`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer saved-token');
    request.flush({ message: 'success', user: TestBed.inject(AuthSession).user() });
  });

  it('clears the existing session when the profile request returns 401', async () => {
    TestBed.inject(AuthRepository).loadProfile().subscribe({ error: () => undefined });
    TestBed.inject(HttpTestingController).expectOne(`${BASE_URL}/auth/profile-data`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    expect(TestBed.inject(AuthSession).token()).toBeNull();
    expect(TestBed.inject(AuthSession).user()).toBeNull();
  });

  it.each<UpdateMetricRequest>([{ goal: 'lose weight' }, { activityLevel: 'level2' }, { weight: 50 }])('authenticates a partial update: %j', (payload) => {
    TestBed.inject(AuthRepository).updateMetric(payload).subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne(`${BASE_URL}/auth/editProfile`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    expect(request.request.headers.get('Authorization')).toBe('Bearer saved-token');
    request.flush({ message: 'success', user: { ...TestBed.inject(AuthSession).user(), ...payload } });
  });
});
