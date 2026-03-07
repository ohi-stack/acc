import IORedis from 'ioredis';
import { env } from '../config/env';

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});

export async function redisHealth(): Promise<boolean> {
  const pong = await redis.ping();
  return pong === 'PONG';
}
