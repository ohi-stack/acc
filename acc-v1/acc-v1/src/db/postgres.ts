import { Pool } from 'pg';
import { env } from '../config/env';

export const pgPool = new Pool({
  connectionString: env.POSTGRES_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false
});

export async function postgresHealth(): Promise<boolean> {
  const client = await pgPool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}
