import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { DynamicForm } from '@org/ui';
import { API_BASE_URL } from '@super-fitness/data-access-user';
import { remoteRoutes } from '../../../remote-entry/entry.routes';
import { PasswordResetState } from './password-reset.state';
import en from '../../../../../public/assets/i18n/auth/en.json';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const EMAIL = 'ada@example.com';
const CODE = '1234';

describe('Forgot password flow', () => {
  let harness: RouterTestingHarness;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'auth', children: remoteRoutes }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    });

    TestBed.inject(TranslateService).setTranslation('en', en);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => http.verify());

  function form(): DynamicForm {
    return harness.fixture.debugElement.query(By.directive(DynamicForm))
      .componentInstance as DynamicForm;
  }

  async function settle(): Promise<void> {
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  async function typeCode(code: string): Promise<void> {
    const cells: HTMLInputElement[] = Array.from(
      harness.routeNativeElement!.querySelectorAll('.otp-cell')
    );
    code.split('').forEach((digit, i) => {
      cells[i].value = digit;
      cells[i].dispatchEvent(new Event('input'));
    });
    await settle();
  }

  async function sendCode(): Promise<void> {
    await harness.navigateByUrl('/auth/forgot-password');
    form().formSubmit.emit({ email: EMAIL });
    await settle();

    http.expectOne(`${BASE_URL}/auth/forgotPassword`).flush({ message: 'success' });
    await settle();
  }

  it('does not open the code or password steps directly', async () => {
    await harness.navigateByUrl('/auth/forgot-password/otp');
    expect(router.url).toBe('/auth/forgot-password');

    await harness.navigateByUrl('/auth/forgot-password/reset-password');
    expect(router.url).toBe('/auth/forgot-password');
  });

  it('keeps the user on the email step when the account does not exist', async () => {
    await harness.navigateByUrl('/auth/forgot-password');
    form().formSubmit.emit({ email: EMAIL });
    await settle();

    http
      .expectOne(`${BASE_URL}/auth/forgotPassword`)
      .flush(
        { error: `There is no account with this email address ${EMAIL}` },
        { status: 404, statusText: 'Not Found' }
      );
    await settle();

    expect(router.url).toBe('/auth/forgot-password');
    expect(harness.routeNativeElement!.querySelector('.auth-errors')?.textContent).toContain(
      'There is no account with this email address.'
    );
  });

  it('stays on the code step when the code is rejected', async () => {
    await sendCode();
    expect(router.url).toBe('/auth/forgot-password/otp');

    await typeCode('0000');
    http
      .expectOne(`${BASE_URL}/auth/verifyResetCode`)
      .flush(
        { error: 'Reset code is invalid or has expired' },
        { status: 400, statusText: 'Bad Request' }
      );
    await settle();

    expect(router.url).toBe('/auth/forgot-password/otp');
    expect(harness.routeNativeElement!.querySelector('.auth-errors')?.textContent).toContain(
      'invalid or has expired'
    );

    await harness.navigateByUrl('/auth/forgot-password/reset-password');
    expect(router.url).toBe('/auth/forgot-password/otp');
  });

  it('resends the code to the same email', async () => {
    await sendCode();

    (harness.routeNativeElement!.querySelector('.auth-footnote button') as HTMLButtonElement).click();
    await settle();

    const request = http.expectOne(`${BASE_URL}/auth/forgotPassword`);
    expect(request.request.body).toEqual({ email: EMAIL });
    request.flush({ message: 'success' });
    await settle();

    expect(harness.routeNativeElement!.querySelector('.auth-notice')?.textContent).toContain(
      `A new code was sent to ${EMAIL}.`
    );
  });

  it('walks email → code → new password, then clears the flow', async () => {
    await sendCode();
    expect(router.url).toBe('/auth/forgot-password/otp');

    await typeCode(CODE);
    const verify = http.expectOne(`${BASE_URL}/auth/verifyResetCode`);
    expect(verify.request.body).toEqual({ resetCode: CODE });
    verify.flush({ status: 'Success' });
    await settle();

    expect(router.url).toBe('/auth/forgot-password/reset-password');

    form().formSubmit.emit({ password: 'N3w-Passw0rd', rePassword: 'N3w-Passw0rd' });
    await settle();

    const reset = http.expectOne(`${BASE_URL}/auth/resetPassword`);
    expect(reset.request.method).toBe('PUT');
    expect(reset.request.body).toEqual({ email: EMAIL, newPassword: 'N3w-Passw0rd' });
    reset.flush({ message: 'success' });
    await settle();

    const root = harness.routeNativeElement!;
    expect(root.querySelector('.auth-success')).not.toBeNull();
    expect(root.querySelector('.auth-success a')?.getAttribute('href')).toBe('/auth/login');
    expect(TestBed.inject(PasswordResetState).canReset()).toBe(false);
  });

  it('forgets the flow once the user leaves it', async () => {
    await sendCode();
    const state = TestBed.inject(PasswordResetState);
    expect(state.codeSent()).toBe(true);

    await harness.navigateByUrl('/auth/login');
    expect(state.codeSent()).toBe(false);
  });
});
