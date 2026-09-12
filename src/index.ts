import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { createApp } from './app';
import { runMigrations } from './db/migrate';
import { runProductionMigrations } from './db/migrate-production';
import { env } from './config/env';
import { logger } from './utils/logger';

dotenv.config();

async function bootstrap(): Promise<void> {
  const port = env.PORT;

  logger.info({ version: env.ACC_VERSION, environment: env.NODE_ENV }, 'ACC — Agent Command Console starting');

  const bundlePath = path.resolve(process.cwd(), 'public/bundle.js');
  if (!fs.existsSync(bundlePath)) {
    if (env.NODE_ENV === 'production') {
      throw new Error('production_client_bundle_missing');
    }
    logger.info('Building client bundle for non-production runtime');
    execSync('npx esbuild src/client/index.tsx --bundle --outfile=public/bundle.js --format=esm --jsx=automatic --minify', {
      stdio: 'inherit'
    });
  }

  try {
    logger.info('Running database migrations');
    if (env.NODE_ENV === 'production') await runProductionMigrations();
    else await runMigrations();
    logger.info('Database migration stage completed');
  } catch (error) {
    logger.error({ error }, 'Database initialization failed');
    if (env.NODE_ENV === 'production') throw error;
  }

  const app = createApp();
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info({ port, version: env.ACC_VERSION }, 'ACC control plane listening');
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Gracefully shutting down ACC');
    const forceExit = setTimeout(() => {
      logger.error('ACC graceful shutdown timed out');
      process.exit(1);
    }, 10000);
    forceExit.unref();

    server.close(() => {
      clearTimeout(forceExit);
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Fatal error starting ACC');
  process.exit(1);
});
