import dotenv from "dotenv";
import express from "express";
import { createAgentRoutes } from "./api/agents.routes";
import { createTaskRoutes } from "./api/tasks.routes";
import { createWorkflowRoutes } from "./api/workflows.routes";
import { AgentManager } from "./core/AgentManager";
import { TaskQueue } from "./core/TaskQueue";
import { WorkflowRegistry } from "./core/WorkflowRegistry";
import { apiKeyAuth } from "./middleware/auth";
import { basicRateLimit } from "./middleware/rateLimit";
import { DatabaseService } from "./services/DatabaseService";
import { RedisService } from "./services/RedisService";

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = express();
  const port = Number(process.env.PORT ?? 3000);
  const databaseUrl = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/acc";
  const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

  const redisService = new RedisService(redisUrl);
  const databaseService = new DatabaseService(databaseUrl);

  try {
    await databaseService.connect();
  } catch (error) {
    console.warn("Database connection failed during startup.", error);
  }

  const agentManager = new AgentManager();
  const taskQueue = new TaskQueue(redisService);
  const workflowRegistry = new WorkflowRegistry();

  app.use(express.json());
  app.use(basicRateLimit);
  app.use(apiKeyAuth);

  app.get("/", (_req, res) => {
    res.json({ service: "ACC", status: "running", version: "1.0.0" });
  });

  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
  app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));
  app.get("/readyz", (_req, res) => res.status(200).json({ ok: true }));
  app.get("/ready", (_req, res) => res.status(200).json({ ok: true }));

  app.use("/agents", createAgentRoutes(agentManager));
  app.use("/tasks", createTaskRoutes(taskQueue));
  app.use("/workflows", createWorkflowRoutes(workflowRegistry));

  app.listen(port, "0.0.0.0", () => {
    console.log(`ACC running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start ACC", error);
  process.exit(1);
});
