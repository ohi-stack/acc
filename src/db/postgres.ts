import fs from 'fs';
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface DatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
  close(): Promise<void>;
  isRemote(): boolean;
}

let dbInstance: DatabaseClient | null = null;

export async function getDatabase(): Promise<DatabaseClient> {
  if (dbInstance) return dbInstance;

  const isExternalPg = Boolean(env.POSTGRES_URL) &&
    !env.POSTGRES_URL.includes('localhost') &&
    !env.POSTGRES_URL.includes('127.0.0.1');

  if (isExternalPg) {
    try {
      logger.info('Connecting to configured remote PostgreSQL');
      const pool = new Pool({
        connectionString: env.POSTGRES_URL,
        ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
        max: Number(process.env.ACC_DB_POOL_MAX || 10),
        connectionTimeoutMillis: Number(process.env.ACC_DB_CONNECT_TIMEOUT_MS || 10000),
        idleTimeoutMillis: 30000
      });
      await pool.query('SELECT 1');
      logger.info('Connected to remote PostgreSQL database');
      const remoteClient: DatabaseClient = {
        query: async <T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> => {
          const res = await pool.query(sql, params);
          return { rows: res.rows as T[] };
        },
        close: async () => pool.end(),
        isRemote: () => true
      };
      dbInstance = remoteClient;
      return remoteClient;
    } catch (err) {
      if (env.NODE_ENV === 'production') {
        logger.error({ err }, 'Remote PostgreSQL connection failed in production');
        throw err;
      }
      logger.warn({ err }, 'Remote PostgreSQL connection failed; using local PGlite for non-production runtime');
    }
  } else if (env.NODE_ENV === 'production') {
    throw new Error('production_remote_postgresql_required');
  }

  const dataDir = path.resolve(process.cwd(), 'data', 'acc-pgdata');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  logger.info({ dataDir }, 'Initializing local PGlite for development/test persistence');
  const pglite = new PGlite(dataDir);
  await pglite.waitReady;
  logger.info('Local PGlite engine is ready');

  const localClient: DatabaseClient = {
    query: async <T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> => {
      const res = await pglite.query(sql, params);
      return { rows: (res.rows as any[]) || [] };
    },
    close: async () => { await pglite.close(); },
    isRemote: () => false
  };

  dbInstance = localClient;
  return localClient;
}

export const pgPool = {
  query: async (sql: string, params: any[] = []) => {
    const db = await getDatabase();
    return db.query(sql, params);
  }
};

export async function postgresHealth(): Promise<{ status: 'Healthy' | 'Degraded' | 'Offline'; latencyMs: number; details?: string }> {
  const start = Date.now();
  try {
    const db = await getDatabase();
    await db.query('SELECT 1 as ping');
    return {
      status: 'Healthy',
      latencyMs: Date.now() - start,
      details: db.isRemote() ? 'Remote PostgreSQL' : 'Local PGlite (development/test only)'
    };
  } catch (err: any) {
    return {
      status: 'Offline',
      latencyMs: Date.now() - start,
      details: err.message
    };
  }
}
