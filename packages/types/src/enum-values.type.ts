/**
 * Extracts the union of all values from an enum-like object.
 *
 * @example
 * enum Color { Red = "red", Blue = "blue" }
 * type ColorValues = EnumValues<typeof Color>; // "red" | "blue"
 */
export type EnumValues<T> = T[keyof T];
