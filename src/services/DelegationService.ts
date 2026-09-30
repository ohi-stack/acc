import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import {
  ExecutionProvider,
  ResponsibilityStatus,
  WorkOrderStatus,
  getExecutionProviderDefinition,
  isExecutionProvider
} from '../core/delegation-contracts';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const DELEGATION_SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS responsibilities (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(128) NOT NULL,
    name VARCHAR(192) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    provider VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    cadence VARCHAR(128) NOT NULL DEFAULT 'manual',
    triggers JSONB NOT NULL DEFAULT '[]',
    requires_human_approval BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(128) NOT NULL,
    responsibility_id VARCHAR(64) REFERENCES responsibilities(id) ON DELETE SET NULL,
    objective TEXT NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    provider VARCHAR(64) NOT NULL,
    executor_ref VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
    risk_level VARCHAR(32) NOT NULL DEFAULT 'LOW',
    requires_human_approval BOOLEAN NOT NULL DEFAULT FALSE,
    approval_satisfied BOOLEAN NOT NULL DEFAULT FALSE,
    requested_by VARCHAR(64) NOT NULL,
    assigned_to VARCHAR(128),
    required_tools JSONB NOT NULL DEFAULT '[]',
    files JSONB NOT NULL DEFAULT '[]',
    dependencies JSONB NOT NULL DEFAULT '[]',
    schedule JSONB,
    trigger JSONB,
    artifacts JSONB NOT NULL DEFAULT '[]',
    verification JSONB NOT NULL DEFAULT '{}',
    deployment_evidence JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  'CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status)',
  'CREATE INDEX IF NOT EXISTS idx_work_orders_project ON work_orders(project_id)',
  'CREATE INDEX IF NOT EXISTS idx_responsibilities_status ON responsibilities(status)',
  'CREATE INDEX IF NOT EXISTS idx_responsibilities_project ON responsibilities(project_id)'
] as const;

export interface WorkOrderInput {
  projectId: string;
  objective: string;
  provider: string;
  requestedBy: string;
  responsibilityId?: string;
  context?: Record<string, unknown>;
  executorRef?: string;
  assignedTo?: string;
  requiredTools?: string[];
  files?: string[];
  dependencies?: string[];
  schedule?: Record<string, unknown> | null;
  trigger?: Record<string, unknown> | null;
  riskLevel?: RiskLevel;
  requiresHumanApproval?: boolean;
}

export interface NormalizedWorkOrderInput extends Omit<WorkOrderInput, 'provider' | 'riskLevel' | 'requiresHumanApproval'> {
  provider: ExecutionProvider;
  riskLevel: RiskLevel;
  requiresHumanApproval: boolean;
  status: WorkOrderStatus;
  context: Record<string, unknown>;
  requiredTools: string[];
  files: string[];
  dependencies: string[];
  schedule: Record<string, unknown> | null;
  trigger: Record<string, unknown> | null;
}

export interface ResponsibilityInput {
  projectId: string;
  name: string;
  description?: string;
  provider: string;
  ownerId: string;
  cadence?: string;
  triggers?: Record<string, unknown>[];
  requiresHumanApproval?: boolean;
  status?: ResponsibilityStatus;
}

const WORK_ORDER_TRANSITIONS: Record<WorkOrderStatus, readonly WorkOrderStatus[]> = {
  PLANNED: ['READY', 'BLOCKED', 'CANCELLED'],
  READY: ['QUEUED', 'BLOCKED', 'CANCELLED'],
  BLOCKED: ['PLANNED', 'READY', 'CANCELLED'],
  QUEUED: ['RUNNING', 'BLOCKED', 'FAILED', 'CANCELLED'],
  RUNNING: ['AWAITING_APPROVAL', 'COMPLETED', 'FAILED', 'BLOCKED', 'CANCELLED'],
  AWAITING_APPROVAL: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  FAILED: ['PLANNED', 'READY', 'CANCELLED'],
  CANCELLED: []
};

export function assertDispatchableProvider(provider: string): ExecutionProvider {
  if (!isExecutionProvider(provider)) throw new Error(`Unsupported execution provider: ${provider}`);
  const definition = getExecutionProviderDefinition(provider);
  if (!definition.executable) {
    throw new Error(`Execution provider ${provider} is not executable in the current ACC runtime`);
  }
  return provider;
}

export function normalizeWorkOrderInput(input: WorkOrderInput): NormalizedWorkOrderInput {
  if (!input.projectId.trim()) throw new Error('projectId is required');
  if (!input.objective.trim()) throw new Error('objective is required');
  if (!input.requestedBy.trim()) throw new Error('requestedBy is required');
  if (!isExecutionProvider(input.provider)) throw new Error(`Unsupported execution provider: ${input.provider}`);

  return {
    ...input,
    projectId: input.projectId.trim(),
    objective: input.objective.trim(),
    requestedBy: input.requestedBy.trim(),
    provider: input.provider,
    status: 'PLANNED',
    context: input.context ?? {},
    requiredTools: input.requiredTools ?? [],
    files: input.files ?? [],
    dependencies: input.dependencies ?? [],
    schedule: input.schedule ?? null,
    trigger: input.trigger ?? null,
    riskLevel: input.riskLevel ?? 'LOW',
    requiresHumanApproval: input.requiresHumanApproval ?? false
  };
}

