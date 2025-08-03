import { parseCsvAsObject } from './parseAsObject';

/**
 * Parses a delimited string into a **typed array** by delegating each
 * token to a custom `itemParser`.
 *
 * @typeParam T - Element type after parsing.
 * @param value       - Raw delimited text.
 * @param itemParser  - Function that converts a token into `T`.
 * @returns           Array of parsed elements.
 */
export const parseAsList = <T>(
  value: string,
  itemParser: (raw: string) => T
): T[] => parseCsvAsObject(value).map(itemParser);
