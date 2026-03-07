import { Router } from 'express';
import { redisHealth } from '../db/redis';
import { postgresHealth } from '../db/postgres';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'acc' });
});

router.get('/ready', async (_req, res) => {
  const [redisOk, postgresOk] = await Promise.allSettled([redisHealth(), postgresHealth()]);
  const ready = redisOk.status === 'fulfilled' && redisOk.value && postgresOk.status === 'fulfilled' && postgresOk.value;

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'degraded',
    checks: {
      redis: redisOk.status === 'fulfilled' ? redisOk.value : false,
      postgres: postgresOk.status === 'fulfilled' ? postgresOk.value : false
    }
  });
});

export { router as healthRouter };
