import { isGUID } from '@onededios/node-commons-validators';
import { getRndGUID } from '../src/getRndGUID';
import { describe, it, expect, vi } from 'vitest';

describe('getRndGuid', () => {
  it('should return a valid GUID', () => {
    const result = getRndGUID();
    expect(isGUID(result)).toBe(true);
  });
});
