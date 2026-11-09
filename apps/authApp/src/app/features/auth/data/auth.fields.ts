import { FieldConfig } from '@org/ui';
import { PASSWORD_PATTERN } from '@super-fitness/data-access-user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emailRule(value: unknown): string | null {
  return EMAIL_PATTERN.test(String(value)) ? null : 'auth.validation.email';
}

function passwordRule(value: unknown): string | null {
  return PASSWORD_PATTERN.test(String(value))
    ? null
    : 'auth.validation.password';
}

/** Rules return i18n keys; `translateFields` resolves them at render time. */
const MIN_LENGTH_KEYS: Readonly<Record<number, string>> = {
  2: 'auth.validation.minLength2',
};

function minLengthRule(min: number) {
  return (value: unknown): string | null =>
    String(value).trim().length >= min ? null : MIN_LENGTH_KEYS[min];
}

export const LOGIN_FIELDS: FieldConfig[] = [
  {
    key: 'email',
    type: 'email',
    label: 'auth.login.email',
    placeholder: 'auth.login.email',
    icon: 'email',
    autocomplete: 'email',
    hideLabel: true,
    required: true,
    validate: emailRule,
  },
  {
    key: 'password',
    type: 'password',
    label: 'auth.login.password',
    placeholder: 'auth.login.password',
    icon: 'lock',
    autocomplete: 'current-password',
    hideLabel: true,
    required: true,
  },
];

export const FORGOT_PASSWORD_FIELDS: FieldConfig[] = [
  {
    key: 'email',
    type: 'email',
    label: 'auth.fields.email',
    placeholder: 'auth.fields.email',
    icon: 'email',
    autocomplete: 'email',
    hideLabel: true,
    required: true,
    validate: (value) => emailRule(value) && 'auth.validation.email',
  },
];

export const RESET_PASSWORD_FIELDS: FieldConfig[] = [
  {
    key: 'password',
    type: 'password',
    label: 'auth.fields.password',
    placeholder: 'auth.fields.password',
    icon: 'lock',
    autocomplete: 'new-password',
    hideLabel: true,
    required: true,
    validate: (value) => passwordRule(value) && 'auth.validation.password',
  },
  {
    key: 'rePassword',
    type: 'password',
    label: 'auth.fields.rePassword',
    placeholder: 'auth.fields.rePassword',
    icon: 'lock',
    autocomplete: 'new-password',
    hideLabel: true,
    required: true,
    validate: (value, model) =>
      value === model['password'] ? null : 'auth.validation.passwordMismatch',
  },
];

export const REGISTER_ACCOUNT_FIELDS: FieldConfig[] = [
  {
    key: 'firstName',
    type: 'text',
    label: 'auth.register.account.firstName',
    placeholder: 'auth.register.account.firstName',
    icon: 'user',
    autocomplete: 'given-name',
    hideLabel: true,
    required: true,
    validate: minLengthRule(2),
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'auth.register.account.lastName',
    placeholder: 'auth.register.account.lastName',
    icon: 'user',
    autocomplete: 'family-name',
    hideLabel: true,
    required: true,
    validate: minLengthRule(2),
  },
  {
    key: 'email',
    type: 'email',
    label: 'auth.register.account.email',
    placeholder: 'auth.register.account.email',
    icon: 'email',
    autocomplete: 'email',
    hideLabel: true,
    required: true,
    validate: emailRule,
  },
  {
    key: 'password',
    type: 'password',
    label: 'auth.register.account.password',
    placeholder: 'auth.register.account.password',
    icon: 'lock',
    autocomplete: 'new-password',
    hideLabel: true,
    required: true,
    validate: passwordRule,
  },
];

export const CHANGE_PASSWORD_FIELDS: FieldConfig[] = [
  {
    key: 'password',
    type: 'password',
    label: 'auth.changePassword.currentPassword',
    placeholder: 'auth.changePassword.currentPassword',
    icon: 'lock',
    autocomplete: 'current-password',
    hideLabel: true,
    required: true,
  },
  {
    key: 'newPassword',
    type: 'password',
    label: 'auth.changePassword.newPassword',
    placeholder: 'auth.changePassword.newPasswordPlaceholder',
    icon: 'lock',
    autocomplete: 'new-password',
    hideLabel: true,
    required: true,
    validate: passwordRule,
  },
];

