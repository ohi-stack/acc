export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface TaskRecord {
  id: string;
  agentId?: string | null;
  type: string;
  payload: Record<string, unknown>;
  status: TaskStatus;
  result?: Record<string, unknown> | null;
  createdAt: string;
}
