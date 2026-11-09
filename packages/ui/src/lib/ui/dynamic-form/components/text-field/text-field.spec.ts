import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextField } from './text-field';
import { TextFieldConfig } from '../../../../models/field-types';
import { fieldControl } from '../../../../../testing/field-control';

describe('TextField', () => {
  const base: TextFieldConfig = {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Email',
    required: true,
  };

  async function render(
    field: TextFieldConfig = base,
    initial: string | number = ''
  ): Promise<ComponentFixture<TextField>> {
    const fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('control', fieldControl(initial));
    await fixture.whenStable();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextField],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a labelled input of the configured type', async () => {
    const fixture = await render();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(label.textContent?.trim()).toBe('Email *');
    expect(label.getAttribute('for')).toBe('email');
    expect(input.id).toBe('email');
    expect(input.type).toBe('email');
    expect(input.placeholder).toBe('Email');
  });

  it('keeps a hidden label reachable for screen readers', async () => {
    const fixture = await render({ ...base, hideLabel: true });

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label).toBeTruthy();
    expect(label.classList.contains('sr-only')).toBe(true);
  });

  it('renders the leading icon only when one is configured', async () => {
    const withIcon = await render({ ...base, icon: 'email' });
    expect(withIcon.nativeElement.querySelector('lib-field-icon')).toBeTruthy();
    expect(
      withIcon.nativeElement.querySelector('.field-input-shell.has-icon')
    ).toBeTruthy();

    const plain = await render();
    expect(plain.nativeElement.querySelector('lib-field-icon')).toBeNull();
  });

  it('uses a native number input for numeric fields', async () => {
    const fixture = await render({ ...base, key: 'age', type: 'number', label: 'Age' }, 0);
    expect(fixture.nativeElement.querySelector('input').type).toBe('number');
  });

  it('only reports an error once the field is touched, and links it for screen readers', async () => {
    const control = fieldControl('', { required: true });
    const fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('field', base);
    fixture.componentRef.setInput('control', control);
    await fixture.whenStable();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(fixture.nativeElement.querySelector('.field-error')).toBeNull();
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    control().markAsTouched();
    await fixture.whenStable();

    const error: HTMLElement = fixture.nativeElement.querySelector('.field-error');
    expect(error.textContent?.trim()).toBe('Required.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('writes what the user types back into the form', async () => {
    const control = fieldControl('');
    const fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('field', base);
    fixture.componentRef.setInput('control', control);
    await fixture.whenStable();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'ada@example.com';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(control().value()).toBe('ada@example.com');
  });
});
