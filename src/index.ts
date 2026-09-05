import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { createApp } from './app';
import { runMigrations } from './db/migrate';
import { logger } from './utils/logger';

dotenv.config();

async function bootstrap(): Promise<void> {
  const port = 3000;

  logger.info('ACC™ — Agent Command Console starting up...');

  // 1. Ensure client bundle exists
  const bundlePath = path.resolve(process.cwd(), 'public/bundle.js');
  if (!fs.existsSync(bundlePath)) {
    logger.info('Building client bundle with esbuild...');
    try {
      execSync('npx esbuild src/client/index.tsx --bundle --outfile=public/bundle.js --format=esm --jsx=automatic --minify', {
        stdio: 'inherit'
      });
      logger.info('Client bundle built successfully.');
    } catch (err) {
      logger.error({ err }, 'Failed to bundle client code');
    }
  }

  // 2. Run Database Migrations & Initial Seeding
  try {
    logger.info('Running database migrations and seed data...');
    await runMigrations();
    logger.info('Database initialized and verified.');
  } catch (error) {
    logger.error({ error }, 'Database initialization failed');
  }

  // 3. Create & start HTTP server
  const app = createApp();

  const server = app.listen(port, '0.0.0.0', () => {
    logger.info(`ACC™ Control Plane listening on http://0.0.0.0:${port}`);
    console.log(`\n============================================================`);
    console.log(` ACC™ — Agent Command Console Operational Control Plane`);
    console.log(` Canonical Domain: acc.onegodian.com`);
    console.log(` Status: LISTENING ON PORT ${port}`);
    console.log(` Console Dashboard: http://localhost:${port}/console/dashboard`);
    console.log(` Command Center:   http://localhost:${port}/console/command`);
    console.log(` API Endpoint:     http://localhost:${port}/api/v1`);
    console.log(`============================================================\n`);
  });

  const shutdown = () => {
    logger.info('Gracefully shutting down ACC...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Fatal error starting ACC');
  process.exit(1);
});
