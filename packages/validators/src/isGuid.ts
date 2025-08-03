import { GUID } from '@onededios/node-commons-types';

/**
 * Checks whether a given string matches the structure of a valid GUID.
 *
 * @param value - The string to validate.
 * @returns `true` if the value matches the `8-4-4-4-12` segment pattern, `false` otherwise.
 *
 * @example
 * ```ts
 * isGUID('550e8400-e29b-41d4-a716-446655440000'); // true
 * isGUID('invalid-guid');                        // false
 * ```
 *
 * @remarks
 * This method checks that the input matches the `8-4-4-4-12` segment pattern and that all characters are valid hexadecimal digits (0-9, a-f, A-F), but does not check version bits.
 */
export const isGUID = (value: string): value is GUID =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value
  );
