import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

function presentedApiKey(req: Request): string {
  const direct = String(req.headers['x-acc-key'] || '').trim();
  if (direct) return direct;
  const authorization = String(req.headers.authorization || '').trim();
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function apiAuth(req: Request, res: Response, next: NextFunction): void {
  if (env.NODE_ENV !== 'production') {
    const headerRole = String(req.headers['x-acc-role'] || '').trim();
    const role = ['super_admin', 'domain_lead', 'acc_operator', 'observer'].includes(headerRole)
      ? headerRole
      : 'acc_operator';
    const actorId = String(req.headers['x-acc-actor'] || 'local-operator');
    req.headers['x-acc-role'] = role;
    req.headers['x-acc-actor'] = actorId;
    (req as any).actor = { actorId, role };
    next();
    return;
  }

  const key = presentedApiKey(req);
  if (!key || !constantTimeEqual(key, env.API_KEY)) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  // Downstream legacy routing reads these headers. Overwrite them after
  // authentication so caller-supplied values cannot self-elevate privileges
  // or impersonate another operator.
  req.headers['x-acc-role'] = env.ACC_OPERATOR_ROLE;
  req.headers['x-acc-actor'] = env.ACC_OPERATOR_ID;
  (req as any).actor = {
    actorId: env.ACC_OPERATOR_ID,
    role: env.ACC_OPERATOR_ROLE
  };
  next();
}
