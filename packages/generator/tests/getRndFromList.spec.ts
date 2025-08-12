import { describe, it, expect, vi } from 'vitest';
import { getRndFromList } from '../src/getRndFromList';
import { random } from '../src/common';

describe('getRndFromList', () => {
  it('should throw RangeError for empty array', () => {
    expect(() => getRndFromList([])).toThrow(RangeError);
  });

  it('should return a random element from a non-empty array', () => {
    const values = ['a', 'b', 'c'];
    const integer = vi.fn().mockReturnValue(1);
    const spy = vi.spyOn(random, 'integer').mockImplementation(integer);

    const result = getRndFromList(values);

    expect(result).toBe('b');
    expect(spy).toHaveBeenCalledWith(0, values.length - 1);
  });
});
