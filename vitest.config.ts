import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: './coverage',
      enabled: true,
      all: true,
      include: ['packages/**/src/*.ts'],
      exclude: ['**/*.spec.ts', 'tests/**', 'src/types/**'],
    },
  },
});
