import { random } from './common';

/**
 * Produces a **random alphanumeric string** of a given length.
 *
 * @param length - Desired string length (must be ≥ 1).
 * @returns      Pseudo-random string, e.g. `'x7B9Qa'`.
 */
export const getRndString = (length: number): string => random.string(length);
