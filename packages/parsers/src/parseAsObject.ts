/**
 * Parses a JSON-encoded string.
 *
 * @typeParam T - Expected shape of the JSON object.
 * @param value - Raw JSON text.
 * @returns     Parsed value with inferred type `T`.
 *
 * @throws SyntaxError If `JSON.parse` fails.
 */
export const parseJsonAsObject = <T = unknown>(value: string): T =>
  JSON.parse(value) as T;

/**
 * Splits a delimited string into **trimmed tokens**.
 *
 * @param value      - Raw delimited text (e.g. `"a, b ,c"`).
 * @param delimiter  - Separator character (default `","`).
 * @returns          Array of trimmed strings.
 */
export const parseCsvAsObject = (value: string, delimiter = ','): string[] =>
  value.split(delimiter).map((s) => s.trim());
