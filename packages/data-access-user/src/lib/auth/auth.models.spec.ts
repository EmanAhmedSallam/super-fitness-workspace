import { PASSWORD_PATTERN, parseAuthError } from './auth.models';

describe('parseAuthError', () => {
  it('splits the API comma-joined error string into one message per problem', () => {
    const body = {
      error:
        '"email" must be a valid email,"gender" is required,"age" must be a number',
    };

    expect(parseAuthError(body)).toEqual([
      '"email" must be a valid email',
      '"gender" is required',
      '"age" must be a number',
    ]);
  });

  it('falls back to `message` when the body has no `error`', () => {
    expect(parseAuthError({ message: 'account already exists' })).toEqual([
      'account already exists',
    ]);
  });

  it('returns nothing for an empty or missing body', () => {
    expect(parseAuthError(null)).toEqual([]);
    expect(parseAuthError(undefined)).toEqual([]);
    expect(parseAuthError({})).toEqual([]);
    expect(parseAuthError({ error: '' })).toEqual([]);
  });
});

describe('PASSWORD_PATTERN', () => {
  it.each([
    ['Passw0rd!', true],
    ['Str0ng#Pass', true],
    ['short1!A', true],
    ['alllowercase1!', false],
    ['ALLUPPERCASE1!', false],
    ['NoDigitsHere!', false],
    ['NoSymbol123', false],
    ['Ab1!', false],
  ])('%s -> %s', (password, expected) => {
    expect(PASSWORD_PATTERN.test(password)).toBe(expected);
  });
});
