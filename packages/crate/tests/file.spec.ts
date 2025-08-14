import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { File } from '../src/file';
import { existsSync, statSync, Stats, promises } from 'fs';

const filePath = 'src/index.ts';
const mockStats: Stats = { isFile: () => true } as Stats;

beforeEach(() => {
  vi.mock('fs');
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(statSync).mockReturnValue(mockStats);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should not create a file instance', () => {
  const folder = 'folder';
  vi.mocked(statSync).mockReturnValue({ isFile: () => false } as Stats);

  expect(() => new File(folder)).toThrowError(/Path is not a file:/);
});

it('should create a file instance', () => {
  const file = new File(filePath);
  expect(file).toBeInstanceOf(File);
});

it('should read file async', async () => {
  const content = 'file content';
  vi.mocked(promises.readFile).mockResolvedValue(content);

  const file = new File(filePath);
  await expect(file.readAsync()).resolves.toBe(content);
});

it('should read json file async', async () => {
  const jsonContent = '{"key": "value"}';
  vi.mocked(promises.readFile).mockResolvedValue(jsonContent);

  const file = new File(filePath);
  await expect(file.readJSONAsync()).resolves.toEqual(JSON.parse(jsonContent));
});

it('should write file async', async () => {
  const content = 'file content';
  vi.mocked(promises.writeFile).mockResolvedValue(undefined);

  const file = new File(filePath);
  await expect(file.writeAsync(content)).resolves.toBeUndefined();
});
