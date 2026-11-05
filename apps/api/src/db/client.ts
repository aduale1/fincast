import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

/**
 * Creates a database connection pool and a typed Drizzle client on top of it.
 * A pool keeps a few connections open and reuses them, because opening a new
 * Postgres connection for every request is slow.
 */
export function createDb(databaseUrl: string) {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 10 });
  return { db: drizzle(pool, { schema }), pool };
}

export type Db = ReturnType<typeof createDb>['db'];
