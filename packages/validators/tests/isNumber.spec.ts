import { describe, expect, it } from 'vitest';
import { isNumber } from '../src/isNumber';

describe('isNumber()', () => {
  const validNumbers = [123, -456, 0, 3.14, Number.MAX_VALUE];
  const invalidNumbers = ['123', 'abc', NaN, Infinity, null, undefined];

  it('should validate correct numbers', () => {
    validNumbers.forEach((num) => expect(isNumber(num)).toBe(true));
  });

  it('should invalidate incorrect numbers', () => {
    invalidNumbers.forEach((num) => expect(isNumber(num)).toBe(false));
  });
});
