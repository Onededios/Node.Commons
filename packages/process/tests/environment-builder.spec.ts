import { it, expect, vi, beforeAll } from 'vitest';
import { EnvironmentBuilder } from '../src/environment-builder';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_USER = 'user';
  process.env.DB_PASS = 'pass';
});

const parser = (value: string) => value.toString();

const variables = {
  NODE_ENV: parser,
  DB_HOST: parser,
  DB_USER: parser,
  DB_PASS: parser,
};

it('should build environment variables', () => {
  const env = new EnvironmentBuilder(variables).variables;

  console.log(process.env['DB_HOST']);

  expect(env.NODE_ENV).toEqual('test');
  expect(env.DB_HOST).toEqual('localhost');
  expect(env.DB_USER).toEqual('user');
  expect(env.DB_PASS).toEqual('pass');
});
