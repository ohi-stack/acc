import express, { Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { logger } from './utils/logger';
import { v1Router } from './api/v1.routes';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  // Helmet with disabled CSP to allow Tailwind CDN & fonts in the preview
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Static assets from public
  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // Health and Readiness Probes
  app.get(['/health', '/healthz', '/ready', '/readyz'], (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'ACC',
      version: '1.2.0',
      timestamp: new Date().toISOString()
    });
  });

  // REST API v1
  app.use('/api/v1', v1Router);

  // Backward compatibility redirects or mirrors if needed
  app.get('/api/health', (_req, res) => res.json({ status: 'healthy', version: '1.2.0' }));

  // Client SPA routes - serve public/index.html
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
      res.status(200).send(`<!DOCTYPE html><html><body><div id="root">ACC Control Plane Initializing...</div></body></html>`);
    }
  };

  spaRoutes.forEach(route => {
    app.get(route, serveIndex);
  });

  // Error Handler
  app.use(errorHandler);

  return app;
}
