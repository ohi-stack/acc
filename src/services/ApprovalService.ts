import { pgPool } from '../db/postgres';
import { auditService } from './AuditService';
import { taskService } from './TaskService';
import { logger } from '../utils/logger';

export interface DecideApprovalInput {
  approvalId: string;
  decision: 'APPROVED' | 'REJECTED';
  decidedBy: string;
  reason?: string;
}

export class ApprovalService {
  private static instance: ApprovalService;

  public static getInstance(): ApprovalService {
    if (!ApprovalService.instance) {
      ApprovalService.instance = new ApprovalService();
    }
    return ApprovalService.instance;
  }

  public async listApprovals(status?: string): Promise<any[]> {
    let query = `SELECT * FROM approval_requests`;
    const params: any[] = [];
    if (status && status !== 'ALL') {
      params.push(status);
      query += ` WHERE status = $1`;
    }
    query += ` ORDER BY created_at DESC`;
    const res = await pgPool.query(query, params);
    return res.rows;
  }

  public async getPendingCount(): Promise<number> {
    const res = await pgPool.query(`SELECT COUNT(*) as count FROM approval_requests WHERE status = 'PENDING'`);
    return parseInt(res.rows[0]?.count || '0', 10);
  }

  public async decide(input: DecideApprovalInput): Promise<any> {
    const reqRes = await pgPool.query(`SELECT * FROM approval_requests WHERE id = $1`, [input.approvalId]);
    if (!reqRes.rows.length) {
      throw new Error(`Approval request ${input.approvalId} not found`);
    }
    const approval = reqRes.rows[0];

    if (approval.status !== 'PENDING') {
      throw new Error(`Approval request is already in status '${approval.status}'`);
    }

    logger.info({ approvalId: input.approvalId, decision: input.decision, actor: input.decidedBy }, 'Processing human operator approval decision');

    const res = await pgPool.query(
      `UPDATE approval_requests SET
        status = $1,
        decided_by = $2,
        decision_reason = $3,
        decided_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [input.decision, input.decidedBy, input.reason || `Operator manual decision: ${input.decision}`, input.approvalId]
    );

    const updated = res.rows[0];

    // If associated with task, transition task
    if (approval.task_id) {
      if (input.decision === 'APPROVED') {
        await taskService.transitionStatus(approval.task_id, 'QUEUED', {
          reason: `Human operator approval granted by ${input.decidedBy}`,
          approvalId: input.approvalId
        });
      } else {
        await taskService.transitionStatus(approval.task_id, 'CANCELLED', {
          error: `Human operator rejected approval request: ${input.reason || 'Denied'}`,
          approvalId: input.approvalId
        });
      }
    }

    // Authoritative Audit Log
    await auditService.record({
      decisionId: input.approvalId,
      executionId: approval.execution_id || undefined,
      workflowId: approval.workflow_id || undefined,
      actorType: 'human',
      actorId: input.decidedBy,
      agentId: approval.requesting_agent,
      action: `HUMAN_APPROVAL_DECISION:${approval.requested_action}`,
      authorityScope: 'super_admin',
      policyId: approval.policy || 'POL-HUMAN-GATE-01',
      inputPayload: { approvalId: input.approvalId, requestedAction: approval.requested_action },
      outputPayload: { decision: input.decision, reason: input.reason },
      riskLevel: approval.risk_level || 'HIGH',
      decision: input.decision === 'APPROVED' ? 'ALLOW' : 'DENY',
      approvalStatus: input.decision
    });

    return updated;
  }
}

export const approvalService = ApprovalService.getInstance();
