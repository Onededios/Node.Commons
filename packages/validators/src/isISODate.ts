/**
 * Checks if a value is a valid ISO 8601 date string.
 *
 * @param value - The string to validate.
 * @returns `true` if the value is a valid ISO date, `false` otherwise.
 *
 * @example
 * isISODate('2023-08-01T12:00:00Z'); // true
 * isISODate('2023-08-01');           // true
 * isISODate('01/08/2023');           // false
 */
export function isISODate(value: string): boolean {
  const isoDateRegex =
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2}))?$/;
  if (!isoDateRegex.test(value)) return false;

  const date = new Date(value);
  if (isNaN(date.getTime())) return false;

  if (value.length === 10) return date.toISOString().startsWith(value);
  return true;
}
