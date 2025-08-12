/**
 * Runtime **enum-like factory** with type-safe helpers.
 *
 * @remarks
 * TypeScript `enum`s disappear at runtime unless you emit `"preserveConstEnums"`
 * or `"isolatedModules": false`.
 * `EnumFactory` lets you create a plain object that behaves like an enum
 * **and** is available at runtime—while still preserving strong typings.
 *
 * @example
 * ```ts
 * // From a list of keys ───────────────────────────────────────────
 * const Color = EnumFactory.create('Red', 'Green', 'Blue');
 * //    ^? { Red: 0, Green: 1, Blue: 2 }
 *
 * // From an existing map ──────────────────────────────────────────
 * const Status = EnumFactory.create({ OPEN: 'O', CLOSED: 'C' });
 *
 * // Helper utilities ──────────────────────────────────────────────
 * EnumFactory.keys(Status);        // ['OPEN', 'CLOSED']
 * EnumFactory.values(Status);      // ['O', 'C']
 * EnumFactory.isValidKey(Status, 'OPEN');    // true
 * EnumFactory.isValidValue(Status, 'X');     // false
 * ```
 */
export class Enum {
  /**
   * Creates an enum from a **variadic list** of string keys.
   *
   * @typeParam T - Tuple of string literals.
   * @param keys  - The enum member names.
   * @returns     Object mapping each key to its ordinal (starting at 0).
   *
   * @example
   * ```ts
   * const Direction = EnumFactory.create('Up', 'Down');
   * // { Up: 0, Down: 1 }
   * ```
   */
  public static create<T extends string[]>(
    ...keys: T
  ): Record<T[number], number>;

  /**
   * Creates an enum from an **existing map** of keys to arbitrary values.
   *
   * @typeParam T - Record representing the desired enum.
   * @param map   - Source map; its keys and values are copied verbatim.
   * @returns     Shallow copy of map.
   *
   * @example
   * ```ts
   * const ResponseCode = EnumFactory.create({ OK: 200, NOT_FOUND: 404 });
   * ```
   */
  public static create<T extends Record<string, string | number>>(map: T): T;

  /**
   * Internal implementation for {@link create}.
   * Chooses the correct strategy based on the argument type.
   *
   * @throws Error if called with neither an object nor string arguments.
   */
  public static create(...args: any[]): any {
    const [firstArg, ...rest] = args;
    if (firstArg == null)
      throw new Error(
        'Invalid arguments! First argument cannot be null or undefined.'
      );

    if (typeof firstArg === 'object' && !Array.isArray(firstArg)) {
      if (Object.prototype.toString.call(firstArg) !== '[object Object]') {
        throw new Error('Invalid map input! Must be a plain object.');
      }
      return { ...firstArg };
    }
    if (typeof firstArg === 'string' || Array.isArray(firstArg)) {
      const keys = Array.isArray(firstArg) ? [firstArg, ...rest].flat() : args;

      if (!keys.every((k) => typeof k === 'string')) {
        throw new Error('Invalid enum key(s)! All keys must be strings.');
      }

      return keys.reduce((acc, key, index) => {
        acc[key] = index;
        return acc;
      }, {} as Record<string, number>);
    }

    throw new Error(
      'Invalid arguments! Must be a string list or an object map.'
    );
  }

  /**
   * Returns a **typed array of values** for a given enum-like object.
   *
   * @param obj - Enum map produced by {@link Enum.create}.
   * @returns   All enumerable property values, cast to `T[]`.
   */
  public static readonly values = <T>(obj: Record<string, any>): T[] =>
    Object.values(obj) as T[];

  /**
   * Returns a **typed array of keys** for a given enum-like object.
   *
   * @param obj - Enum map produced by {@link Enum.create}.
   * @returns   All enumerable property names.
   */
  public static readonly keys = <T extends Record<string, any>>(
    obj: T
  ): (keyof T)[] => Object.keys(obj) as (keyof T)[];

  /**
   * **Type-guard** that checks whether an unknown input is a valid key of the enum.
   *
   * @param obj - Enum map produced by {@link Enum.create}.
   * @param key - Value to validate.
   * @returns   `true` if `key` is a string present in `obj`.
   */
  public static readonly isValidKey = <T extends Record<string, any>>(
    obj: T,
    key: unknown
  ): key is keyof T => typeof key === 'string' && key in obj;

  /**
   * **Type-guard** that checks whether an unknown input is a valid value of the enum.
   *
   * @param obj   - Enum map produced by {@link Enum.create}.
   * @param value - Value to validate.
   * @returns     `true` if `value` is one of {@link Enum.values | `values(obj)`}.
   */
  public static readonly isValidValue = <T extends Record<string, any>>(
    obj: T,
    value: unknown
  ): value is T[keyof T] => Object.values(obj).includes(value as any);
}
