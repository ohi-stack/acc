export type WorkflowStatus = 'draft' | 'active' | 'completed' | 'failed';

export interface WorkflowRecord {
  id: string;
  name: string;
  steps: Array<Record<string, unknown>>;
  status: WorkflowStatus;
  createdAt: string;
}
