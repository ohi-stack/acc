import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'validation_error', details: error.flatten() });
    return;
  }

  logger.error({ err: error }, 'Unhandled request error');
  res.status(500).json({ error: 'internal_server_error' });
}
