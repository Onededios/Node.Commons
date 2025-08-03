import { describe, it, expect } from 'vitest';
import { isISODate } from '../src/isISODate';

describe('isISODate()', () => {
  const validDates = [
    '2023-10-01',
    '2023-10-01T12:00:00Z',
    '2023-10-01T12:00:00+02:00',
  ];
  const invalidDates = [
    '01/10/2023',
    '2023-10-01T12:00:00',
    'invalid-date',
    '2023-13-01',
    '2023-10-32',
    '2023-10-01T25:00:00Z',
    '2023-10-01T12:60:00Z',
    '2023-10-01T12:00:60Z',
  ];

  it('should validate correct ISO date strings', () => {
    validDates.forEach((date) => expect(isISODate(date)).toBe(true));
  });

  it('should invalidate incorrect ISO date strings', () => {
    invalidDates.forEach((date) => expect(isISODate(date)).toBe(false));
  });
});
