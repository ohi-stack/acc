import { randomUUID } from "crypto";
import { Task } from "../types/models";
import { RedisService } from "../services/RedisService";

export class TaskQueue {
  private tasks: Task[] = [];

  constructor(_redisService?: RedisService) {
    // MOCKED — in-memory queue without external worker dependency
  }

  async enqueue(input: Pick<Task, "type" | "payload" | "agentId">): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      type: input.type,
      payload: input.payload,
      agentId: input.agentId,
      status: "queued",
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    console.log(`[TaskQueue] Task queued in-memory: ${task.id} (${task.type})`);
    return task;
  }

  list(): Task[] {
    return this.tasks;
  }
}

