import { integer } from 'random-js';
import { describe, it, expect } from 'vitest';
import { getRndInt } from '../src/getRndInt';

describe('getRndInt', () => {
  it('should return an int value', () => {
    const result = getRndInt(5, 10);

    expect(result).toBe(7);
    expect(integer).toHaveBeenCalledWith(5, 10);
  });
});
