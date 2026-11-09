import { TestBed } from '@angular/core/testing';
import { AuthResponse } from './auth.models';
import { AuthSession } from './auth.session';

const response: AuthResponse = {
  message: 'success',
  token: 'a-token',
  user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
};

describe('AuthSession', () => {
  function create(): AuthSession {
    TestBed.resetTestingModule();
    return TestBed.inject(AuthSession);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts signed out', () => {
    const session = create();

    expect(session.token()).toBeNull();
    expect(session.user()).toBeNull();
    expect(session.isAuthenticated()).toBe(false);
  });

  it('holds the token and user after a successful request', () => {
    const session = create();
    session.save(response);

    expect(session.token()).toBe('a-token');
    expect(session.user()?.email).toBe('ada@example.com');
    expect(session.isAuthenticated()).toBe(true);
  });

  it('survives a reload', () => {
    create().save(response);

    const reloaded = create();
    expect(reloaded.token()).toBe('a-token');
    expect(reloaded.user()?.firstName).toBe('Ada');
  });

  it('clear() signs out and empties storage', () => {
    const session = create();
    session.save(response);
    session.clear();

    expect(session.isAuthenticated()).toBe(false);
    expect(create().token()).toBeNull();
  });

  it('merges confirmed profile values without replacing the token or unrelated fields', () => {
    const session = create();
    session.save({ ...response, user: { ...response.user, photo: 'photo.jpg', goal: 'get fitter', activityLevel: 'level2' } });
    session.updateUser({ ...response.user, weight: 50 });

    expect(session.token()).toBe('a-token');
    expect(session.user()).toEqual({ ...response.user, photo: 'photo.jpg', goal: 'get fitter', activityLevel: 'level2', weight: 50 });
    expect(create().user()).toEqual(session.user());
    expect(create().token()).toBe('a-token');
  });

  it('ignores a corrupted stored user rather than throwing', () => {
    localStorage.setItem('super-fitness.token', 'a-token');
    localStorage.setItem('super-fitness.user', 'not json');

    const session = create();
    expect(session.token()).toBe('a-token');
    expect(session.user()).toBeNull();
  });
});
