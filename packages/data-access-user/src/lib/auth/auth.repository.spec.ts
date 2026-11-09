import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api/api.tokens';
import { AuthRepository, AuthRequestError } from './auth.repository';
import { AuthResponse, SigninRequest, SignupRequest } from './auth.models';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const SIGNIN_URL = `${BASE_URL}/auth/signin`;

const signupPayload: SignupRequest = {
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
};

const signinPayload: SigninRequest = {
  email: 'ada@example.com',
  password: 'Passw0rd!',
};

const success: AuthResponse = {
  message: 'success',
  token: 'a-token',
  user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
};

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        AuthRepository,
      ],
    });

    repository = TestBed.inject(AuthRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads saved profile metrics from /auth/profile-data', () => {
    const profile = { message: 'success', user: { ...success.user, goal: 'get fitter', activityLevel: 'level2', weight: 62 } };
    const received = vi.fn();
    repository.loadProfile().subscribe(received);
    const request = http.expectOne(`${BASE_URL}/auth/profile-data`);
    expect(request.request.method).toBe('GET');
    request.flush(profile);
    expect(received).toHaveBeenCalledWith(profile);
  });

  it('returns backend-confirmed user data from a partial metric update', () => {
    const profile = { message: 'success', user: { ...success.user, weight: 50 } };
    const received = vi.fn();
    repository.updateMetric({ weight: 50 }).subscribe(received);
    const request = http.expectOne(`${BASE_URL}/auth/editProfile`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ weight: 50 });
    request.flush(profile);
    expect(received).toHaveBeenCalledWith(profile);
  });

  it('reports failed metric updates through the existing auth error handling', () => {
    const failed = vi.fn();
    repository.updateMetric({ goal: 'lose weight' }).subscribe({ error: failed });
    http.expectOne(`${BASE_URL}/auth/editProfile`).flush(
      { message: 'Invalid goal' }, { status: 400, statusText: 'Bad Request' }
    );
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status: 400, messages: ['Invalid goal'] }));
  });

  describe('signup', () => {
    it('POSTs the payload to /auth/signup', () => {
      repository.signup(signupPayload).subscribe();

      const request = http.expectOne(SIGNUP_URL);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(signupPayload);
      request.flush(success);
    });

    it('passes a successful response through untouched', () => {
      let received: AuthResponse | undefined;
      repository.signup(signupPayload).subscribe((value) => (received = value));

      http.expectOne(SIGNUP_URL).flush(success);
      expect(received).toEqual(success);
    });

    it('turns the API validation string into one message per problem', () => {
      let error: AuthRequestError | undefined;
      repository.signup(signupPayload).subscribe({
        error: (e: AuthRequestError) => (error = e),
      });

      http.expectOne(SIGNUP_URL).flush(
        { error: '"email" must be a valid email,"age" is required' },
        { status: 400, statusText: 'Bad Request' }
      );

      expect(error).toBeInstanceOf(AuthRequestError);
      expect(error?.status).toBe(400);
      expect(error?.messages).toEqual([
        '"email" must be a valid email',
        '"age" is required',
      ]);

      expect(error?.message).toBe('"email" must be a valid email');
    });
  });

  describe('signin', () => {
    it('POSTs only the credentials to /auth/signin', () => {
      repository.signin(signinPayload).subscribe();

      const request = http.expectOne(SIGNIN_URL);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(signinPayload);
      request.flush(success);
    });

    it('returns the token and user on success', () => {
      let received: AuthResponse | undefined;
      repository.signin(signinPayload).subscribe((value) => (received = value));

      http.expectOne(SIGNIN_URL).flush(success);
      expect(received?.token).toBe('a-token');
      expect(received?.user.email).toBe('ada@example.com');
    });

    it('reports the API wording for a 401 rather than a generic message', () => {
      let error: AuthRequestError | undefined;
      repository.signin(signinPayload).subscribe({
        error: (e: AuthRequestError) => (error = e),
      });

      http
        .expectOne(SIGNIN_URL)
        .flush(
          { error: 'incorrect email or password' },
          { status: 401, statusText: 'Unauthorized' }
        );

      expect(error?.status).toBe(401);
      expect(error?.messages).toEqual(['incorrect email or password']);
    });
  });

  describe('password reset', () => {
    it('POSTs the email to /auth/forgotPassword', () => {
      repository.forgotPassword({ email: 'ada@example.com' }).subscribe();

      const request = http.expectOne(`${BASE_URL}/auth/forgotPassword`);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ email: 'ada@example.com' });
      request.flush({ message: 'success' });
    });

    it('POSTs only the code to /auth/verifyResetCode', () => {
      repository.verifyResetCode({ resetCode: '123456' }).subscribe();

      const request = http.expectOne(`${BASE_URL}/auth/verifyResetCode`);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ resetCode: '123456' });
      request.flush({ status: 'Success' });
    });

    it('PUTs the email and new password to /auth/resetPassword', () => {
      const payload = { email: 'ada@example.com', newPassword: 'N3w-Passw0rd' };
      repository.resetPassword(payload).subscribe();

      const request = http.expectOne(`${BASE_URL}/auth/resetPassword`);
      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual(payload);
      request.flush({ message: 'success' });
    });

    it('reports the API wording for an expired code', () => {
      let error: AuthRequestError | undefined;
      repository.verifyResetCode({ resetCode: '000000' }).subscribe({
        error: (e: AuthRequestError) => (error = e),
      });

      http
        .expectOne(`${BASE_URL}/auth/verifyResetCode`)
        .flush(
          { error: 'Reset code is invalid or has expired' },
          { status: 400, statusText: 'Bad Request' }
        );

      expect(error?.status).toBe(400);
      expect(error?.messages).toEqual(['Reset code is invalid or has expired']);
    });
  });

  it('hides the server exception text of a 5xx response', () => {
    let error: AuthRequestError | undefined;
    repository.verifyResetCode({ resetCode: '' }).subscribe({
      error: (e: AuthRequestError) => (error = e),
    });

    http
      .expectOne(`${BASE_URL}/auth/verifyResetCode`)
      .flush(
        { error: 'TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string' },
        { status: 500, statusText: 'Internal Server Error' }
      );

    expect(error?.status).toBe(500);
    expect(error?.messages).toEqual([
      'Something went wrong on our side. Please try again later.',
    ]);
  });

  it('reports a reachability problem when the request never lands', () => {
    let error: AuthRequestError | undefined;
    repository.signin(signinPayload).subscribe({
      error: (e: AuthRequestError) => (error = e),
    });

    http
      .expectOne(SIGNIN_URL)
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown' });

    expect(error?.messages).toEqual([
      'Cannot reach the server. Check your connection.',
    ]);
  });

  it('falls back to a status-based message for an unparseable body', () => {
    let error: AuthRequestError | undefined;
    repository.signup(signupPayload).subscribe({
      error: (e: AuthRequestError) => (error = e),
    });

    http
      .expectOne(SIGNUP_URL)
      .flush(null, { status: 502, statusText: 'Bad Gateway' });

    expect(error?.messages).toEqual(['Request failed (502). Please try again.']);
  });
});
