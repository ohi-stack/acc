import { NextFunction, Request, Response } from 'express';
import { adminAuth } from '../lib/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/' || req.path === '/health' || req.path === '/ready' || req.path === '/healthz' || req.path === '/readyz') {
    next();
    return;
  }

  const expected = process.env.API_KEY;
  if (!expected) {
    next();
    return;
  }

  const provided = req.header('x-api-key');
  if (provided !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
