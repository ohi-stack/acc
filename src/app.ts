import express, { Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v1Router } from './api/v1.routes';
import { errorHandler } from './middleware/error-handler';
import { apiAuth } from './middleware/api-auth';
import { env } from './config/env';
import { postgresHealth } from './db/postgres';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  const allowedOrigins = new Set(env.ALLOW_CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean));
  app.use((req: Request, res: Response, next) => {
    const requestIdHeader = String(req.header('x-request-id') || '').trim();
    const requestId = /^[A-Za-z0-9._:-]{1,128}$/.test(requestIdHeader) ? requestIdHeader : crypto.randomUUID();
    (req as Request & { requestId?: string }).requestId = requestId;
    res.setHeader('x-request-id', requestId);

    const origin = req.header('origin');
    if (origin) {
      if (!allowedOrigins.has(origin)) {
        res.status(403).json({ error: 'cors_origin_not_allowed', requestId });
        return;
      }
      res.setHeader('access-control-allow-origin', origin);
      res.setHeader('access-control-allow-credentials', 'true');
      res.setHeader('vary', 'Origin');
    }
    if (req.method === 'OPTIONS') {
      res.setHeader('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('access-control-allow-headers', 'Authorization,Content-Type,X-ACC-Key,X-Request-Id');
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));

  app.get(['/health', '/healthz'], (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'ACC',
      version: env.ACC_VERSION,
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  app.get(['/ready', '/readyz'], async (_req: Request, res: Response) => {
    const database = await postgresHealth();
    const remoteRequired = env.NODE_ENV === 'production';
    const remoteSatisfied = !remoteRequired || database.details === 'Remote PostgreSQL';
    const ready = database.status === 'Healthy' && remoteSatisfied;
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      service: 'ACC',
      version: env.ACC_VERSION,
      environment: env.NODE_ENV,
      dependencies: { database },
      productionRemoteDatabaseRequired: remoteRequired,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/health', (_req, res) => res.json({
    status: 'healthy',
    service: 'ACC',
    version: env.ACC_VERSION,
    environment: env.NODE_ENV
  }));

  // The operational API is private. Production identity/role is bound to the
  // server-side API key configuration and cannot be elevated by request headers.
  app.use('/api/v1', apiAuth, v1Router);

  const spaRoutes = [
    '/',
    '/console/*',
    '/agents',
    '/agents/*',
    '/tasks',
    '/tasks/*',
    '/workflows',
    '/workflows/*',
    '/engineering-council',
    '/engineering-council/*',
    '/models',
    '/models/*',
    '/connections',
    '/connections/*',
    '/executions',
    '/executions/*',
    '/approvals',
    '/approvals/*',
    '/governance/*',
    '/deployments',
    '/deployments/*',
    '/verification',
    '/verification/*',
    '/audit',
    '/audit/*',
    '/status',
    '/docs',
    '/settings',
    '/account'
  ];

  const serveIndex = (_req: Request, res: Response) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(503).send('<!DOCTYPE html><html><body><div id="root">ACC client bundle is unavailable.</div></body></html>');
    }
  };

  spaRoutes.forEach(route => {
    app.get(route, serveIndex);
  });

  app.use(errorHandler);
  return app;
}
