import { describe, it, expect } from 'vitest';
import { isNonEmptyString } from '../src/isNonEmptyString';

describe('isNonEmptyString()', () => {
  const validStrings = ['hello', '  world  ', '123', 'a'];
  const invalidStrings = ['', ' ', null, undefined, 123];

  it('should validate non-empty strings', () => {
    validStrings.forEach((str) => expect(isNonEmptyString(str)).toBe(true));
  });

  it('should invalidate empty or non-string values', () => {
    invalidStrings.forEach((str) => expect(isNonEmptyString(str)).toBe(false));
  });
});
