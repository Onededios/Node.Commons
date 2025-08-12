import { describe, it, expect, vi } from 'vitest';
import { getRndInt } from '../src/getRndInt';
import { random } from '../src/common';

describe('getRndInt', () => {
  it('should return an int value', () => {
    const final = 7;
    const spy = vi.spyOn(random, 'integer').mockReturnValue(final);

    const result = getRndInt(5, 10);

    expect(result).toBe(final);
    expect(spy).toHaveBeenCalledWith(5, 10);
    spy.mockRestore();
  });
});
