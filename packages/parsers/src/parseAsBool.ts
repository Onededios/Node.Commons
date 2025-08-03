/**
 * Parses a string as a **boolean** (`true`/`false`, `1`/`0`, case-insensitive).
 *
 * @param value - Raw value to validate.
 * @returns     `true` or `false`.
 *
 * @throws Error If the input does not match any accepted literal.
 */
export function parseAsBool(value: string): boolean {
  if (/^(1|true)$/i.test(value)) return true;
  if (/^(0|false)$/i.test(value)) return false;
  throw new Error(`Invalid boolean: "${value}"`);
}
