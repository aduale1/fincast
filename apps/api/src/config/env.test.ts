import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

describe('loadEnv', () => {
  it('applies defaults and coerces the port to a number', () => {
    const env = loadEnv({ DATABASE_URL: 'postgres://u:p@localhost:5432/db' });
    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_URL: 'postgres://u:p@localhost:5432/db',
    });
  });

  it('fails fast with a readable message when DATABASE_URL is missing', () => {
    expect(() => loadEnv({})).toThrow(/DATABASE_URL/);
  });
});
