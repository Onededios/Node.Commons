/**
 * Alias for extracting the union of all values from an enum-like object.
 * Useful for semantic clarity.
 *
 * @example
 * enum Status { Active = 1, Inactive = 0 }
 * type StatusType = EnumType<typeof Status>; // 1 | 0
 */
export type EnumType<T extends Record<string, any>> = T[keyof T];
