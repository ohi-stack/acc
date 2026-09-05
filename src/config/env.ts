import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().default('acc'),
  LOG_LEVEL: z.string().default('info'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  POSTGRES_URL: z.string().default('postgres://postgres:postgres@localhost:5432/acc'),
  DATABASE_SSL: z.string().default('false').transform((v: string) => v === 'true'),
  QUEUE_NAME: z.string().default('acc-tasks'),
  ALLOW_CORS_ORIGIN: z.string().default('*')
});

export const env = EnvSchema.parse(process.env);

