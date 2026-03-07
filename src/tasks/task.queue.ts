import { Queue } from 'bullmq';
import { redis } from '../db/redis';
import { env } from '../config/env';

export const taskQueue = new Queue(env.QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 1000,
    removeOnFail: 1000,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});
