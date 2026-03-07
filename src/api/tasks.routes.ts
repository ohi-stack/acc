import { Router } from "express";
import { TaskQueue } from "../core/TaskQueue";

export function createTaskRoutes(taskQueue: TaskQueue): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(taskQueue.list());
  });

  router.post("/", async (req, res) => {
    const { type, payload, agentId } = req.body as {
      type?: string;
      payload?: Record<string, unknown>;
      agentId?: string;
    };

    if (!type || !payload) {
      res.status(400).json({ error: "type and payload are required" });
      return;
    }

    const task = await taskQueue.enqueue({
      type,
      payload,
      agentId
    });

    res.status(201).json(task);
  });

  return router;
}
