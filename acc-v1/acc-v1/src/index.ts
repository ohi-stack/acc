import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { runMigrations } from './db/migrate';
import { redis } from './db/redis';
import { pgPool } from './db/postgres';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap() {
  await runMigrations();

  const app = createApp();
  const server = createServer(app);
  const scheduler = new SchedulerService();

  server.listen(env.PORT, () => {
    scheduler.start();
    logger.info({ port: env.PORT }, 'ACC service started');
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down ACC');
    scheduler.stop();
    server.close(async () => {
      await Promise.allSettled([redis.quit(), pgPool.end()]);
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'ACC bootstrap failed');
  process.exit(1);
});
