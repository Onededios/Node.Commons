import { random } from './common';

/**
 * Uniformly selects one element from a **non-empty** list.
 *
 * @typeParam T - Element type of the supplied array.
 * @param array - Candidates to choose from.
 * @returns     A single random element.
 *
 * @throws RangeError If `array` is empty.
 */
export function getRndFromList<T>(array: T[]): T {
  if (array.length === 0) {
    throw new RangeError('Cannot pick from an empty array.');
  }
  const index = random.integer(0, array.length - 1);
  return array[index];
}