export function canTransitionWorkOrder(
  from: WorkOrderStatus,
  to: WorkOrderStatus,
  requiresHumanApproval: boolean,
  approvalSatisfied: boolean
): boolean {
  if (!WORK_ORDER_TRANSITIONS[from].includes(to)) return false;
  if (to === 'COMPLETED' && requiresHumanApproval && !approvalSatisfied) return false;
  return true;
}

export class DelegationService {
  private schemaReady = false;

  private async ensureSchema(): Promise<void> {
    if (this.schemaReady) return;
    for (const statement of DELEGATION_SCHEMA_STATEMENTS) await pgPool.query(statement);
    this.schemaReady = true;
  }

  async listWorkOrders(status?: string) {
    await this.ensureSchema();
    const values: unknown[] = [];
    let sql = 'SELECT * FROM work_orders';
    if (status) {
      values.push(status);
      sql += ' WHERE status = $1';
    }
    sql += ' ORDER BY created_at DESC';
    const result = await pgPool.query(sql, values);
    return result.rows;
  }

  async getWorkOrder(id: string) {
    await this.ensureSchema();
    const result = await pgPool.query('SELECT * FROM work_orders WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async createWorkOrder(input: WorkOrderInput) {
    await this.ensureSchema();
    const normalized = normalizeWorkOrderInput(input);
    const id = `wo-${randomUUID()}`;
    const result = await pgPool.query(
      `INSERT INTO work_orders (
        id, project_id, responsibility_id, objective, context, provider, executor_ref,
        status, risk_level, requires_human_approval, requested_by, assigned_to,
        required_tools, files, dependencies, schedule, trigger
      ) VALUES (
        $1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11, $12,
        $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb
      ) RETURNING *`,
      [
        id, normalized.projectId, normalized.responsibilityId ?? null, normalized.objective,
        JSON.stringify(normalized.context), normalized.provider, normalized.executorRef ?? null,
        normalized.status, normalized.riskLevel, normalized.requiresHumanApproval,
        normalized.requestedBy, normalized.assignedTo ?? null,
        JSON.stringify(normalized.requiredTools), JSON.stringify(normalized.files),
        JSON.stringify(normalized.dependencies), JSON.stringify(normalized.schedule), JSON.stringify(normalized.trigger)
      ]
    );
    return result.rows[0];
  }

  async updateWorkOrderStatus(id: string, nextStatus: WorkOrderStatus, approvalSatisfied = false) {
    await this.ensureSchema();
    const current = await this.getWorkOrder(id);
    if (!current) throw new Error('Work order not found');
    if (!canTransitionWorkOrder(
      current.status as WorkOrderStatus,
      nextStatus,
      Boolean(current.requires_human_approval),
      approvalSatisfied || Boolean(current.approval_satisfied)
    )) throw new Error(`Invalid work order transition: ${current.status} -> ${nextStatus}`);

    const result = await pgPool.query(
      `UPDATE work_orders
       SET status = $1,
           approval_satisfied = CASE WHEN $2 THEN TRUE ELSE approval_satisfied END,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [nextStatus, approvalSatisfied, id]
    );
    return result.rows[0];
  }

  async listResponsibilities(status?: string) {
    await this.ensureSchema();
    const values: unknown[] = [];
    let sql = 'SELECT * FROM responsibilities';
    if (status) {
      values.push(status);
      sql += ' WHERE status = $1';
    }
    sql += ' ORDER BY created_at DESC';
    const result = await pgPool.query(sql, values);
    return result.rows;
  }

  async createResponsibility(input: ResponsibilityInput) {
    await this.ensureSchema();
    if (!input.projectId.trim()) throw new Error('projectId is required');
    if (!input.name.trim()) throw new Error('name is required');
    if (!input.ownerId.trim()) throw new Error('ownerId is required');
    if (!isExecutionProvider(input.provider)) throw new Error(`Unsupported execution provider: ${input.provider}`);

    const id = `rsp-${randomUUID()}`;
    const result = await pgPool.query(
      `INSERT INTO responsibilities (
        id, project_id, name, description, status, provider, owner_id,
        cadence, triggers, requires_human_approval
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
      RETURNING *`,
      [
        id, input.projectId.trim(), input.name.trim(), input.description ?? '', input.status ?? 'DRAFT',
        input.provider, input.ownerId.trim(), input.cadence ?? 'manual',
        JSON.stringify(input.triggers ?? []), input.requiresHumanApproval ?? false
      ]
    );
    return result.rows[0];
  }
}

export const delegationService = new DelegationService();
