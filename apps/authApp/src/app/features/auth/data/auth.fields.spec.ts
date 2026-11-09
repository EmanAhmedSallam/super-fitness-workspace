import { FieldConfig } from '@org/ui';
import { LOGIN_FIELDS, REGISTER_ACCOUNT_FIELDS } from './auth.fields';

function byKey(fields: FieldConfig[], key: string): FieldConfig {
  const field = fields.find((f) => f.key === key);
  if (!field) throw new Error(`No field configured for "${key}"`);
  return field;
}

function check(field: FieldConfig, value: unknown, model: Record<string, unknown> = {}) {
  return field.validate?.(value, model) ?? null;
}

describe('LOGIN_FIELDS', () => {
  it('asks only for the credentials the design shows', () => {
    expect(LOGIN_FIELDS.map((f) => f.key)).toEqual(['email', 'password']);
  });

  it('keeps labels available to screen readers behind the placeholder-only design', () => {
    for (const field of LOGIN_FIELDS) {
      expect(field.label, field.key).toBeTruthy();
      expect(field.hideLabel, field.key).toBe(true);
    }
  });

  it('lets password managers fill an existing account', () => {
    expect(byKey(LOGIN_FIELDS, 'password').autocomplete).toBe('current-password');
  });
});

describe('REGISTER_ACCOUNT_FIELDS (step 1)', () => {
  it('holds exactly the four fields of the design, in its order', () => {
    expect(REGISTER_ACCOUNT_FIELDS.map((f) => f.key)).toEqual([
      'firstName',
      'lastName',
      'email',
      'password',
    ]);
  });

  it('stacks them one per row, as drawn', () => {
    expect(REGISTER_ACCOUNT_FIELDS.every((f) => f.row === undefined)).toBe(true);
  });

  it('asks password managers to suggest a new password', () => {
    expect(byKey(REGISTER_ACCOUNT_FIELDS, 'password').autocomplete).toBe('new-password');
  });
});

describe('REGISTER_ACCOUNT_FIELDS validation', () => {
  it('requires every field', () => {
    for (const field of REGISTER_ACCOUNT_FIELDS) {
      expect(field.required, field.key).toBe(true);
    }
  });

  it('rejects a malformed email', () => {
    const email = byKey(REGISTER_ACCOUNT_FIELDS, 'email');
    expect(check(email, 'ada@example.com')).toBeNull();
    expect(check(email, 'not-an-email')).toBe('auth.validation.email');
  });

  it('enforces the API password pattern', () => {
    const password = byKey(REGISTER_ACCOUNT_FIELDS, 'password');
    expect(check(password, 'Passw0rd!')).toBeNull();
    expect(check(password, 'weakpass')).toBe('auth.validation.password');
  });

  it('requires a real name rather than a single character', () => {
    const firstName = byKey(REGISTER_ACCOUNT_FIELDS, 'firstName');
    expect(check(firstName, 'Ada')).toBeNull();
    expect(check(firstName, 'A')).toBe('auth.validation.minLength2');
  });
});
