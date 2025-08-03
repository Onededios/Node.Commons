type Segment<N extends number> = string & { length: N };

/**
 * Strongly-typed GUID (Globally Unique Identifier) string.
 * Enforces the standard GUID format: 8-4-4-4-12 hexadecimal characters.
 *
 * @example
 * const id: GUID = "123e4567-e89b-12d3-a456-426614174000";
 */
export type GUID = `${string & Segment<8>}-${string & Segment<4>}-${string &
  Segment<4>}-${string & Segment<4>}-${string & Segment<12>}`;
