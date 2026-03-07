export type AgentStatus = 'online' | 'offline' | 'busy';

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  capabilities: string[];
  createdAt: string;
}
