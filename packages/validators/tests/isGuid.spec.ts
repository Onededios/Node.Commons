import { describe, it, expect } from 'vitest';
import { isGUID } from '../src/isGuid';

describe('isGUID()', () => {
  const invalidGuids = [
    '123e4567-e89b-12d3-a456-42661417400',
    '550e8400-e29b-41d4-a716-44665544000x',
    '550e8400-e29b-41d4-a716-4466554400000',
    'invalid-guid',
    '550e8400-e29b-41d4-a716-44665544000',
  ];
  const validGuids = [
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174001',
  ];

  it('should validate correct GUIDs', () => {
    validGuids.forEach((guid) => expect(isGUID(guid)).toBe(true));
  });

  it('should invalidate incorrect GUIDs', () => {
    invalidGuids.forEach((guid) => expect(isGUID(guid)).toBe(false));
  });
});
