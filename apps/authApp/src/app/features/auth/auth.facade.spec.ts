import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  AuthRepository,
  AuthRequestError,
  AuthResponse,
  AuthSession,
} from '@super-fitness/data-access-user';
import { AuthFacade, toSigninRequest, toSignupRequest } from './auth.facade';

const signupModel: Record<string, unknown> = {
  firstName: '  Ada  ',
  lastName: 'Lovelace',
  email: ' ada@example.com ',
  gender: 'female',
  password: 'Passw0rd!',
  rePassword: 'Passw0rd!',
  goal: 'get fitter',
  height: '170',
  weight: 62,
  age: '36',
  activityLevel: 'level3',
};

const response: AuthResponse = {
  message: 'success',
  token: 'a-token',
  user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
};

describe('toSignupRequest', () => {
  it('trims text and coerces the measurements to numbers', () => {
    expect(toSignupRequest(signupModel)).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      gender: 'female',
      password: 'Passw0rd!',
      rePassword: 'Passw0rd!',
      goal: 'get fitter',
      height: 170,
      weight: 62,
      age: 36,
      activityLevel: 'level3',
    });
  });
});

describe('toSigninRequest', () => {
  it('sends only the credentials, with the email trimmed', () => {
    expect(
      toSigninRequest({ email: ' ada@example.com ', password: 'Passw0rd!' })
    ).toEqual({ email: 'ada@example.com', password: 'Passw0rd!' });
  });
});

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let session: AuthSession;
  let signup: ReturnType<typeof vi.fn>;
  let signin: ReturnType<typeof vi.fn>;
  let response$: Subject<AuthResponse>;

  beforeEach(() => {
    localStorage.clear();
    response$ = new Subject<AuthResponse>();
    signup = vi.fn().mockReturnValue(response$);
    signin = vi.fn().mockReturnValue(response$);

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthRepository, useValue: { signup, signin } },
        provideTranslateService(),
      ],
    });

    facade = TestBed.inject(AuthFacade);
    session = TestBed.inject(AuthSession);
    session.clear();
  });

  it('starts idle', () => {
    expect(facade.submitting()).toBe(false);
    expect(facade.errors()).toEqual([]);
    expect(facade.user()).toBeNull();
  });

  it('sends the mapped signup payload and flags itself as submitting', () => {
    expect(facade.signup(signupModel)).toBe(true);

    expect(signup).toHaveBeenCalledWith(toSignupRequest(signupModel));
    expect(facade.submitting()).toBe(true);
  });

  it('sends only the credentials when signing in', () => {
    facade.signin({ email: 'ada@example.com', password: 'Passw0rd!' });

    expect(signin).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'Passw0rd!',
    });
  });

  it('stores the session when the request succeeds', () => {
    facade.signin({ email: 'ada@example.com', password: 'Passw0rd!' });

    response$.next(response);
    response$.complete();

    expect(facade.user()?.firstName).toBe('Ada');
    expect(facade.submitting()).toBe(false);
    expect(facade.errors()).toEqual([]);
    expect(session.token()).toBe('a-token');
    expect(session.isAuthenticated()).toBe(true);
  });

  it('surfaces every message from a rejected request', () => {
    facade.signup(signupModel);
    response$.error(
      new AuthRequestError(['"email" is taken', '"age" is required'], 409)
    );

    expect(facade.errors()).toEqual(['"email" is taken', '"age" is required']);
    expect(facade.submitting()).toBe(false);
    expect(facade.user()).toBeNull();
    expect(session.isAuthenticated()).toBe(false);
  });

  it('passes the API wording for bad credentials straight through', () => {
    facade.signin({ email: 'ada@example.com', password: 'Nope1234!' });
    response$.error(new AuthRequestError(['incorrect email or password'], 401));

    expect(facade.errors()).toEqual(['incorrect email or password']);
  });

  it('falls back to a generic message for an unrecognised failure', () => {
    facade.signup(signupModel);
    response$.error(new Error('boom'));

    expect(facade.errors()).toEqual(['Something went wrong. Please try again.']);
  });

  it('ignores a second submit while one is in flight', () => {
    expect(facade.signup(signupModel)).toBe(true);
    expect(facade.signup(signupModel)).toBe(false);

    expect(signup).toHaveBeenCalledTimes(1);
  });

  it('clears previous errors when a new attempt starts', () => {
    facade.signup(signupModel);
    response$.error(new AuthRequestError(['"email" is taken'], 409));
    expect(facade.errors()).toHaveLength(1);

    response$ = new Subject<AuthResponse>();
    signup.mockReturnValue(response$);
    facade.signup(signupModel);

    expect(facade.errors()).toEqual([]);
  });
});
