import { provideTranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { PasswordField } from './password-field';
import { PasswordFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('PasswordField', () => {
  const base: PasswordFieldConfig = {
    key: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    icon: 'lock',
    required: true,
  };

  async function render(field: PasswordFieldConfig = base) {
    const fixture = TestBed.createComponent(PasswordField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(''));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordField],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label with a required marker', async () => {
    const fixture = await render();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent?.trim()).toBe('Password *');
  });

  it('masks the value by default', async () => {
    const fixture = await render();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');
  });

  it('reveals and re-masks the value with the eye toggle', async () => {
    const fixture = await render();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.field-toggle');

    expect(toggle.getAttribute('aria-label')).toBe('form.showPassword');
    toggle.click();
    await fixture.whenStable();
    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('form.hidePassword');

    toggle.click();
    await fixture.whenStable();
    expect(input.type).toBe('password');
  });

  it('renders the leading icon only when one is configured', async () => {
    const withIcon = await render();
    expect(withIcon.nativeElement.querySelector('.field-icon lib-field-icon')).toBeTruthy();

    const plain = await render({ ...base, icon: undefined });
    expect(plain.nativeElement.querySelector('.field-icon')).toBeNull();
  });
});
