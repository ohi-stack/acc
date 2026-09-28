import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  name: env.APP_NAME,
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-acc-key"]',
      'body.apiKey',
      'body.token',
      'body.password',
      'body.secret'
    ],
    remove: true
  }
});

