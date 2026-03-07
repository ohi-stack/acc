import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_NAME: z.string().default('acc'),
  LOG_LEVEL: z.string().default('info'),
  REDIS_URL: z.string().url(),
  POSTGRES_URL: z.string().min(1),
  DATABASE_SSL: z.string().default('false').transform((v) => v === 'true'),
  QUEUE_NAME: z.string().default('acc-tasks'),
  ALLOW_CORS_ORIGIN: z.string().default('*')
});

export const env = EnvSchema.parse(process.env);
