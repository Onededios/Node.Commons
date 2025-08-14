import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Directory } from '../src/directory';
import { Dirent, existsSync, readdirSync, Stats, statSync } from 'fs';

const folderPath = 'src';
const mockStats: Stats = {
  isFile: () => false,
  isDirectory: () => true,
} as Stats;

const folders = [
  {
    name: 'subdir1',
    isFile: () => false,
    isDirectory: () => true,
  },
  {
    name: 'subdir2',
    isFile: () => false,
    isDirectory: () => true,
  },
];
const files = [
  {
    name: 'file1.txt',
    isFile: () => true,
    isDirectory: () => false,
  },
  {
    name: 'file2.txt',
    isFile: () => true,
    isDirectory: () => false,
  },
];

beforeEach(() => {
  vi.mock('fs');
  vi.mocked(existsSync).mockReturnValue(true);
  vi.mocked(statSync).mockReturnValue(mockStats);
  vi.mocked(readdirSync).mockReturnValue([...folders, ...files] as Dirent[]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should create a directory instance', () => {
  const dir = new Directory(folderPath);
  expect(dir).toBeInstanceOf(Directory);
});

it('should not create a directory instance', () => {
  vi.resetAllMocks();
  vi.mocked(existsSync).mockReturnValue(true);

  expect(() => new Directory('file.txt')).toThrowError(
    /Path is not a directory:/
  );
});

it('should get the current path', () => {
  const dir = new Directory(folderPath);
  expect(dir.getCurrentPath()).toContain(folderPath);
});

it('should get files in the directory', () => {
  const dir = new Directory(folderPath);
  const fullPath = dir.getCurrentPath();
  expect(dir.getFiles()).toEqual(files.map((f) => `${fullPath}/${f.name}`));
});

it('should get subdirectories in the directory', () => {
  const dir = new Directory(folderPath);
  const fullPath = dir.getCurrentPath();
  expect(dir.getDirs()).toEqual(folders.map((f) => `${fullPath}/${f.name}`));
});

it('should check if a child is present in the directory', () => {
  const dir = new Directory(folderPath);
  files.forEach((file) => expect(dir.hasChild(file.name)).toBe(true));
  expect(dir.hasChild('nonexistent.txt')).toBe(false);
});

it('should throw an error if the directory cannot be read', () => {
  vi.mocked(readdirSync).mockImplementation(() => {
    throw new Error('Failed to read directory');
  });
  const dir = new Directory(folderPath);
  expect(() => dir.getFiles()).toThrowError(
    /Failed to read files in directory/
  );
  expect(() => dir.getDirs()).toThrowError(
    /Failed to read subdirectories in directory/
  );
  expect(() => dir.hasChild('file.txt')).toThrowError(
    /Failed to check child presence in directory/
  );
});
