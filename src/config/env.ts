import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().default('acc'),
  ACC_VERSION: z.string().default('1.2.0'),
  LOG_LEVEL: z.string().default('info'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  POSTGRES_URL: z.string().default('postgres://postgres:postgres@localhost:5432/acc'),
  DATABASE_SSL: z.string().default('false').transform((v: string) => v === 'true'),
  QUEUE_NAME: z.string().default('acc-tasks'),
  ALLOW_CORS_ORIGIN: z.string().default('*'),
  API_KEY: z.string().default(''),
  ACC_SEED_BASELINE: z.string().default('false').transform((v: string) => v === 'true')
}).superRefine((value, ctx) => {
  if (value.NODE_ENV !== 'production') return;

  const localPostgres = /(?:localhost|127\.0\.0\.1)/i.test(value.POSTGRES_URL);
  if (!/^postgres(?:ql)?:\/\//i.test(value.POSTGRES_URL) || localPostgres) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['POSTGRES_URL'], message: 'Production requires a non-local PostgreSQL URL.' });
  }
  if (value.ALLOW_CORS_ORIGIN.trim() === '*') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ALLOW_CORS_ORIGIN'], message: 'Production CORS origin cannot be wildcard.' });
  }
  if (value.API_KEY.trim().length < 24) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['API_KEY'], message: 'Production API_KEY must be configured with at least 24 characters.' });
  }
  if (value.ACC_SEED_BASELINE) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ACC_SEED_BASELINE'], message: 'Baseline demo seeding must be disabled in production.' });
  }
});

export const env = EnvSchema.parse(process.env);
