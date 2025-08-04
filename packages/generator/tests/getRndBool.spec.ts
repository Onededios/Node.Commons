import { describe, it, expect } from 'vitest';
import { getRndBool } from '../src/getRndBool';

describe('getRndBool', () => {
  it('should return a boolean value', () => {
    const result = getRndBool();
    expect(typeof result).toBe('boolean');
    expect(result).toBeOneOf([true, false]);
  });
});
