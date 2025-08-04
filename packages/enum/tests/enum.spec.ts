import { describe, it, expect } from 'vitest';
import { Enum } from '../src/enum';

describe('Enum', () => {
  describe('create from list of keys', () => {
    it('should assign incremental values starting from 0', () => {
      const Direction = Enum.create('Up', 'Down', 'Left', 'Right');
      expect(Direction).toEqual({ Up: 0, Down: 1, Left: 2, Right: 3 });
    });
  });

  describe('create from object map', () => {
    it('should return shallow copy of the provided map', () => {
      const Status = Enum.create({ OPEN: 'O', CLOSED: 'C' });
      expect(Status).toEqual({ OPEN: 'O', CLOSED: 'C' });
    });

    it('should retain numeric values', () => {
      const Http = Enum.create({ OK: 200, NOT_FOUND: 404 });
      expect(Http.OK).toBe(200);
      expect(Http.NOT_FOUND).toBe(404);
    });
  });

  describe('values', () => {
    it('should return array of values', () => {
      const Color = Enum.create({ Red: '#f00', Green: '#0f0' });
      const values = Enum.values<string>(Color);
      expect(values).toEqual(['#f00', '#0f0']);
    });
  });

  describe('keys', () => {
    it('should return array of keys', () => {
      const Days = Enum.create({ Mon: 1, Tue: 2 });
      const keys = Enum.keys(Days);
      expect(keys).toEqual(['Mon', 'Tue']);
    });
  });

  describe('isValidKey', () => {
    it('should return true for valid keys', () => {
      const Actions = Enum.create({ RUN: 'R', STOP: 'S' });
      expect(Enum.isValidKey(Actions, 'RUN')).toBe(true);
      expect(Enum.isValidKey(Actions, 'STOP')).toBe(true);
    });

    it('should return false for invalid keys or non-string', () => {
      const Actions = Enum.create({ RUN: 'R', STOP: 'S' });
      expect(Enum.isValidKey(Actions, 'JUMP')).toBe(false);
      expect(Enum.isValidKey(Actions, 123)).toBe(false);
    });
  });

  describe('isValidValue', () => {
    it('should return true for valid values', () => {
      const Status = Enum.create({ ENABLED: 1, DISABLED: 0 });
      expect(Enum.isValidValue(Status, 1)).toBe(true);
      expect(Enum.isValidValue(Status, 0)).toBe(true);
    });

    it('should return false for unknown values', () => {
      const Status = Enum.create({ ENABLED: 1, DISABLED: 0 });
      expect(Enum.isValidValue(Status, 2)).toBe(false);
    });
  });

  describe('create with invalid arguments', () => {
    it('should throw if argument is null or undefined', () => {
      expect(() => Enum.create(undefined as any)).toThrowError(
        'Invalid arguments! First argument cannot be null or undefined.'
      );
      expect(() => Enum.create(null as any)).toThrowError(
        'Invalid arguments! First argument cannot be null or undefined.'
      );
    });

    it('should throw error if called with invalid types', () => {
      expect(() => Enum.create(true as any)).toThrowError(
        'Invalid arguments! Must be a string list or an object map.'
      );
      expect(() => Enum.create(Symbol('invalid') as any)).toThrowError(
        'Invalid arguments! Must be a string list or an object map.'
      );
      expect(() => Enum.create(123 as any)).toThrowError(
        'Invalid arguments! Must be a string list or an object map.'
      );
    });

    it('should throw if array contains non-string keys', () => {
      expect(() => Enum.create(['A', 123] as any)).toThrowError(
        'Invalid enum key(s)! All keys must be strings.'
      );
    });

    it('should throw if variadic keys are not all strings', () => {
      expect(() => Enum.create('A', 'B', 99 as any)).toThrowError(
        'Invalid enum key(s)! All keys must be strings.'
      );
    });
  });
});
