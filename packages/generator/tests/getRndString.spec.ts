import { describe, it, expect } from 'vitest';
import { getRndString } from '../src/getRndString';

describe('getRndString', () => {
  it('should return an string value', () => {
    const result = getRndString(3);

    expect(result).toMatch(/^[a-zA-Z0-9]{3}$/);
    expect(typeof result).toBe('string');
  });
});
