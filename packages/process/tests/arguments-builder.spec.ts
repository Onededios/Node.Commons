import { it, expect, beforeEach, afterEach } from 'vitest';
import { ArgumentsBuilder } from '../src/arguments-builder';

let originalArgv: string[];

beforeEach(() => {
  originalArgv = process.argv;
});

afterEach(() => {
  process.argv = originalArgv;
});

it('should parse string arguments', () => {
  process.argv = ['node', 'script.js', '--name', 'John', '--age', '30'];

  const builder = new ArgumentsBuilder({
    name: (raw: string) => raw,
    age: (raw: string) => parseInt(raw, 10),
  });

  expect(builder.arguments.name).toBe('John');
  expect(builder.arguments.age).toBe(30);
});

it('should parse arguments with equals sign', () => {
  process.argv = ['node', 'script.js', '--name=John', '--age=30'];

  const builder = new ArgumentsBuilder({
    name: (raw: string) => raw,
    age: (raw: string) => parseInt(raw, 10),
  });

  expect(builder.arguments.name).toBe('John');
  expect(builder.arguments.age).toBe(30);
});

it('should parse short arguments', () => {
  process.argv = ['node', 'script.js', '-n', 'John', '-a', '30'];

  const builder = new ArgumentsBuilder({
    n: (raw: string) => raw,
    a: (raw: string) => parseInt(raw, 10),
  });

  expect(builder.arguments.n).toBe('John');
  expect(builder.arguments.a).toBe(30);
});

it('should handle boolean flags', () => {
  process.argv = ['node', 'script.js', '--verbose', '--debug'];

  const builder = new ArgumentsBuilder({
    verbose: (raw: string) => raw === 'true',
    debug: (raw: string) => raw === 'true',
  });

  expect(builder.arguments.verbose).toBe(true);
  expect(builder.arguments.debug).toBe(true);
});

it('should handle missing arguments with default values', () => {
  process.argv = ['node', 'script.js', '--name', 'John'];

  const builder = new ArgumentsBuilder({
    name: (raw: string) => raw,
    age: (raw: string) => (raw ? parseInt(raw, 10) : 25),
  });

  expect(builder.arguments.name).toBe('John');
  expect(builder.arguments.age).toBe(25);
});

it('should handle complex parsing with custom parsers', () => {
  process.argv = [
    'node',
    'script.js',
    '--emails',
    'john@test.com,jane@test.com',
    '--config',
    '{"debug":true}',
  ];

  const builder = new ArgumentsBuilder({
    emails: (raw: string) => raw.split(','),
    config: (raw: string) => (raw ? JSON.parse(raw) : {}),
  });

  expect(builder.arguments.emails).toEqual(['john@test.com', 'jane@test.com']);
  expect(builder.arguments.config).toEqual({ debug: true });
});
