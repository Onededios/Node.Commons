/**
 * Parses an **ISO-8601 date/time** string (or any format
 * recognised by `Date.parse`).
 *
 * @param value - Raw date literal.
 * @returns     `Date` instance representing the moment in UTC.
 *
 * @throws Error If the input cannot be parsed into a finite date.
 */
export function parseAsDate(value: string): Date {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) throw new Error(`Invalid date: "${value}"`);
  return new Date(ms);
}
