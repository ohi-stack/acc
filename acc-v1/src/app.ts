import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { agentRouter } from './agents/agent.routes';
import { taskRouter } from './tasks/task.routes';
import { workflowRouter } from './workflows/workflow.routes';
import { healthRouter } from './health/health.routes';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.use('/', healthRouter);
  app.use('/agents', agentRouter);
  app.use('/tasks', taskRouter);
  app.use('/workflows', workflowRouter);

  app.use(errorHandler);
  return app;
}
