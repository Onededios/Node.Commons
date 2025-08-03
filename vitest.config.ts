import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', 'tests/**', 'src/types/**'],
    },
  },
});
