import { GUID } from '@onededios/node-commons-types';
import { isGUID } from '@onededios/node-commons-validators';

/**
 * Parses a string as a **{@link GUID}**.
 *
 * @param value - Raw value to validate.
 * @returns GUID
 *
 * @throws Error If the input does not match a {@link GUID}.
 */
export function parseAsGUID(value: string): GUID {
  if (!isGUID(value)) throw new Error('Invalid GUID');
  return value;
}
