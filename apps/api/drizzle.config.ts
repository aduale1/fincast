import { defineConfig } from 'drizzle-kit';

// drizzle-kit reads the TypeScript schema and writes SQL migration files into ./drizzle.
// Those SQL files are committed, reviewed in pull requests, and applied in order.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://fincast:fincast@localhost:5432/fincast',
  },
});
