import fs from 'fs';
import path from 'path';
import { getDatabase } from './postgres';
import { logger } from '../utils/logger';

/**
 * Production migration path intentionally applies schema only.
 * Demo/baseline seed records are never inserted into production by this runner.
 */
export async function runProductionMigrations(): Promise<void> {
  const db = await getDatabase();
  if (!db.isRemote()) throw new Error('production_remote_postgresql_required');

  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  const statements = sql
    .split(/;\s*$/m)
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  logger.info({ statements: statements.length }, 'Applying ACC production schema migrations');
  for (const statement of statements) {
    await db.query(statement);
  }
  logger.info('ACC production schema migrations completed without demo seeding');
}
