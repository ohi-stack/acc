import { Router } from "express";
import { AgentManager } from "../core/AgentManager";

export function createAgentRoutes(agentManager: AgentManager): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(agentManager.list());
  });

  router.post("/", (req, res) => {
    const { name, type, capabilities } = req.body as {
      name?: string;
      type?: string;
      capabilities?: string[];
    };

    if (!name || !type) {
      res.status(400).json({ error: "name and type are required" });
      return;
    }

    const agent = agentManager.create({
      name,
      type,
      capabilities: capabilities ?? []
    });

    res.status(201).json(agent);
  });

  return router;
}
