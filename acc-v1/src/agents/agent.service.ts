import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { Agent, AgentStatus } from './agent.types';

export class AgentService {
  async create(input: { name: string; type: string; capabilities: string[]; status?: AgentStatus }): Promise<Agent> {
    const id = randomUUID();
    const status = input.status ?? 'online';
    const query = `
      INSERT INTO agents (id, name, type, status, capabilities)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, type, status, capabilities, created_at;
    `;
    const values = [id, input.name, input.type, status, JSON.stringify(input.capabilities)];
    const result = await pgPool.query(query, values);
    return this.mapRow(result.rows[0]);
  }

  async list(): Promise<Agent[]> {
    const result = await pgPool.query(`SELECT id, name, type, status, capabilities, created_at FROM agents ORDER BY created_at DESC`);
    return result.rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: any): Agent {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      capabilities: Array.isArray(row.capabilities) ? row.capabilities : JSON.parse(row.capabilities),
      createdAt: new Date(row.created_at).toISOString()
    };
  }
}
