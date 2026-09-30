import { Router } from 'express';
import { z } from 'zod';
import { EXECUTION_PROVIDERS } from '../core/delegation-contracts';
import { delegationService } from '../services/DelegationService';

const providerIds = EXECUTION_PROVIDERS.map(provider => provider.id) as [
  (typeof EXECUTION_PROVIDERS)[number]['id'],
  ...(typeof EXECUTION_PROVIDERS)[number]['id'][]
];

const executionProviderSchema = z.enum(providerIds);
const riskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const createWorkOrderSchema = z.object({
  projectId: z.string().trim().min(1),
  objective: z.string().trim().min(1),
  provider: executionProviderSchema,
  requestedBy: z.string().trim().min(1).optional(),
  responsibilityId: z.string().trim().min(1).optional(),
  context: z.record(z.string(), z.unknown()).optional(),
  executorRef: z.string().trim().min(1).optional(),
  assignedTo: z.string().trim().min(1).optional(),
  requiredTools: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  schedule: z.record(z.string(), z.unknown()).nullable().optional(),
  trigger: z.record(z.string(), z.unknown()).nullable().optional(),
  riskLevel: riskLevelSchema.optional(),
  requiresHumanApproval: z.boolean().optional()
});

export const createResponsibilitySchema = z.object({
  projectId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().optional(),
  provider: executionProviderSchema,
  ownerId: z.string().trim().min(1),
  cadence: z.string().trim().min(1).optional(),
  triggers: z.array(z.record(z.string(), z.unknown())).optional(),
  requiresHumanApproval: z.boolean().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'BLOCKED', 'ARCHIVED']).optional()
});

export const workOrderStatusSchema = z.object({
  status: z.enum([
    'PLANNED', 'READY', 'BLOCKED', 'QUEUED', 'RUNNING',
    'AWAITING_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED'
  ])
}).strict();

export function providerCatalog() {
  return EXECUTION_PROVIDERS.map(provider => ({ ...provider }));
}

export const delegationRouter = Router();

delegationRouter.get('/execution-providers', (_req, res) => {
  res.json({ success: true, count: EXECUTION_PROVIDERS.length, data: providerCatalog() });
});

delegationRouter.get('/work-orders', async (req, res, next) => {
  try {
    const data = await delegationService.listWorkOrders(req.query.status as string | undefined);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
});

delegationRouter.get('/work-orders/:id', async (req, res, next) => {
  try {
    const data = await delegationService.getWorkOrder(req.params.id);
    if (!data) {
      res.status(404).json({ success: false, error: 'Work order not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

delegationRouter.post('/work-orders', async (req, res, next) => {
  try {
    const parsed = createWorkOrderSchema.parse(req.body);
    const actor = (req as any).actor;
    const data = await delegationService.createWorkOrder({
      ...parsed,
      requestedBy: actor?.actorId || parsed.requestedBy || 'unknown-operator'
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

delegationRouter.post('/work-orders/:id/status', async (req, res, next) => {
  try {
    const parsed = workOrderStatusSchema.parse(req.body);
    const data = await delegationService.updateWorkOrderStatus(
      req.params.id,
      parsed.status,
      false
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

delegationRouter.get('/responsibilities', async (req, res, next) => {
  try {
    const data = await delegationService.listResponsibilities(req.query.status as string | undefined);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
});

delegationRouter.post('/responsibilities', async (req, res, next) => {
  try {
    const parsed = createResponsibilitySchema.parse(req.body);
    const data = await delegationService.createResponsibility(parsed);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
