import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  username: varchar('username', { length: 64 }),
  name: varchar('name', { length: 128 }),
  email: varchar('email', { length: 128 }).notNull(),
  role: varchar('role', { length: 32 }).notNull().default('acc_operator'),
  apiKeyHash: varchar('api_key_hash', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Agents table
export const agents = pgTable('agents', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  type: varchar('type', { length: 64 }).notNull(),
  classification: varchar('classification', { length: 64 }), // Class A, Class B, Class C
  division: varchar('division', { length: 64 }),
  sourceTimestamp: varchar('source_timestamp', { length: 64 }),
  sourceRecord: varchar('source_record', { length: 128 }),
  registryState: varchar('registry_state', { length: 32 }).default('Registered'),
  operationalState: varchar('operational_state', { length: 32 }).default('Production'),
  version: varchar('version', { length: 32 }).notNull().default('1.0.0'),
  status: varchar('status', { length: 32 }).notNull().default('READY'),
  capabilities: jsonb('capabilities').notNull().default([]),
  supportedTaskTypes: jsonb('supported_task_types').notNull().default([]),
  environment: varchar('environment', { length: 32 }).notNull().default('production'),
  maxConcurrency: integer('max_concurrency').notNull().default(1),
  currentWorkload: integer('current_workload').notNull().default(0),
  queueAffinity: varchar('queue_affinity', { length: 64 }).notNull().default('acc-tasks'),
  authorityRole: varchar('authority_role', { length: 32 }).notNull().default('agent_executor'),
  tenantScope: varchar('tenant_scope', { length: 64 }).notNull().default('onegodian-main'),
  modelAdapter: varchar('model_adapter', { length: 64 }).notNull().default('gemini-3.8-flash'),
  lastHeartbeat: timestamp('last_heartbeat', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: varchar('id', { length: 64 }).primaryKey(),
  type: varchar('type', { length: 128 }).notNull(),
  payload: jsonb('payload').notNull().default({}),
  status: varchar('status', { length: 32 }).notNull().default('CREATED'),
  priority: varchar('priority', { length: 32 }).notNull().default('NORMAL'),
  submittedBy: varchar('submitted_by', { length: 64 }).notNull(),
  assignedAgentId: varchar('assigned_agent_id', { length: 64 }),
  workflowId: varchar('workflow_id', { length: 64 }),
  correlationId: varchar('correlation_id', { length: 64 }),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  error: text('error'),
  result: jsonb('result'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

// Task Events
export const taskEvents = pgTable('task_events', {
  id: varchar('id', { length: 64 }).primaryKey(),
  taskId: varchar('task_id', { length: 64 }).notNull(),
  eventType: varchar('event_type', { length: 64 }).notNull(),
  fromStatus: varchar('from_status', { length: 32 }),
  toStatus: varchar('to_status', { length: 32 }),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Workflows
export const workflows = pgTable('workflows', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 32 }).notNull().default('active'),
  steps: jsonb('steps').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Workflow Runs
export const workflowRuns = pgTable('workflow_runs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  workflowId: varchar('workflow_id', { length: 64 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('RUNNING'),
  currentStep: integer('current_step').notNull().default(0),
  inputs: jsonb('inputs').default({}),
  outputs: jsonb('outputs').default({}),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

// Executions
export const executions = pgTable('executions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  taskId: varchar('task_id', { length: 64 }),
  agentId: varchar('agent_id', { length: 64 }),
  workflowId: varchar('workflow_id', { length: 64 }),
  provider: varchar('provider', { length: 64 }).notNull(),
  model: varchar('model', { length: 64 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('PENDING'),
  riskLevel: varchar('risk_level', { length: 32 }).notNull().default('LOW'),
  inputPayload: jsonb('input_payload').notNull().default({}),
  outputPayload: jsonb('output_payload'),
  durationMs: integer('duration_ms'),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

// Approval Requests
export const approvalRequests = pgTable('approval_requests', {
  id: varchar('id', { length: 64 }).primaryKey(),
  executionId: varchar('execution_id', { length: 64 }),
  taskId: varchar('task_id', { length: 64 }),
  workflowId: varchar('workflow_id', { length: 64 }),
  requestedAction: varchar('requested_action', { length: 128 }).notNull(),
  requestingAgent: varchar('requesting_agent', { length: 64 }).notNull(),
  affectedResource: varchar('affected_resource', { length: 128 }).notNull(),
  riskLevel: varchar('risk_level', { length: 32 }).notNull().default('MEDIUM'),
  policy: varchar('policy', { length: 128 }).notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('PENDING'),
  decidedBy: varchar('decided_by', { length: 64 }),
  decisionReason: text('decision_reason'),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Connections
export const connections = pgTable('connections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  platform: varchar('platform', { length: 64 }).notNull(),
  adapter: varchar('adapter', { length: 64 }).notNull(),
  connectionClass: varchar('connection_class', { length: 64 }).notNull(),
  protocol: varchar('protocol', { length: 32 }).notNull(),
  authMethod: varchar('auth_method', { length: 64 }).notNull(),
  capabilities: jsonb('capabilities').notNull().default([]),
  readPermissions: jsonb('read_permissions').notNull().default([]),
  writePermissions: jsonb('write_permissions').notNull().default([]),
  requiresHumanApproval: boolean('requires_human_approval').notNull().default(false),
  environment: varchar('environment', { length: 32 }).notNull().default('production'),
  health: varchar('health', { length: 32 }).notNull().default('Healthy'),
  version: varchar('version', { length: 32 }).notNull().default('1.0.0'),
  lastSuccessfulOperation: timestamp('last_successful_operation', { withTimezone: true }),
  rateLimits: varchar('rate_limits', { length: 128 }),
  auditPolicy: varchar('audit_policy', { length: 128 }),
  verificationPolicy: varchar('verification_policy', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Providers
export const providers = pgTable('providers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  provider: varchar('provider', { length: 64 }).notNull(),
  model: varchar('model', { length: 64 }).notNull(),
  capabilities: jsonb('capabilities').notNull().default([]),
  availability: varchar('availability', { length: 32 }).notNull().default('AVAILABLE'),
  health: varchar('health', { length: 32 }).notNull().default('Healthy'),
  authState: varchar('auth_state', { length: 64 }).notNull().default('AUTHENTICATED'),
  toolSupport: boolean('tool_support').notNull().default(true),
  structuredOutput: boolean('structured_output').notNull().default(true),
  latencyMs: integer('latency_ms').default(0),
  costMetadata: jsonb('cost_metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Deployments
export const deployments = pgTable('deployments', {
  id: varchar('id', { length: 64 }).primaryKey(),
  repository: varchar('repository', { length: 128 }).notNull(),
  branch: varchar('branch', { length: 64 }).notNull(),
  prNumber: integer('pr_number'),
  mergedSha: varchar('merged_sha', { length: 64 }).notNull(),
  deployedSha: varchar('deployed_sha', { length: 64 }).notNull(),
  environment: varchar('environment', { length: 32 }).notNull().default('production'),
  deploymentStart: timestamp('deployment_start', { withTimezone: true }).notNull().defaultNow(),
  deploymentCompletion: timestamp('deployment_completion', { withTimezone: true }),
  healthCheckStatus: varchar('health_check_status', { length: 32 }).notNull().default('Healthy'),
  smokeTestsStatus: varchar('smoke_tests_status', { length: 32 }).notNull().default('Passed'),
  verificationEvidence: jsonb('verification_evidence').default({}),
  rollbackTarget: varchar('rollback_target', { length: 64 }),
  maturity: varchar('maturity', { length: 32 }).notNull().default('Functional'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Verification Records
export const verificationRecords = pgTable('verification_records', {
  id: varchar('id', { length: 64 }).primaryKey(),
  entityType: varchar('entity_type', { length: 64 }).notNull(),
  entityId: varchar('entity_id', { length: 64 }).notNull(),
  verifierAgentId: varchar('verifier_agent_id', { length: 64 }),
  verifierType: varchar('verifier_type', { length: 64 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  evidence: jsonb('evidence').notNull().default({}),
  signature: varchar('signature', { length: 256 }),
  verifiedAt: timestamp('verified_at', { withTimezone: true }).notNull().defaultNow()
});

// Audit Records
export const auditRecords = pgTable('audit_records', {
  id: varchar('id', { length: 64 }).primaryKey(),
  decisionId: varchar('decision_id', { length: 64 }),
  executionId: varchar('execution_id', { length: 64 }),
  workflowId: varchar('workflow_id', { length: 64 }),
  tenantId: varchar('tenant_id', { length: 64 }).notNull().default('onegodian-main'),
  actorType: varchar('actor_type', { length: 32 }).notNull(),
  actorId: varchar('actor_id', { length: 64 }).notNull(),
  agentId: varchar('agent_id', { length: 64 }),
  action: varchar('action', { length: 128 }).notNull(),
  authorityScope: varchar('authority_scope', { length: 128 }).notNull(),
  policyId: varchar('policy_id', { length: 64 }).notNull(),
  policyHash: varchar('policy_hash', { length: 128 }).notNull(),
  inputHash: varchar('input_hash', { length: 128 }).notNull(),
  outputHash: varchar('output_hash', { length: 128 }).notNull(),
  riskLevel: varchar('risk_level', { length: 32 }).notNull(),
  decision: varchar('decision', { length: 32 }).notNull(),
  approvalStatus: varchar('approval_status', { length: 32 }).notNull(),
  timestampUtc: timestamp('timestamp_utc', { withTimezone: true }).notNull().defaultNow()
});
