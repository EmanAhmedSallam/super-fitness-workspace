import { provideTranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicForm } from './dynamic-form';
import { FieldConfig } from '../../models/field-types';

describe('DynamicForm', () => {
  let fixture: ComponentFixture<DynamicForm>;
  let component: DynamicForm;

  const fields: FieldConfig[] = [
    { key: 'firstName', type: 'text', label: 'First name', required: true, row: 0 },
    { key: 'lastName', type: 'text', label: 'Last name', required: true, row: 0 },
    { key: 'email', type: 'email', label: 'Email', required: true, row: 1 },
    { key: 'age', type: 'number', label: 'Age', row: 2 },
  ];

  async function setFields(value: FieldConfig[] = fields) {
    fixture.componentRef.setInput('fields', value);
    await fixture.whenStable();
  }

  function submit() {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicForm],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('groups fields that share a row and keeps the rest on their own', async () => {
    await setFields();

    const rows = component.groupedFields();
    expect(rows.map((row) => row.map((f) => f.key))).toEqual([
      ['firstName', 'lastName'],
      ['email'],
      ['age'],
    ]);
  });

  it('omits fields hidden in the current mode', async () => {
    fixture.componentRef.setInput('mode', 'update');
    await setFields([
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'password', type: 'password', label: 'Password', hiddenIn: ['update'] },
    ]);

    expect(component.groupedFields().flat().map((f) => f.key)).toEqual(['email']);
  });

  it('blocks submit while a required field is empty', async () => {
    await setFields();
    const emitted = vi.fn();
    component.formSubmit.subscribe(emitted);

    submit();
    await fixture.whenStable();

    expect(emitted).not.toHaveBeenCalled();
    expect(component.userForm()().touched()).toBe(true);
  });

  it('emits the model once every required field is filled', async () => {
    await setFields();
    const emitted = vi.fn();
    component.formSubmit.subscribe(emitted);

    fixture.componentRef.setInput('initialData', {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      age: '36',
    });
    await fixture.whenStable();

    submit();
    await fixture.whenStable();

    expect(emitted).toHaveBeenCalledTimes(1);
    expect(emitted.mock.calls[0][0]).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',

      age: 36,
    });
  });

  it('drops fields flagged excludeFromSubmit from the payload', async () => {
    await setFields([
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'confirm', type: 'text', label: 'Confirm', excludeFromSubmit: true },
    ]);
    const emitted = vi.fn();
    component.formSubmit.subscribe(emitted);

    fixture.componentRef.setInput('initialData', {
      email: 'ada@example.com',
      confirm: 'ignored',
    });
    await fixture.whenStable();

    submit();
    await fixture.whenStable();

    expect(emitted.mock.calls[0][0]).toEqual({ email: 'ada@example.com' });
  });

  it('rejects a value its custom validator refuses', async () => {
    await setFields([
      {
        key: 'password',
        type: 'password',
        label: 'Password',
        required: true,
        validate: (value) =>
          String(value).length >= 8 ? null : 'Too short.',
      },
    ]);

    fixture.componentRef.setInput('initialData', { password: 'short' });
    await fixture.whenStable();

    const control = component.userForm()['password'];
    expect(control().invalid()).toBe(true);
    expect(control().errors()[0]?.message).toBe('Too short.');
  });

  it('lets a custom validator read another field, for confirmation inputs', async () => {
    await setFields([
      { key: 'password', type: 'password', label: 'Password', required: true },
      {
        key: 'rePassword',
        type: 'password',
        label: 'Confirm',
        required: true,
        validate: (value, model) =>
          value === model['password'] ? null : 'Passwords do not match.',
      },
    ]);

    fixture.componentRef.setInput('initialData', {
      password: 'Passw0rd!',
      rePassword: 'different',
    });
    await fixture.whenStable();

    expect(component.userForm()['rePassword']().invalid()).toBe(true);

    fixture.componentRef.setInput('initialData', {
      password: 'Passw0rd!',
      rePassword: 'Passw0rd!',
    });
    await fixture.whenStable();

    expect(component.userForm()['rePassword']().invalid()).toBe(false);
  });

  it('leaves the empty case to required rather than the custom validator', async () => {
    const custom = vi.fn().mockReturnValue('never shown');
    await setFields([
      { key: 'email', type: 'email', label: 'Email', required: true, validate: custom },
    ]);

    expect(custom).not.toHaveBeenCalled();
    expect(component.userForm()['email']().errors()[0]?.message).toBe(
      'Email is required'
    );
  });

  it('shows the loading label and blocks submit while the host is submitting', async () => {
    await setFields([{ key: 'email', type: 'email', label: 'Email' }]);
    fixture.componentRef.setInput('submitLabel', 'Create Account');
    fixture.componentRef.setInput('loadingLabel', 'Creating account...');
    await fixture.whenStable();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.form-submit');
    expect(button.textContent?.trim()).toBe('Create Account');

    fixture.componentRef.setInput('submitting', true);
    await fixture.whenStable();

    expect(button.textContent?.trim()).toBe('Creating account...');
    expect(button.disabled).toBe(true);
  });

  it('starts number fields at null so their placeholder is not hidden by a 0', async () => {
    await setFields([
      { key: 'age', type: 'number', label: 'Age' },
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'subscribe', type: 'checkbox', label: 'Subscribe' },
    ]);

    expect(component.userForm()['age']().value()).toBeNull();
    expect(component.userForm()['email']().value()).toBe('');
    expect(component.userForm()['subscribe']().value()).toBe(false);
  });

  it('submits an untouched optional number as null rather than NaN', async () => {
    await setFields([
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'age', type: 'number', label: 'Age' },
    ]);
    const emitted = vi.fn();
    component.formSubmit.subscribe(emitted);

    fixture.componentRef.setInput('initialData', { email: 'ada@example.com' });
    await fixture.whenStable();

    submit();
    await fixture.whenStable();

    expect(emitted.mock.calls[0][0]).toEqual({
      email: 'ada@example.com',
      age: null,
    });
  });

  it('disables submit while invalid by default', async () => {
    await setFields();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.form-submit');
    expect(button.disabled).toBe(true);
  });

  it('can keep submit enabled so an invalid submit reveals every field error', async () => {
    await setFields();
    fixture.componentRef.setInput('disableSubmitWhenInvalid', false);
    await fixture.whenStable();
    const emitted = vi.fn();
    component.formSubmit.subscribe(emitted);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.form-submit');
    expect(button.disabled).toBe(false);

    button.click();
    await fixture.whenStable();

    expect(emitted).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(3);
  });

  it('reset() clears every field back to its empty value', async () => {
    await setFields([
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'subscribe', type: 'checkbox', label: 'Subscribe' },
    ]);
    fixture.componentRef.setInput('initialData', {
      email: 'ada@example.com',
      subscribe: true,
    });
    await fixture.whenStable();

    component.reset();
    await fixture.whenStable();

    expect(component.userForm()['email']().value()).toBe('');
    expect(component.userForm()['subscribe']().value()).toBe(false);
  });
});
