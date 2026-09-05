import { Agent, Task, Execution, ApprovalRequest, Workflow, ProviderItem, ConnectionItem, DeploymentItem, VerificationItem, AuditRecordItem } from './types';

let currentActor = 'onegodian_admin';
let currentRole = 'super_admin';

export function setOperator(actor: string, role: string) {
  currentActor = actor;
  currentRole = role;
}

export function getOperator() {
  return { actor: currentActor, role: currentRole };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('x-acc-actor', currentActor);
  headers.set('x-acc-role', currentRole);

  const res = await fetch(path, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.error) errMsg = body.error;
    } catch {}
    throw new Error(errMsg);
  }

  const json = await res.json();
  return json.data ?? json;
}

export const api = {
  // Agents
  getAgents: () => request<Agent[]>('/api/v1/agents'),
  getAgent: (id: string) => request<Agent & { recentExecutions: Execution[]; auditHistory: AuditRecordItem[] }>(`/api/v1/agents/${id}`),
  registerAgent: (payload: Partial<Agent>) => request<Agent>('/api/v1/agents', { method: 'POST', body: JSON.stringify(payload) }),
  setAgentStatus: (id: string, status: string) => request<Agent>(`/api/v1/agents/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
  setAgentConcurrency: (id: string, maxConcurrency: number) => request<Agent>(`/api/v1/agents/${id}/concurrency`, { method: 'POST', body: JSON.stringify({ maxConcurrency }) }),

  // Tasks
  getTasks: (filters?: { status?: string; search?: string; agentId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.agentId) params.set('agentId', filters.agentId);
    return request<Task[]>(`/api/v1/tasks?${params.toString()}`);
  },
  getTask: (id: string) => request<Task>(`/api/v1/tasks/${id}`),
  createTask: (payload: { type: string; payload: any; priority?: string; assignedAgentId?: string }) => request<Task>('/api/v1/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  retryTask: (id: string) => request<Task>(`/api/v1/tasks/${id}/retry`, { method: 'POST' }),
  cancelTask: (id: string, reason?: string) => request<Task>(`/api/v1/tasks/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Executions
  getExecutions: () => request<Execution[]>('/api/v1/executions'),
  getExecutionTrace: (id: string) => request<Execution>(`/api/v1/executions/${id}`),
  runExecution: (taskId: string, promptOverride?: string, riskLevel?: string) => request<any>('/api/v1/executions/run', { method: 'POST', body: JSON.stringify({ taskId, promptOverride, riskLevel }) }),

  // Approvals
  getApprovals: (status?: string) => {
    const q = status ? `?status=${status}` : '';
    return request<ApprovalRequest[]>(`/api/v1/approvals${q}`);
  },
  getPendingApprovalCount: async () => {
    const res = await request<{ count: number }>('/api/v1/approvals/pending-count');
    return res.count;
  },
  decideApproval: (id: string, decision: 'APPROVED' | 'REJECTED', reason?: string) =>
    request<ApprovalRequest>(`/api/v1/approvals/${id}/decide`, { method: 'POST', body: JSON.stringify({ decision, reason }) }),

  // Workflows
  getWorkflows: () => request<Workflow[]>('/api/v1/workflows'),
  getWorkflow: (id: string) => request<Workflow>(`/api/v1/workflows/${id}`),
  createWorkflow: (payload: { name: string; description?: string; steps: any[] }) => request<Workflow>('/api/v1/workflows', { method: 'POST', body: JSON.stringify(payload) }),
  runWorkflow: (id: string, inputs?: any) => request<any>(`/api/v1/workflows/${id}/run`, { method: 'POST', body: JSON.stringify({ inputs }) }),

  // Providers & Models
  getProviders: () => request<ProviderItem[]>('/api/v1/providers'),
  invokeProvider: (payload: { provider: string; model: string; prompt: string; systemInstruction?: string }) =>
    request<any>('/api/v1/providers/invoke', { method: 'POST', body: JSON.stringify(payload) }),

  // Connections
  getConnections: () => request<ConnectionItem[]>('/api/v1/connections'),
  testConnection: (id: string) => request<any>(`/api/v1/connections/${id}/test`, { method: 'POST' }),

  // Deployments
  getDeployments: () => request<DeploymentItem[]>('/api/v1/deployments'),

  // Verification
  getVerifications: () => request<VerificationItem[]>('/api/v1/verification'),

  // Audit Records
  getAuditRecords: (limit = 50, offset = 0) =>
    request<{ total: number; limit: number; offset: number; data: AuditRecordItem[] }>(`/api/v1/audit?limit=${limit}&offset=${offset}`).then(res => (res as any).data ?? res),

  // System Health
  getSystemHealth: () => request<any>('/api/v1/health'),

  // Command Center
  planObjective: (objective: string) => request<any>('/api/v1/command/plan', { method: 'POST', body: JSON.stringify({ objective }) }),
  executeObjective: (payload: { objective: string; tasks: any[]; riskClassification: string }) =>
    request<any>('/api/v1/command/execute', { method: 'POST', body: JSON.stringify(payload) }),

  // Engineering Council
  runCouncil: (issueTitle: string, repo = 'ohi-stack/acc') =>
    request<any>('/api/v1/council/run', { method: 'POST', body: JSON.stringify({ issueTitle, repo }) })
};
