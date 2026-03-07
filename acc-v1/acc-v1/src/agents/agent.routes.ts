import { Router } from 'express';
import { z } from 'zod';
import { AgentService } from './agent.service';

const router = Router();
const service = new AgentService();

const CreateAgentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  status: z.enum(['online', 'offline', 'busy']).optional(),
  capabilities: z.array(z.string()).default([])
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
    const body = CreateAgentSchema.parse(req.body);
    const agent = await service.create(body);
    res.status(201).json({ data: agent });
  } catch (error) {
    next(error);
  }
});

export { router as agentRouter };
