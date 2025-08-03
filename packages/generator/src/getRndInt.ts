import { random } from './common';

/**
 * Returns a **random integer** within the inclusive range `[min, max]`.
 *
 * @param min - Lower bound (default `1`).
 * @param max - Upper bound (default `10000`).
 * @returns   Number such that `min ≤ n ≤ max`.
 */
export const getRndInt = (min = 1, max = 10000): number =>
  random.integer(min, max);
