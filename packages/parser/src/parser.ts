import { Validator } from '@onededios/node-commons-validator';
import type { GUID } from '@onededios/node-commons-types';

/**
 * Collection of **parse utilities** that convert untyped user-input
 * strings into strongly-typed JavaScript primitives.
 *
 * @remarks
 * All helpers are **fail-fast** — they validate the input first and
 * throw a descriptive `Error` if the value cannot be parsed, instead of
 * returning `NaN` or an empty object.
 *
 * Typical use-cases include:
 *
 * - Processing environment variables (`process.env.PORT`, `process.env.DEBUG`, …)
 * - Validating query-string or form parameters in a web API
 * - Normalising CLI arguments
 *
 * @example
 * ```ts
 * import { Parser } from './Parser';
 *
 * const enabled  = Parser.parseAsBool('true');         // boolean
 * const attempts = Parser.parseAsInt('3');             // number
 * const price    = Parser.parseAsFloat('19.99');       // number
 * const start    = Parser.parseAsDate('2025-08-01');   // Date
 *
 * // Enum guard
 * type Mode = 'dev' | 'pro';
 * const mode = Parser.parseAsEnum<Mode>('dev', ['dev', 'pro']);
 * ```
 */
export class Parser {
  /**
   * Parses a string as a **boolean** (`true`/`false`, `1`/`0`, case-insensitive).
   *
   * @param value - Raw value to validate.
   * @returns     `true` or `false`.
   *
   * @throws Error If the input does not match any accepted literal.
   */
  public static parseAsBool(value: string): boolean {
    if (/^(1|true)$/i.test(value)) return true;
    if (/^(0|false)$/i.test(value)) return false;
    throw new Error(`Invalid boolean: "${value}"`);
  }

  /**
   * Parses a **base-10 integer** without grouping separators.
   *
   * @param value - Raw value, e.g. `"-42"`.
   * @returns     Parsed integer.
   *
   * @throws Error If the input is not a valid integer literal.
   */
  public static parseAsInt(value: string): number {
    if (!/^-?\d+$/.test(value)) throw new Error(`Invalid integer: "${value}"`);
    return Number(value);
  }

  /**
   * Parses a **floating-point number** (dot as decimal separator).
   *
   * @param value - Raw value, e.g. `"3.1416"`.
   * @returns     Parsed number.
   *
   * @throws Error If the input is not a valid float literal.
   */
  public static parseAsFloat(value: string): number {
    if (!/^-?\d+(\.\d+)?$/.test(value))
      throw new Error(`Invalid float: "${value}"`);
    return Number(value);
  }

  /**
   * Parses an **ISO-8601 date/time** string (or any format
   * recognised by `Date.parse`).
   *
   * @param value - Raw date literal.
   * @returns     `Date` instance representing the moment in UTC.
   *
   * @throws Error If the input cannot be parsed into a finite date.
   */
  public static parseAsDate(value: string): Date {
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) throw new Error(`Invalid date: "${value}"`);
    return new Date(ms);
  }

  /**
   * Parses a JSON-encoded string.
   *
   * @typeParam T - Expected shape of the JSON object.
   * @param value - Raw JSON text.
   * @returns     Parsed value with inferred type `T`.
   *
   * @throws SyntaxError If `JSON.parse` fails.
   */
  public static readonly parseAsJson = <T = unknown>(value: string): T =>
    JSON.parse(value) as T;

  /**
   * Splits a delimited string into **trimmed tokens**.
   *
   * @param value      - Raw delimited text (e.g. `"a, b ,c"`).
   * @param delimiter  - Separator character (default `","`).
   * @returns          Array of trimmed strings.
   */
  public static readonly parseAsCsv = (
    value: string,
    delimiter = ','
  ): string[] => value.split(delimiter).map((s) => s.trim());

  /**
   * Parses a delimited string into a **typed array** by delegating each
   * token to a custom `itemParser`.
   *
   * @typeParam T - Element type after parsing.
   * @param value       - Raw delimited text.
   * @param itemParser  - Function that converts a token into `T`.
   * @returns           Array of parsed elements.
   *
   * @example
   * ```ts
   * // "1|2|3"  ->  [1, 2, 3]
   * Parser.parseAsArray('1|2|3', Number);
   * ```
   */
  public static readonly parseAsArray = <T>(
    value: string,
    itemParser: (raw: string) => T
  ): T[] => Parser.parseAsCsv(value).map(itemParser);

  /**
   * Returns the input **verbatim** ― useful for consistency when all
   * parsers must share the same signature.
   *
   * @param value - Raw string.
   * @returns     The *unchanged* input.
   */
  public static readonly parseAsString = (value: string): string => value;

  /**
   * Validates that a string belongs to a **pre-defined set** of literals.
   *
   * @typeParam T  - Union of allowed values.
   * @param value  - Raw string to check.
   * @param allowed - Read-only list of admissible literals.
   * @returns      The `value` cast to `T` if it is allowed.
   *
   * @throws Error If `value` is not present in {@link allowed}.
   */
  public static parseAsEnum<T extends string>(
    value: string,
    allowed: readonly T[]
  ): T {
    if (allowed.includes(value as T)) return value as T;
    throw new Error(`Invalid value "${value}", allowed: ${allowed.join(', ')}`);
  }

  /**
   * Parses a string as a **{@link GUID}**.
   *
   * @param value - Raw value to validate.
   * @returns GUID
   *
   * @throws Error If the input does not match a {@link GUID}.
   */
  public static parseAsGUID(value: string): GUID {
    if (!Validator.isGUID(value)) throw new Error('Invalid GUID');
    return value;
  }
}
