import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '@super-fitness/data-access-user';
import { DynamicForm } from '@org/ui';
import { REGISTER_STEPPER } from './register-stepper';
import { REGISTER_STEPS } from './register-steps';
import { RegisterPage } from './register-page';

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;

const account = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  password: 'Passw0rd!',
};
const profile = { gender: 'female', age: 36 };
const body = { height: 170, weight: 62 };
const goal = { goal: 'get fitter', activityLevel: 'level3' };

describe('RegisterPage (registration flow)', () => {
  let fixture: ComponentFixture<RegisterPage>;
  let http: HttpTestingController;

  const el = () => fixture.nativeElement as HTMLElement;

  function must<T extends Element = HTMLElement>(selector: string): T {
    const found = el().querySelector<T>(selector);
    if (!found) throw new Error('Expected to find ' + selector);
    return found;
  }
  const headerTitle = () => el().querySelector('lib-auth-header h1')?.textContent?.trim();
  const eyebrow = () =>
    el().querySelector('lib-auth-header .auth-header__eyebrow')?.textContent?.trim();

  function currentForm(): DynamicForm {
    return fixture.debugElement.query(
      (node) => node.nativeElement?.nodeName?.toLowerCase() === 'lib-dynamic-form'
    ).componentInstance as DynamicForm;
  }

  async function submitStep(values: Record<string, unknown>) {
    currentForm().formSubmit.emit(values);
    await fixture.whenStable();
  }

  async function create(providers: unknown[] = []) {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        ...(providers as never[]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => http.verify());

  describe('step 1', () => {
    beforeEach(() => create());

    it('matches the design: header, card title and exactly four inputs', () => {
      expect(eyebrow()).toBe('Hey There');
      expect(headerTitle()).toBe('Create An Account');
      expect(el().querySelector('.auth-title')?.textContent?.trim()).toBe('Register');

      const inputs = Array.from(el().querySelectorAll<HTMLInputElement>('.field-input'));
      expect(inputs.map((i) => i.placeholder)).toEqual([
        'First Name',
        'Last Name',
        'Email',
        'Password',
      ]);
    });

    it('offers the design extras: three socials and a login link', () => {
      expect(el().textContent).not.toContain('Forget Password');
      expect(el().querySelectorAll('app-social-sign-in .social-button').length).toBe(3);
      expect(el().querySelector('.auth-footnote')?.textContent).toContain('Login');
      expect(el().querySelector('.form-submit')?.textContent?.trim()).toBe('Register');
    });

    it('moves on when the user fills the real inputs and presses Register', async () => {
      const type = (placeholder: string, value: string) => {
        const input = must<HTMLInputElement>(`.field-input[placeholder="${placeholder}"]`);
        input.value = value;
        input.dispatchEvent(new Event('input'));
      };
      type('First Name', account.firstName);
      type('Last Name', account.lastName);
      type('Email', account.email);
      type('Password', account.password);
      await fixture.whenStable();

      must<HTMLButtonElement>('.form-submit').click();
      await fixture.whenStable();

      expect(eyebrow()).toBe('Step 2 of 4');
      expect(el().querySelector('app-register-details-step')).toBeTruthy();

      http.expectNone(SIGNUP_URL);
    });

    it('shows every missing field when Register is pressed on an empty form', async () => {
      must<HTMLButtonElement>('.form-submit').click();
      await fixture.whenStable();

      expect(el().querySelectorAll('.field-error').length).toBe(4);
      expect(headerTitle()).toBe('Create An Account');
    });
  });

  describe('the whole flow', () => {
    beforeEach(() => create());

    it('collects every step and POSTs one complete signup payload', async () => {
      await submitStep(account);
      await submitStep(profile);
      await submitStep(body);

      expect(el().querySelector('.form-submit')?.textContent?.trim()).toBe('Create Account');
      await submitStep(goal);

      const request = http.expectOne(SIGNUP_URL);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        ...account,
        rePassword: account.password,
        ...profile,
        ...body,
        ...goal,
      });

      request.flush({
        message: 'success',
        token: 'a-token',
        user: { firstName: 'Ada', lastName: 'Lovelace', email: account.email },
      });
      await fixture.whenStable();

      expect(headerTitle()).toBe('Welcome Aboard');
      expect(el().querySelector('.auth-success')?.textContent).toContain('Welcome, Ada!');
    });

    it('keeps what was typed when going back a step', async () => {
      await submitStep(account);
      await submitStep(profile);

      must<HTMLButtonElement>('.auth-footnote .auth-link').click();
      await fixture.whenStable();

      expect(eyebrow()).toBe('Step 2 of 4');
      expect(currentForm().userForm()['age']().value()).toBe(36);
    });

    it('returns to the step that owns a field the API rejected', async () => {
      await submitStep(account);
      await submitStep(profile);
      await submitStep(body);
      await submitStep(goal);

      http
        .expectOne(SIGNUP_URL)
        .flush(
          { error: '"email" must be a valid email' },
          { status: 400, statusText: 'Bad Request' }
        );
      await fixture.whenStable();

      expect(headerTitle()).toBe('Create An Account');
      expect(el().querySelector('[role=alert]')?.textContent).toContain(
        '"email" must be a valid email'
      );
    });
  });

  describe('as a host for steps defined elsewhere', () => {
    @Component({
      selector: 'app-test-step',
      template: `<button class="custom-next" (click)="stepper.next({ nickname: 'ada' })">Go</button>`,
    })
    class CustomStep {
      readonly stepper = inject(REGISTER_STEPPER);
    }

    it('renders whatever REGISTER_STEPS provides and hands it the stepper', async () => {
      await create([
        {
          provide: REGISTER_STEPS,
          useValue: [
            { id: 'custom', title: 'Pick A Nickname', component: CustomStep, keys: ['nickname'] },
            { id: 'second', title: 'Second Step', component: CustomStep, keys: [] },
          ],
        },
      ]);

      expect(headerTitle()).toBe('Pick A Nickname');
      expect(eyebrow()).toBe('Step 1 of 2');

      must<HTMLButtonElement>('.custom-next').click();
      await fixture.whenStable();

      expect(headerTitle()).toBe('Second Step');
      expect(fixture.componentInstance.draft()).toEqual({ nickname: 'ada' });
    });
  });
});
