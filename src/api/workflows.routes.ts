import { Router } from "express";
import { WorkflowRegistry } from "../core/WorkflowRegistry";

export function createWorkflowRoutes(workflowRegistry: WorkflowRegistry): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(workflowRegistry.list());
  });

  router.post("/", (req, res) => {
    const { name, steps } = req.body as { name?: string; steps?: string[] };

    if (!name || !steps || !Array.isArray(steps)) {
      res.status(400).json({ error: "name and steps array are required" });
      return;
    }

    const workflow = workflowRegistry.create({ name, steps });
    res.status(201).json(workflow);
  });

  return router;
}
