/**
 * Parses a **floating-point number** (dot as decimal separator).
 *
 * @param value - Raw value, e.g. `"3.1416"`.
 * @returns     Parsed number.
 *
 * @throws Error If the input is not a valid float literal.
 */
export function parseAsFloat(value: string): number {
  if (!/^-?\d+(\.\d+)?$/.test(value))
    throw new Error(`Invalid float: "${value}"`);
  return Number(value);
}
