import { createHash, randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { logger } from '../utils/logger';

export interface AuditRecordInput {
  decisionId?: string;
  executionId?: string;
  workflowId?: string;
  tenantId?: string;
  actorType: 'human' | 'agent' | 'system';
  actorId: string;
  agentId?: string;
  action: string;
  authorityScope: string;
  policyId: string;
  inputPayload: any;
  outputPayload?: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: 'ALLOW' | 'DENY' | 'ESCALATE';
  approvalStatus: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class AuditService {
  private static instance: AuditService;

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  public sha256(data: any): string {
    const str = typeof data === 'string' ? data : JSON.stringify(data || {});
    return createHash('sha256').update(str).digest('hex');
  }

  public async record(input: AuditRecordInput): Promise<string> {
    const id = `aud-${randomUUID()}`;
    const policyHash = this.sha256({ policyId: input.policyId, scope: input.authorityScope });
    const inputHash = this.sha256(input.inputPayload);
    const outputHash = this.sha256(input.outputPayload || { status: input.decision });
    const tenantId = input.tenantId || 'onegodian-main';

    logger.info({
      auditId: id,
      action: input.action,
      actor: input.actorId,
      decision: input.decision
    }, 'Writing authoritative append-only audit record');

    await pgPool.query(
      `INSERT INTO audit_records (
        id, decision_id, execution_id, workflow_id, tenant_id, actor_type, actor_id, agent_id,
        action, authority_scope, policy_id, policy_hash, input_hash, output_hash,
        risk_level, decision, approval_status, timestamp_utc
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())`,
      [
        id,
        input.decisionId || null,
        input.executionId || null,
        input.workflowId || null,
        tenantId,
        input.actorType,
        input.actorId,
        input.agentId || null,
        input.action,
        input.authorityScope,
        input.policyId,
        policyHash,
        inputHash,
        outputHash,
        input.riskLevel,
        input.decision,
        input.approvalStatus
      ]
    );

    return id;
  }

  public async list(limit: number = 50, offset: number = 0): Promise<any[]> {
    const res = await pgPool.query(
      `SELECT * FROM audit_records ORDER BY timestamp_utc DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.rows;
  }

  public async count(): Promise<number> {
    const res = await pgPool.query(`SELECT COUNT(*) as count FROM audit_records`);
    return parseInt(res.rows[0]?.count || '0', 10);
  }
}

export const auditService = AuditService.getInstance();
