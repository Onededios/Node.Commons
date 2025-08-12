/**
 * Extracts the union of all keys from an enum-like object.
 *
 * @example
 * enum Color { Red = "red", Blue = "blue" }
 * type ColorKeys = EnumKeys<typeof Color>; // "Red" | "Blue"
 */
export type EnumKeys<T> = keyof T;
