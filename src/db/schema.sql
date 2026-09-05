-- ACC™ Database Schema (PostgreSQL 16)
-- Canonical: acc.onegodian.com
-- Owner: ONEGODIAN, LLC

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL, -- super_admin, acc_admin, acc_operator, domain_lead, agent_executor, observer
  api_key_hash VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(64) NOT NULL,
  version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
  status VARCHAR(32) NOT NULL DEFAULT 'READY', -- DRAFT, READY, AUTHORIZED, EXECUTING, COMPLETED, FAILED, TERMINATED, ESCALATED
  capabilities JSONB NOT NULL DEFAULT '[]',
  supported_task_types JSONB NOT NULL DEFAULT '[]',
  environment VARCHAR(32) NOT NULL DEFAULT 'production',
  max_concurrency INT NOT NULL DEFAULT 1,
  current_workload INT NOT NULL DEFAULT 0,
  queue_affinity VARCHAR(64) NOT NULL DEFAULT 'acc-tasks',
  authority_role VARCHAR(32) NOT NULL DEFAULT 'agent_executor',
  tenant_scope VARCHAR(64) NOT NULL DEFAULT 'onegodian-main',
  model_adapter VARCHAR(64) NOT NULL DEFAULT 'gemini-3.8-flash',
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_capabilities (
  id VARCHAR(64) PRIMARY KEY,
  agent_id VARCHAR(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  risk_level VARCHAR(32) NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
  requires_human_approval BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(128) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- CREATED, VALIDATED, QUEUED, RESERVED, RUNNING, COMPLETED, FAILED, CANCELLED, DEAD_LETTERED
  priority VARCHAR(32) NOT NULL DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, CRITICAL
  submitted_by VARCHAR(64) NOT NULL,
  assigned_agent_id VARCHAR(64) REFERENCES agents(id),
  workflow_id VARCHAR(64),
  correlation_id VARCHAR(64),
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  error TEXT,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS task_events (
  id VARCHAR(64) PRIMARY KEY,
  task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  event_type VARCHAR(64) NOT NULL,
  from_status VARCHAR(32),
  to_status VARCHAR(32),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflows (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, inactive, archived
  steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  name VARCHAR(128) NOT NULL,
  agent_id VARCHAR(64),
  task_type VARCHAR(128) NOT NULL,
  requires_approval BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id VARCHAR(64) PRIMARY KEY,
  workflow_id VARCHAR(64) NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'RUNNING', -- RUNNING, COMPLETED, FAILED, PAUSED
  current_step INT NOT NULL DEFAULT 0,
  inputs JSONB DEFAULT '{}',
  outputs JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS executions (
  id VARCHAR(64) PRIMARY KEY,
  task_id VARCHAR(64) REFERENCES tasks(id),
  agent_id VARCHAR(64) REFERENCES agents(id),
  workflow_id VARCHAR(64),
  provider VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, AUTHORIZED, RUNNING, COMPLETED, FAILED, ESCALATED, REJECTED
  risk_level VARCHAR(32) NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
  input_payload JSONB NOT NULL DEFAULT '{}',
  output_payload JSONB,
  duration_ms INT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS execution_events (
  id VARCHAR(64) PRIMARY KEY,
  execution_id VARCHAR(64) NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  stage VARCHAR(64) NOT NULL, -- Request, Validation, Authorization, Queue, Assignment, Model/Agent, Tool Invocation, Output, Verification, Human Decision, Persistence, Final Status
  message TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id VARCHAR(64) PRIMARY KEY,
  execution_id VARCHAR(64) REFERENCES executions(id),
  task_id VARCHAR(64) REFERENCES tasks(id),
  workflow_id VARCHAR(64),
  requested_action VARCHAR(128) NOT NULL,
  requesting_agent VARCHAR(64) NOT NULL,
  affected_resource VARCHAR(128) NOT NULL,
  risk_level VARCHAR(32) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
  policy VARCHAR(128) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
  decided_by VARCHAR(64),
  decision_reason TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authorization_decisions (
  id VARCHAR(64) PRIMARY KEY,
  actor_id VARCHAR(64) NOT NULL,
  actor_type VARCHAR(32) NOT NULL, -- human, agent, system
  action VARCHAR(128) NOT NULL,
  resource VARCHAR(128) NOT NULL,
  decision VARCHAR(32) NOT NULL, -- ALLOW, DENY, ESCALATE
  policy_id VARCHAR(64) NOT NULL,
  policy_hash VARCHAR(128) NOT NULL,
  reason TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connections (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  platform VARCHAR(64) NOT NULL,
  adapter VARCHAR(64) NOT NULL,
  connection_class VARCHAR(64) NOT NULL, -- Model Connections, Data Connections, Action Connections, Environment Connections
  protocol VARCHAR(32) NOT NULL,
  auth_method VARCHAR(64) NOT NULL,
  capabilities JSONB NOT NULL DEFAULT '[]',
  read_permissions JSONB NOT NULL DEFAULT '[]',
  write_permissions JSONB NOT NULL DEFAULT '[]',
  requires_human_approval BOOLEAN NOT NULL DEFAULT FALSE,
  environment VARCHAR(32) NOT NULL DEFAULT 'production',
  health VARCHAR(32) NOT NULL DEFAULT 'Healthy', -- Healthy, Degraded, Offline, Authorization Required, Unknown
  version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
  last_successful_operation TIMESTAMPTZ,
  rate_limits VARCHAR(128),
  audit_policy VARCHAR(128),
  verification_policy VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
  id VARCHAR(64) PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  capabilities JSONB NOT NULL DEFAULT '[]',
  availability VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
  health VARCHAR(32) NOT NULL DEFAULT 'Healthy',
  auth_state VARCHAR(64) NOT NULL DEFAULT 'AUTHENTICATED',
  tool_support BOOLEAN NOT NULL DEFAULT TRUE,
  structured_output BOOLEAN NOT NULL DEFAULT TRUE,
  latency_ms INT DEFAULT 0,
  cost_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deployments (
  id VARCHAR(64) PRIMARY KEY,
  repository VARCHAR(128) NOT NULL,
  branch VARCHAR(64) NOT NULL,
  pr_number INT,
  merged_sha VARCHAR(64) NOT NULL,
  deployed_sha VARCHAR(64) NOT NULL,
  environment VARCHAR(32) NOT NULL DEFAULT 'production',
  deployment_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deployment_completion TIMESTAMPTZ,
  health_check_status VARCHAR(32) NOT NULL DEFAULT 'Healthy',
  smoke_tests_status VARCHAR(32) NOT NULL DEFAULT 'Passed',
  verification_evidence JSONB DEFAULT '{}',
  rollback_target VARCHAR(64),
  maturity VARCHAR(32) NOT NULL DEFAULT 'Functional', -- Conceptual, Prototype, Functional, Verified, Production
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_records (
  id VARCHAR(64) PRIMARY KEY,
  entity_type VARCHAR(64) NOT NULL, -- task, execution, deployment, pr, workflow
  entity_id VARCHAR(64) NOT NULL,
  verifier_agent_id VARCHAR(64),
  verifier_type VARCHAR(64) NOT NULL, -- QR-V, OMOS, Council, SmokeTest, HashCheck
  status VARCHAR(32) NOT NULL, -- VERIFIED, FAILED, INCONCLUSIVE
  evidence JSONB NOT NULL DEFAULT '{}',
  signature VARCHAR(256),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_records (
  id VARCHAR(64) PRIMARY KEY,
  decision_id VARCHAR(64),
  execution_id VARCHAR(64),
  workflow_id VARCHAR(64),
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'onegodian-main',
  actor_type VARCHAR(32) NOT NULL, -- human, agent, system
  actor_id VARCHAR(64) NOT NULL,
  agent_id VARCHAR(64),
  action VARCHAR(128) NOT NULL,
  authority_scope VARCHAR(128) NOT NULL,
  policy_id VARCHAR(64) NOT NULL,
  policy_hash VARCHAR(128) NOT NULL,
  input_hash VARCHAR(128) NOT NULL,
  output_hash VARCHAR(128) NOT NULL,
  risk_level VARCHAR(32) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  decision VARCHAR(32) NOT NULL, -- ALLOW, DENY, ESCALATE
  approval_status VARCHAR(32) NOT NULL, -- NOT_REQUIRED, PENDING, APPROVED, REJECTED
  timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_executions_task_id ON executions(task_id);
CREATE INDEX IF NOT EXISTS idx_audit_records_time ON audit_records(timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approval_requests(status);
