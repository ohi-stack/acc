import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { WorkflowRecord, WorkflowStatus } from './workflow.types';

export class WorkflowService {
  async create(input: { name: string; steps: Array<Record<string, unknown>>; status?: WorkflowStatus }): Promise<WorkflowRecord> {
    const id = randomUUID();
    const status = input.status ?? 'draft';
    const query = `
      INSERT INTO workflows (id, name, steps, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, steps, status, created_at;
    `;
    const result = await pgPool.query(query, [id, input.name, JSON.stringify(input.steps), status]);
    return this.mapRow(result.rows[0]);
  }

  async list(): Promise<WorkflowRecord[]> {
    const result = await pgPool.query(`SELECT id, name, steps, status, created_at FROM workflows ORDER BY created_at DESC`);
    return result.rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: any): WorkflowRecord {
    return {
      id: row.id,
      name: row.name,
      steps: Array.isArray(row.steps) ? row.steps : JSON.parse(row.steps),
      status: row.status,
      createdAt: new Date(row.created_at).toISOString()
    };
  }
}
