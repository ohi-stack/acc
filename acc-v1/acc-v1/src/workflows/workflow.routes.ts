import { Router } from 'express';
import { z } from 'zod';
import { WorkflowService } from './workflow.service';

const router = Router();
const service = new WorkflowService();

const CreateWorkflowSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['draft', 'active', 'completed', 'failed']).optional(),
  steps: z.array(z.record(z.unknown())).default([])
});

router.get('/', async (_req, res, next) => {
  try {
    res.json({ data: await service.list() });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = CreateWorkflowSchema.parse(req.body);
    const workflow = await service.create(body);
    res.status(201).json({ data: workflow });
  } catch (error) {
    next(error);
  }
});

export { router as workflowRouter };
