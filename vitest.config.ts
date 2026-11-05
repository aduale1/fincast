import { defineConfig } from 'vitest/config';

// One test runner for the whole monorepo. Each workspace becomes a "project"
// so `npm test` at the root runs every package's tests in one go.
export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
    passWithNoTests: true,
  },
});
