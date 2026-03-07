import { pgPool } from './postgres';

export async function runMigrations(): Promise<void> {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      agent_id UUID NULL,
      type TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      status TEXT NOT NULL,
      result JSONB NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS workflows (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      steps JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
