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
  if (dbInstance) {
    return dbInstance;
  }

  // If a real external postgres URL is provided and not pointing to localhost mock
  const isExternalPg = env.POSTGRES_URL && 
    !env.POSTGRES_URL.includes('localhost') && 
    !env.POSTGRES_URL.includes('127.0.0.1');

  if (isExternalPg) {
    try {
      logger.info({ url: env.POSTGRES_URL.replace(/:[^:@]+@/, ':***@') }, 'Connecting to remote PostgreSQL');
      const pool = new Pool({
        connectionString: env.POSTGRES_URL,
        ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false
      });
      // test probe
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
      logger.warn({ err }, 'Failed to connect to remote PostgreSQL, falling back to local persistent PGlite');
    }
  }

  // Durable PGlite (WASM PostgreSQL 16) with disk persistence
  const dataDir = path.resolve(process.cwd(), 'data', 'acc-pgdata');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  logger.info({ dataDir }, 'Initializing durable PostgreSQL (PGlite engine) with local persistence');
  const pglite = new PGlite(dataDir);
  await pglite.waitReady;
  logger.info('Durable PostgreSQL engine is ready');

  const localClient: DatabaseClient = {
    query: async <T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> => {
      const res = await pglite.query(sql, params);
      return { rows: (res.rows as any[]) || [] };
    },
    close: async () => {
      await pglite.close();
    },
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
      details: db.isRemote() ? 'Remote PostgreSQL' : 'Persistent PGlite (PostgreSQL 16 Engine)'
    };
  } catch (err: any) {
    return {
      status: 'Offline',
      latencyMs: Date.now() - start,
      details: err.message
    };
  }
}
