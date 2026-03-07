import { randomUUID } from "crypto";
import { Queue } from "bullmq";
import { Task } from "../types/models";
import { RedisService } from "../services/RedisService";

export class TaskQueue {
  private tasks: Task[] = [];
  private queue: Queue;

  constructor(redisService: RedisService) {
    this.queue = new Queue("acc-tasks", {
      connection: redisService.connection
    });
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
    await this.queue.add(task.type, task.payload, {
      jobId: task.id,
      removeOnComplete: 100,
      removeOnFail: 100
    });
    return task;
  }

  list(): Task[] {
    return this.tasks;
  }
}
