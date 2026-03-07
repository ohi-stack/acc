import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { taskQueue } from './task.queue';
import { TaskRecord } from './task.types';

export class TaskService {
  async create(input: { agentId?: string; type: string; payload: Record<string, unknown> }): Promise<TaskRecord> {
    const id = randomUUID();
    const query = `
      INSERT INTO tasks (id, agent_id, type, payload, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, agent_id, type, payload, status, result, created_at;
    `;
    const values = [id, input.agentId ?? null, input.type, JSON.stringify(input.payload), 'queued'];
    const result = await pgPool.query(query, values);
    await taskQueue.add(input.type, { taskId: id, agentId: input.agentId ?? null, payload: input.payload }, { jobId: id });
    return this.mapRow(result.rows[0]);
  }

  async list(): Promise<TaskRecord[]> {
    const result = await pgPool.query(`SELECT id, agent_id, type, payload, status, result, created_at FROM tasks ORDER BY created_at DESC`);
    return result.rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: any): TaskRecord {
    return {
      id: row.id,
      agentId: row.agent_id,
      type: row.type,
      payload: typeof row.payload === 'object' ? row.payload : JSON.parse(row.payload),
      status: row.status,
      result: row.result ? (typeof row.result === 'object' ? row.result : JSON.parse(row.result)) : null,
      createdAt: new Date(row.created_at).toISOString()
    };
  }
}
