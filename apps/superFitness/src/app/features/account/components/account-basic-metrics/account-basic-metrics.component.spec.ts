import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { API_BASE_URL, AuthSession, AuthenticatedUser } from '@super-fitness/data-access-user';
import en from '../../../../../../public/assets/i18n/fitness/en.json';
import ar from '../../../../../../public/assets/i18n/fitness/ar.json';
import { AccountBasicMetrics } from './account-basic-metrics.component';

function element<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const result = root.querySelector<T>(selector);
  if (!result) throw new Error(`Missing element: ${selector}`);
  return result;
}

const BASE_URL = 'https://fitness.elevateegy.com/api/v1';
const user: AuthenticatedUser = {
  firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com',
  goal: 'get fitter', activityLevel: 'level2', weight: 62,
};

describe('AccountBasicMetrics', () => {
  let fixture: ComponentFixture<AccountBasicMetrics>;
  let http: HttpTestingController;
  let session: AuthSession;
  let host: HTMLElement;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AccountBasicMetrics],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideTranslateService(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('ar', ar);
    translate.use('en');
    session = TestBed.inject(AuthSession);
    session.save({ message: 'success', token: 'original-token', user });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AccountBasicMetrics);
    host = fixture.nativeElement;
    fixture.detectChanges();
    dialog = element<HTMLDialogElement>(host, 'dialog');
    Object.defineProperty(dialog, 'showModal', { value: () => dialog.setAttribute('open', '') });
    Object.defineProperty(dialog, 'close', { value: () => {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    } });
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  async function load(profile = user) {
    http.expectOne(`${BASE_URL}/auth/profile-data`).flush({ message: 'success', user: profile });
    await fixture.whenStable();
  }

  async function open(metric: string) {
    element<HTMLButtonElement>(host, `[data-metric="${metric}"]`).click();
    await fixture.whenStable();
  }

  async function choose(value: string) {
    element<HTMLInputElement>(dialog, `input[value="${value}"]`).click();
    await fixture.whenStable();
  }

  function submit() {
    element(dialog, 'form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  it('fetches and displays the saved profile with human-readable labels', async () => {
    expect(host.textContent).toContain('Loading your profile');
    await load();
    expect(host.textContent).toContain('Get Fitter');
    expect(host.textContent).toContain('Beginner');
    expect(host.textContent).toContain('62 KG');
    expect(host.textContent).not.toContain('level2');
    expect(session.token()).toBe('original-token');
  });

  it.each(['goal', 'activityLevel', 'weight'])('opens %s only from its accessible TAP TO CHANGE button', async (metric) => {
    await load();
    const box = element(host, `[data-metric-value="${metric}"]`);
    const icon = element<SVGElement>(box, 'svg');
    const value = element(box, 'span');
    expect(box.tagName).toBe('DIV');
    expect(box.hasAttribute('role')).toBe(false);
    expect(box.hasAttribute('tabindex')).toBe(false);
    box.click();
    value.click();
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(icon.getAttribute('width')).toBe('18');
    expect(icon.getAttribute('height')).toBe('21');
    expect(element<SVGPathElement>(icon, 'path').getAttribute('fill')).toBe('currentColor');

    const trigger = element<HTMLButtonElement>(host, `[data-metric="${metric}"]`);
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.type).toBe('button');
    expect(trigger.textContent?.trim()).toBe('TAP TO CHANGE');
    expect(trigger.getAttribute('aria-labelledby')).toBe(`${metric}-title ${metric}-hint`);
    expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    await open(metric);
    expect(dialog.open).toBe(true);
    if (metric === 'weight') {
      expect(element<HTMLInputElement>(dialog, '#account-weight').value).toBe('62');
    } else {
      expect(element<HTMLInputElement>(dialog, 'input:checked').value).toBe(user[metric === 'goal' ? 'goal' : 'activityLevel']);
    }
    http.expectNone(`${BASE_URL}/auth/editProfile`);
  });

  it.each([
    ['goal', 'get fitter', 'lose weight', { goal: 'lose weight' }],
    ['activityLevel', 'level2', 'level4', { activityLevel: 'level4' }],
  ])('preselects and saves %s only after confirmation', async (metric, current, selected, payload) => {
    await load();
    await open(metric);
    expect(element<HTMLInputElement>(dialog, `input[value="${current}"]`).checked).toBe(true);
    await choose(selected);
    submit();
    const request = http.expectOne(`${BASE_URL}/auth/editProfile`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    expect(session.user()).toEqual(user);
    submit();
    http.expectNone(`${BASE_URL}/auth/editProfile`);
    request.flush({ message: 'success', user: { ...user, ...payload } });
    await fixture.whenStable();
    expect(session.user()).toEqual({ ...user, ...payload });
    expect(session.token()).toBe('original-token');
    expect(dialog.open).toBe(false);
    expect(JSON.parse(localStorage.getItem('super-fitness.user') ?? '{}')).toEqual({ ...user, ...payload });
  });

  it('saves numeric weight using the existing selector and matching validation', async () => {
    await load();
    await open('weight');
    expect(dialog.querySelector('lib-numeric-wheel-selector')).not.toBeNull();
    const input = element<HTMLInputElement>(dialog, '#account-weight');
    expect(input.value).toBe('62');
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    submit();
    const request = http.expectOne(`${BASE_URL}/auth/editProfile`);
    expect(request.request.body).toEqual({ weight: 50 });
    request.flush({ message: 'success', user: { ...user, weight: 50 } });
    await fixture.whenStable();
    expect(host.textContent).toContain('50 KG');
  });

  it('preserves saved weight outside the registration range without clamping', async () => {
    await load({ ...user, weight: 220 });
    await open('weight');
    expect(element<HTMLInputElement>(dialog, '#account-weight').value).toBe('220');
    expect(dialog.querySelector('lib-numeric-wheel-selector')).toBeNull();
    submit();
    http.expectNone(`${BASE_URL}/auth/editProfile`);
    expect(session.user()?.weight).toBe(220);
  });

  it('keeps saved values on failure and allows retrying the draft', async () => {
    await load();
    await open('goal');
    await choose('lose weight');
    submit();
    http.expectOne(`${BASE_URL}/auth/editProfile`).flush({ message: 'Rejected' }, { status: 400, statusText: 'Bad Request' });
    await fixture.whenStable();
    expect(session.user()?.goal).toBe('get fitter');
    expect(dialog.open).toBe(true);
    expect(dialog.querySelector('[role="alert"]')?.textContent).toContain('could not accept');
    expect(element<HTMLInputElement>(dialog, 'input[value="lose weight"]').checked).toBe(true);
    submit();
    http.expectOne(`${BASE_URL}/auth/editProfile`).flush({ message: 'success', user: { ...user, goal: 'lose weight' } });
    await fixture.whenStable();
  });

  it('cancels without saving and restores focus to the metric button', async () => {
    await load();
    await open('goal');
    await choose('lose weight');
    const trigger = element<HTMLButtonElement>(host, '[data-metric="goal"]');
    const focus = vi.spyOn(trigger, 'focus');
    element<HTMLButtonElement>(dialog, 'button[type="button"]').click();
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(focus).toHaveBeenCalled();
    expect(session.user()?.goal).toBe('get fitter');
    http.expectNone(`${BASE_URL}/auth/editProfile`);
  });

  it('prevents Escape from closing an editor while its request is pending', async () => {
    await load();
    await open('goal');
    await choose('lose weight');
    submit();
    const event = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    http.expectOne(`${BASE_URL}/auth/editProfile`).flush({ message: 'success', user: { ...user, goal: 'lose weight' } });
    await fixture.whenStable();
  });

  it('switches to Arabic without losing unsaved selection', async () => {
    await load();
    await open('activityLevel');
    await choose('level4');
    TestBed.inject(TranslateService).use('ar');
    await fixture.whenStable();
    expect(host.textContent).toContain('هدفك');
    expect(host.textContent).toContain('مبتدئ');
    expect(element(host, '[data-metric="activityLevel"]').textContent?.trim()).toBe('اضغط للتغيير');
    expect(element<HTMLInputElement>(dialog, 'input[value="level4"]').checked).toBe(true);
    expect(host.textContent).not.toContain('account.');
  });

  it('does not invent values for a profile with missing metrics', async () => {
    await load({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', goal: undefined, activityLevel: undefined, weight: undefined });
    expect(host.textContent).toContain('Not available');
    expect(host.textContent).not.toContain('70 KG');
    await open('weight');
    expect(element<HTMLInputElement>(dialog, '#account-weight').value).toBe('');
    submit();
    http.expectNone(`${BASE_URL}/auth/editProfile`);
  });

  it('shows load errors and fetches fresh data when retried', async () => {
    http.expectOne(`${BASE_URL}/auth/profile-data`).error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Cannot reach');
    element<HTMLButtonElement>(host, 'lib-site-button button').click();
    await load({ ...user, weight: 51 });
    expect(host.textContent).toContain('51 KG');
  });
});
