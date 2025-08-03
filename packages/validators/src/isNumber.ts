/**
 * Checks if a value is a valid (finite) number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a finite number, `false` otherwise.
 *
 * @example
 * isNumber(123);      // true
 * isNumber('123');    // false
 * isNumber(NaN);      // false
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
