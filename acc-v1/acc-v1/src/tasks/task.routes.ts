import { Router } from 'express';
import { z } from 'zod';
import { TaskService } from './task.service';

const router = Router();
const service = new TaskService();

const CreateTaskSchema = z.object({
  agentId: z.string().uuid().optional(),
  type: z.string().min(1),
  payload: z.record(z.unknown()).default({})
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
    const body = CreateTaskSchema.parse(req.body);
    const task = await service.create(body);
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
});

export { router as taskRouter };
