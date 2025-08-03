/**
 * Parses a **base-10 integer** without grouping separators.
 *
 * @param value - Raw value, e.g. `"-42"`.
 * @returns     Parsed integer.
 *
 * @throws Error If the input is not a valid integer literal.
 */
export function parseAsInt(value: string): number {
  if (!/^-?\d+$/.test(value)) throw new Error(`Invalid integer: "${value}"`);
  return Number(value);
}
