import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { auditService } from './AuditService';
import { logger } from '../utils/logger';

export type AuthorityRole = 'super_admin' | 'acc_admin' | 'acc_operator' | 'domain_lead' | 'agent_executor' | 'observer';
export type DecisionType = 'ALLOW' | 'DENY' | 'ESCALATE';

export interface AuthorizeRequest {
  actorId: string;
  actorType: 'human' | 'agent' | 'system';
  actorRole: AuthorityRole;
  action: string;
  resource: string;
  payload?: any;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AuthorizeResult {
  decisionId: string;
  decision: DecisionType;
  requiresHumanApproval: boolean;
  approvalRequestId?: string;
  policyId: string;
  reason: string;
}

const SENSITIVE_OPERATIONS = new Set([
  'workflow_override',
  'policy_mutation',
  'role_reassignment',
  'canonical_registry_change',
  'financial_execution',
  'identity_privilege_elevation',
  'critical_agent_disable',
  'production_destructive_action',
  'production_deploy',
  'code_merge_production'
]);

export class AuthorityService {
  private static instance: AuthorityService;

  public static getInstance(): AuthorityService {
    if (!AuthorityService.instance) {
      AuthorityService.instance = new AuthorityService();
    }
    return AuthorityService.instance;
  }

  public async authorize(req: AuthorizeRequest): Promise<AuthorizeResult> {
    const decisionId = `dec-${randomUUID()}`;
    const policyId = `POL-ACC-GOV-2026-v1`;
    let decision: DecisionType = 'DENY';
    let requiresHumanApproval = false;
    let reason = '';
    let riskLevel = req.riskLevel || 'LOW';

    // 1. Fundamental Rule: Agents must NEVER grant themselves additional authority or have super_admin
    if (req.actorType === 'agent' && req.actorRole === 'super_admin') {
      decision = 'DENY';
      reason = 'Security Invariant Violation: Agents are strictly prohibited from holding super_admin authority.';
    }
    // 2. Observer role is strictly read-only
    else if (req.actorRole === 'observer' && req.action !== 'read' && !req.action.startsWith('view') && !req.action.startsWith('get')) {
      decision = 'DENY';
      reason = 'Observer role is restricted to read-only access.';
    }
    // 3. Sensitive operations require human authorization / escalation
    else if (SENSITIVE_OPERATIONS.has(req.action)) {
      riskLevel = 'HIGH';
      if (req.actorRole === 'super_admin') {
        // Super admin executing directly
        decision = 'ALLOW';
        reason = 'Super admin direct authorization of sensitive operation.';
      } else {
        // Must escalate to approval queue
        decision = 'ESCALATE';
        requiresHumanApproval = true;
        reason = `Action '${req.action}' on '${req.resource}' is classified as sensitive and requires dual human authorization.`;
      }
    }
    // 4. Agent requesting privileged action
    else if (req.actorType === 'agent') {
      if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
        decision = 'ESCALATE';
        requiresHumanApproval = true;
        reason = `Agent requested elevated risk action (${riskLevel}). Human approval required.`;
      } else {
        decision = 'ALLOW';
        reason = `Authorized under agent execution role (${req.actorRole}).`;
      }
    }
    // 5. Standard operator/admin actions
    else if (['super_admin', 'acc_admin', 'acc_operator', 'domain_lead'].includes(req.actorRole)) {
      decision = 'ALLOW';
      reason = `Permitted by operator role credentials (${req.actorRole}).`;
    } else {
      decision = 'DENY';
      reason = `Action '${req.action}' not permitted for role '${req.actorRole}'.`;
    }

    let approvalRequestId: string | undefined;

    // If escalated, create a pending approval request in database
    if (decision === 'ESCALATE' && requiresHumanApproval) {
      approvalRequestId = `appr-${randomUUID()}`;
      await pgPool.query(
        `INSERT INTO approval_requests (
          id, requested_action, requesting_agent, affected_resource, risk_level, policy, reason, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')`,
        [
          approvalRequestId,
          req.action,
          req.actorId,
          req.resource,
          riskLevel,
          policyId,
          reason
        ]
      );
    }

    // Persist Decision Record
    const policyHash = auditService.sha256({ policyId, action: req.action, role: req.actorRole });
    await pgPool.query(
      `INSERT INTO authorization_decisions (
        id, actor_id, actor_type, action, resource, decision, policy_id, policy_hash, reason, context
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)`,
      [
        decisionId,
        req.actorId,
        req.actorType,
        req.action,
        req.resource,
        decision,
        policyId,
        policyHash,
        reason,
        JSON.stringify(req.payload || {})
      ]
    );

    // Audit the decision
    await auditService.record({
      decisionId,
      actorType: req.actorType,
      actorId: req.actorId,
      agentId: req.actorType === 'agent' ? req.actorId : undefined,
      action: `AUTH_CHECK:${req.action}`,
      authorityScope: req.actorRole,
      policyId,
      inputPayload: { action: req.action, resource: req.resource, payload: req.payload },
      outputPayload: { decision, reason, approvalRequestId },
      riskLevel,
      decision,
      approvalStatus: requiresHumanApproval ? 'PENDING' : 'NOT_REQUIRED'
    });

    logger.info({ decisionId, decision, actor: req.actorId, action: req.action }, 'Authorization decision rendered');

    return {
      decisionId,
      decision,
      requiresHumanApproval,
      approvalRequestId,
      policyId,
      reason
    };
  }
}

export const authorityService = AuthorityService.getInstance();
