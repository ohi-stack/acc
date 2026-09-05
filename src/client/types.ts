export type AuthorityRole = 'super_admin' | 'acc_admin' | 'acc_operator' | 'domain_lead' | 'agent_executor' | 'observer';

export interface Agent {
  id: string;
  name: string;
  type: string;
  version: string;
  status: 'DRAFT' | 'READY' | 'AUTHORIZED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'TERMINATED' | 'ESCALATED';
  capabilities: string[];
  supported_task_types: string[];
  environment: string;
  max_concurrency: number;
  current_workload: number;
  queue_affinity: string;
  authority_role: string;
  tenant_scope: string;
  model_adapter: string;
  last_heartbeat: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  type: string;
  payload: any;
  status: 'CREATED' | 'VALIDATED' | 'QUEUED' | 'RESERVED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'DEAD_LETTERED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  submitted_by: string;
  assigned_agent_id?: string;
  workflow_id?: string;
  correlation_id?: string;
  retry_count: number;
  max_retries: number;
  error?: string;
  result?: any;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  events?: any[];
}

export interface Execution {
  id: string;
  task_id?: string;
  agent_id?: string;
  task_type?: string;
  agent_name?: string;
  workflow_id?: string;
  provider: string;
  model: string;
  status: 'PENDING' | 'AUTHORIZED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ESCALATED' | 'REJECTED';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  input_payload: any;
  output_payload?: any;
  duration_ms?: number;
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  events?: any[];
  verification?: any;
}

export interface ApprovalRequest {
  id: string;
  execution_id?: string;
  task_id?: string;
  workflow_id?: string;
  requested_action: string;
  requesting_agent: string;
  affected_resource: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  policy: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  decided_by?: string;
  decision_reason?: string;
  decided_at?: string;
  created_at: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: string;
  steps: any[];
  created_at: string;
  runs?: any[];
}

export interface ProviderItem {
  id: string;
  provider: string;
  model: string;
  capabilities: string[];
  availability: string;
  health: string;
  auth_state: string;
  tool_support: boolean;
  structured_output: boolean;
  latency_ms: number;
  runtimeHealth?: {
    status: string;
    latencyMs: number;
    error?: string;
  };
}

export interface ConnectionItem {
  id: string;
  name: string;
  platform: string;
  adapter: string;
  connection_class: string;
  protocol: string;
  auth_method: string;
  capabilities: string[];
  read_permissions: string[];
  write_permissions: string[];
  requires_human_approval: boolean;
  environment: string;
  health: 'Healthy' | 'Degraded' | 'Offline' | 'Authorization Required' | 'Unknown';
  version: string;
  last_successful_operation?: string;
  rate_limits?: string;
  audit_policy?: string;
  verification_policy?: string;
}

export interface DeploymentItem {
  id: string;
  repository: string;
  branch: string;
  pr_number?: number;
  merged_sha: string;
  deployed_sha: string;
  environment: string;
  deployment_start: string;
  deployment_completion?: string;
  health_check_status: string;
  smoke_tests_status: string;
  verification_evidence?: any;
  rollback_target?: string;
  maturity: 'Conceptual' | 'Prototype' | 'Functional' | 'Verified' | 'Production';
}

export interface VerificationItem {
  id: string;
  entity_type: string;
  entity_id: string;
  verifier_agent_id?: string;
  verifier_type: string;
  status: string;
  evidence: any;
  signature?: string;
  verified_at: string;
}

export interface AuditRecordItem {
  id: string;
  decision_id?: string;
  execution_id?: string;
  workflow_id?: string;
  tenant_id: string;
  actor_type: string;
  actor_id: string;
  agent_id?: string;
  action: string;
  authority_scope: string;
  policy_id: string;
  policy_hash: string;
  input_hash: string;
  output_hash: string;
  risk_level: string;
  decision: string;
  approval_status: string;
  timestamp_utc: string;
}
