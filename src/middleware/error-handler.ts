import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = (req as Request & { requestId?: string }).requestId || null;
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'validation_error', details: (error as ZodError).flatten(), requestId });
    return;
  }

  logger.error({ err: error, requestId }, 'Unhandled request error');
  res.status(500).json({ error: 'internal_server_error', requestId });
}
