export type AgentStatus = "idle" | "busy" | "offline";
export type TaskStatus = "queued" | "running" | "completed" | "failed";
export type WorkflowStatus = "draft" | "active" | "completed" | "failed";

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  capabilities: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: TaskStatus;
  agentId?: string;
  result?: unknown;
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: string[];
  status: WorkflowStatus;
  createdAt: string;
}
