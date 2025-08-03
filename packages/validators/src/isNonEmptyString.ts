/**
 * Checks if a value is a non-empty string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a non-empty string, `false` otherwise.
 *
 * @example
 * isNonEmptyString('hello'); // true
 * isNonEmptyString('');      // false
 * isNonEmptyString(123);     // false
 */
export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
