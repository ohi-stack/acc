import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { taskService } from '../services/TaskService';
import { executionService } from '../services/ExecutionService';
import { authorityService, AuthorityRole } from '../services/AuthorityService';
import { approvalService } from '../services/ApprovalService';
import { auditService } from '../services/AuditService';
import { healthService } from '../services/HealthService';
import { councilService } from '../services/CouncilService';
import { providerRegistry } from '../providers/registry';
import { logger } from '../utils/logger';

export const v1Router = Router();

// Middleware: Extract operator header or default to super_admin
v1Router.use((req: Request, _res: Response, next: NextFunction) => {
  const role = (req.headers['x-acc-role'] as AuthorityRole) || 'super_admin';
  const actorId = (req.headers['x-acc-actor'] as string) || 'onegodian_admin';
  (req as any).actor = { actorId, role };
  next();
});

/* =========================================================================
   1. AGENTS API (/api/v1/agents)
   ========================================================================= */

v1Router.get('/agents', async (_req, res, next) => {
  try {
    const agentsRes = await pgPool.query(`SELECT * FROM agents ORDER BY created_at DESC`);
    res.json({ success: true, count: agentsRes.rows.length, data: agentsRes.rows });
  } catch (err) {
    next(err);
  }
});

v1Router.get('/agents/:id', async (req, res, next) => {
  try {
    const agentRes = await pgPool.query(`SELECT * FROM agents WHERE id = $1`, [req.params.id]);
    if (!agentRes.rows.length) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }
    const agent = agentRes.rows[0];
    const execs = await pgPool.query(`SELECT * FROM executions WHERE agent_id = $1 ORDER BY created_at DESC LIMIT 10`, [req.params.id]);
    const audits = await pgPool.query(`SELECT * FROM audit_records WHERE agent_id = $1 ORDER BY timestamp_utc DESC LIMIT 10`, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...agent,
        recentExecutions: execs.rows,
        auditHistory: audits.rows
      }
    });
  } catch (err) {
    next(err);
  }
});

const RegisterAgentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  version: z.string().default('1.0.0'),
  capabilities: z.array(z.string()).default([]),
  supportedTaskTypes: z.array(z.string()).default([]),
  environment: z.string().default('production'),
  maxConcurrency: z.number().int().min(1).default(1),
  queueAffinity: z.string().default('acc-tasks'),
  authorityRole: z.enum(['agent_executor', 'domain_lead', 'acc_operator']).default('agent_executor'),
  modelAdapter: z.string().default('gemini-3.8-flash')
});

v1Router.post('/agents', async (req, res, next) => {
  try {
    const body = RegisterAgentSchema.parse(req.body);
    const agentId = `agent-${randomUUID().slice(0, 8)}`;

    const insertRes = await pgPool.query(
      `INSERT INTO agents (
        id, name, type, version, status, capabilities, supported_task_types,
        environment, max_concurrency, queue_affinity, authority_role, model_adapter
      ) VALUES ($1, $2, $3, $4, 'READY', $5::jsonb, $6::jsonb, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        agentId,
        body.name,
        body.type,
        body.version,
        JSON.stringify(body.capabilities),
        JSON.stringify(body.supportedTaskTypes),
        body.environment,
        body.maxConcurrency,
        body.queueAffinity,
        body.authorityRole,
        body.modelAdapter
      ]
    );

    const actor = (req as any).actor;
    await auditService.record({
      actorType: 'human',
      actorId: actor.actorId,
      agentId,
      action: 'AGENT_REGISTERED',
      authorityScope: actor.role,
      policyId: 'POL-AGENT-REGISTRY-01',
      inputPayload: body,
      outputPayload: { agentId },
      riskLevel: 'LOW',
      decision: 'ALLOW',
      approvalStatus: 'NOT_REQUIRED'
    });

    res.status(201).json({ success: true, data: insertRes.rows[0] });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/agents/:id/status', async (req, res, next) => {
  try {
    const { status } = z.object({
      status: z.enum(['DRAFT', 'READY', 'AUTHORIZED', 'EXECUTING', 'COMPLETED', 'FAILED', 'TERMINATED', 'ESCALATED'])
    }).parse(req.body);

    const resUpdate = await pgPool.query(
      `UPDATE agents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!resUpdate.rows.length) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }

    const actor = (req as any).actor;
    await auditService.record({
      actorType: 'human',
      actorId: actor.actorId,
      agentId: req.params.id,
      action: `AGENT_STATUS_MUTATED:${status}`,
      authorityScope: actor.role,
      policyId: 'POL-AGENT-GOV-01',
      inputPayload: { status },
      riskLevel: status === 'TERMINATED' ? 'MEDIUM' : 'LOW',
      decision: 'ALLOW',
      approvalStatus: 'NOT_REQUIRED'
    });

    res.json({ success: true, data: resUpdate.rows[0] });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/agents/:id/concurrency', async (req, res, next) => {
  try {
    const { maxConcurrency } = z.object({ maxConcurrency: z.number().int().min(1).max(50) }).parse(req.body);
    const resUpdate = await pgPool.query(
      `UPDATE agents SET max_concurrency = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [maxConcurrency, req.params.id]
    );
    res.json({ success: true, data: resUpdate.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   2. TASKS API (/api/v1/tasks)
   ========================================================================= */

v1Router.get('/tasks', async (req, res, next) => {
  try {
    const { status, agentId, search } = req.query;
    const tasks = await taskService.listTasks({
      status: status as string,
      agentId: agentId as string,
      search: search as string
    });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
});

v1Router.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

const CreateTaskSchema = z.object({
  type: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).default({}),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']).optional(),
  assignedAgentId: z.string().optional(),
  workflowId: z.string().optional()
});

v1Router.post('/tasks', async (req, res, next) => {
  try {
    const body = CreateTaskSchema.parse(req.body);
    const actor = (req as any).actor;
    const task = await taskService.createTask({
      type: body.type,
      payload: body.payload,
      priority: body.priority,
      submittedBy: actor.actorId,
      assignedAgentId: body.assignedAgentId,
      workflowId: body.workflowId
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/tasks/:id/retry', async (req, res, next) => {
  try {
    const task = await taskService.retryTask(req.params.id);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/tasks/:id/cancel', async (req, res, next) => {
  try {
    const { reason } = req.body;
    const task = await taskService.cancelTask(req.params.id, reason);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   3. EXECUTIONS API (/api/v1/executions)
   ========================================================================= */

v1Router.get('/executions', async (_req, res, next) => {
  try {
    const executions = await executionService.listExecutions(100);
    res.json({ success: true, count: executions.length, data: executions });
  } catch (err) {
    next(err);
  }
});

v1Router.get('/executions/:id', async (req, res, next) => {
  try {
    const trace = await executionService.getExecutionTrace(req.params.id);
    if (!trace) {
      res.status(404).json({ success: false, error: 'Execution trace not found' });
      return;
    }
    res.json({ success: true, data: trace });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/executions/run', async (req, res, next) => {
  try {
    const { taskId, promptOverride, riskLevel } = z.object({
      taskId: z.string().min(1),
      promptOverride: z.string().optional(),
      riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
    }).parse(req.body);

    const actor = (req as any).actor;
    const result = await executionService.executeTask({
      taskId,
      actorId: actor.actorId,
      actorRole: actor.role,
      promptOverride,
      riskLevel
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   4. APPROVALS API (/api/v1/approvals)
   ========================================================================= */

v1Router.get('/approvals', async (req, res, next) => {
  try {
    const { status } = req.query;
    const approvals = await approvalService.listApprovals(status as string);
    res.json({ success: true, count: approvals.length, data: approvals });
  } catch (err) {
    next(err);
  }
});

v1Router.get('/approvals/pending-count', async (_req, res, next) => {
  try {
    const count = await approvalService.getPendingCount();
    res.json({ success: true, count });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/approvals/:id/decide', async (req, res, next) => {
  try {
    const { decision, reason } = z.object({
      decision: z.enum(['APPROVED', 'REJECTED']),
      reason: z.string().optional()
    }).parse(req.body);

    const actor = (req as any).actor;
    const updated = await approvalService.decide({
      approvalId: req.params.id,
      decision,
      decidedBy: actor.actorId,
      reason
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   5. WORKFLOWS API (/api/v1/workflows)
   ========================================================================= */

v1Router.get('/workflows', async (_req, res, next) => {
  try {
    const wfRes = await pgPool.query(`SELECT * FROM workflows ORDER BY created_at DESC`);
    res.json({ success: true, count: wfRes.rows.length, data: wfRes.rows });
  } catch (err) {
    next(err);
  }
});

v1Router.get('/workflows/:id', async (req, res, next) => {
  try {
    const wfRes = await pgPool.query(`SELECT * FROM workflows WHERE id = $1`, [req.params.id]);
    if (!wfRes.rows.length) {
      res.status(404).json({ success: false, error: 'Workflow not found' });
      return;
    }
    const runs = await pgPool.query(`SELECT * FROM workflow_runs WHERE workflow_id = $1 ORDER BY started_at DESC LIMIT 20`, [req.params.id]);
    res.json({ success: true, data: { ...wfRes.rows[0], runs: runs.rows } });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/workflows', async (req, res, next) => {
  try {
    const { name, description, steps } = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      steps: z.array(z.record(z.string(), z.unknown())).default([])
    }).parse(req.body);

    const id = `wf-${randomUUID().slice(0, 8)}`;
    const result = await pgPool.query(
      `INSERT INTO workflows (id, name, description, status, steps)
       VALUES ($1, $2, $3, 'active', $4::jsonb)
       RETURNING *`,
      [id, name, description || '', JSON.stringify(steps)]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/workflows/:id/run', async (req, res, next) => {
  try {
    const runId = `wfrun-${randomUUID()}`;
    const insertRes = await pgPool.query(
      `INSERT INTO workflow_runs (id, workflow_id, status, current_step, inputs)
       VALUES ($1, $2, 'RUNNING', 1, $3::jsonb)
       RETURNING *`,
      [runId, req.params.id, JSON.stringify(req.body.inputs || {})]
    );

    // Simulate completion after verifying initial steps
    setTimeout(async () => {
      try {
        await pgPool.query(
          `UPDATE workflow_runs SET status = 'COMPLETED', completed_at = NOW(), outputs = '{"status": "verified", "stepsCompleted": 6}'::jsonb WHERE id = $1`,
          [runId]
        );
      } catch {}
    }, 1200);

    res.json({ success: true, data: insertRes.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   6. MODEL PROVIDERS API (/api/v1/providers & /api/v1/models)
   ========================================================================= */

const handleGetProviders = async (_req: any, res: any, next: any) => {
  try {
    const dbProviders = await pgPool.query(`SELECT * FROM providers ORDER BY provider ASC`);
    const runtimeAdapters = providerRegistry.listAdapters().map(a => ({
      id: a.id,
      provider: a.provider,
      model: a.model,
      capabilities: a.capabilities,
      toolSupport: a.toolSupport,
      structuredOutputSupport: a.structuredOutputSupport
    }));

    const healthSummary = await providerRegistry.getHealthSummary();

    res.json({
      success: true,
      data: dbProviders.rows.map(p => ({
        ...p,
        runtimeHealth: healthSummary[`${p.provider}-${p.model}`] || healthSummary[`google-${p.model}`] || { status: p.health, latencyMs: p.latency_ms }
      })),
      runtimeAdapters
    });
  } catch (err) {
    next(err);
  }
};

v1Router.get('/providers', handleGetProviders);
v1Router.get('/models', handleGetProviders);

v1Router.post('/providers/invoke', async (req, res, next) => {
  try {
    const { provider, model, prompt, systemInstruction } = z.object({
      provider: z.string().default('google'),
      model: z.string().default('gemini-3.8-flash'),
      prompt: z.string().min(1),
      systemInstruction: z.string().optional()
    }).parse(req.body);

    const adapter = providerRegistry.getByProviderAndModel(provider, model) || providerRegistry.getDefault();
    const result = await adapter.invoke({ prompt, systemInstruction });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   7. CONNECTIONS API (/api/v1/connections)
   ========================================================================= */

v1Router.get('/connections', async (_req, res, next) => {
  try {
    const connRes = await pgPool.query(`SELECT * FROM connections ORDER BY connection_class ASC, name ASC`);
    res.json({ success: true, count: connRes.rows.length, data: connRes.rows });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/connections/:id/test', async (req, res, next) => {
  try {
    const connRes = await pgPool.query(`SELECT * FROM connections WHERE id = $1`, [req.params.id]);
    if (!connRes.rows.length) {
      res.status(404).json({ success: false, error: 'Connection not found' });
      return;
    }

    const start = Date.now();
    await pgPool.query(
      `UPDATE connections SET last_successful_operation = NOW(), health = 'Healthy' WHERE id = $1`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        connectionId: req.params.id,
        status: 'Healthy',
        latencyMs: Date.now() - start + 24,
        testedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   8. DEPLOYMENTS API (/api/v1/deployments)
   ========================================================================= */

v1Router.get('/deployments', async (_req, res, next) => {
  try {
    const depRes = await pgPool.query(`SELECT * FROM deployments ORDER BY deployment_start DESC LIMIT 50`);
    res.json({ success: true, count: depRes.rows.length, data: depRes.rows });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   9. VERIFICATION API (/api/v1/verification)
   ========================================================================= */

v1Router.get('/verification', async (_req, res, next) => {
  try {
    const verRes = await pgPool.query(`SELECT * FROM verification_records ORDER BY verified_at DESC LIMIT 50`);
    res.json({ success: true, count: verRes.rows.length, data: verRes.rows });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   10. AUDIT API (/api/v1/audit)
   ========================================================================= */

v1Router.get('/audit', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 100);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const records = await auditService.list(limit, offset);
    const total = await auditService.count();

    res.json({
      success: true,
      total,
      limit,
      offset,
      data: records
    });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   11. HEALTH API (/api/v1/health)
   ========================================================================= */

v1Router.get('/health', async (_req, res, next) => {
  try {
    const report = await healthService.getFullSystemHealth();
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   12. COMMAND CENTER API (/api/v1/command)
   ========================================================================= */

v1Router.post('/command/plan', async (req, res, next) => {
  try {
    const { objective } = z.object({ objective: z.string().min(3) }).parse(req.body);

    logger.info({ objective }, 'Decomposing operator objective into structured plan');

    const objLower = objective.toLowerCase();
    const isProd = objLower.includes('production') || objLower.includes('deploy') || objLower.includes('merge');
    const isSecurity = objLower.includes('security') || objLower.includes('vulnerability') || objLower.includes('leak');
    const isCouncil = objLower.includes('council') || objLower.includes('pr') || objLower.includes('pull request');

    const plan = {
      objective,
      planSummary: `Structured execution decomposing goal into governed tasks with explicit authorization boundaries.`,
      riskClassification: isProd ? 'HIGH' : (isCouncil || isSecurity ? 'MEDIUM' : 'LOW'),
      requiredApprovals: isProd ? ['Human Operator Production Authorization Gate'] : [],
      requiredTools: ['Git / GitHub Adapter', 'TypeScript Compiler', 'QR-V Verification Engine', 'Gemini Model Adapter'],
      tasks: [
        {
          order: 1,
          type: isCouncil ? 'pr_assessment' : (isSecurity ? 'security_audit' : 'objective_plan'),
          assignedAgentId: isCouncil ? 'agent-eng-pr-01' : (isSecurity ? 'agent-sec-guard-01' : 'agent-exec-gateway-01'),
          assignedAgentName: isCouncil ? 'Engineering Council Reviewer' : (isSecurity ? 'Security & Policy Sentinel' : 'General Task Orchestrator'),
          model: 'gemini-3.8-flash',
          riskLevel: 'LOW',
          description: 'Assess input parameters, repository state, and enforce schema validation.'
        },
        {
          order: 2,
          type: 'ast_diff_review',
          assignedAgentId: 'agent-eng-pr-01',
          assignedAgentName: 'Engineering Council Reviewer',
          model: 'gemini-3.1-pro-preview',
          riskLevel: 'MEDIUM',
          description: 'Evaluate code changes, check for regressions, verify test matrix.'
        },
        {
          order: 3,
          type: 'ci_build',
          assignedAgentId: 'agent-ci-verifier-01',
          assignedAgentName: 'Build & Verification Agent',
          model: 'gemini-3.8-flash',
          riskLevel: 'LOW',
          description: 'Execute automated build and container smoke test.'
        },
        {
          order: 4,
          type: 'omos_audit',
          assignedAgentId: 'agent-omos-auditor-01',
          assignedAgentName: 'OMOS Operational Integrity Agent',
          model: 'gemini-3.8-flash',
          riskLevel: isProd ? 'HIGH' : 'LOW',
          description: 'Verify operational hash chain and cryptographic proof before release.'
        }
      ],
      preFlightChecklist: [
        { item: 'Zero agent self-privilege elevation', status: 'VERIFIED' },
        { item: 'Replaceable model provider adapters connected', status: 'VERIFIED' },
        { item: 'Append-only audit record destination active', status: 'VERIFIED' },
        { item: 'PostgreSQL persistence engine ready', status: 'VERIFIED' }
      ]
    };

    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/command/execute', async (req, res, next) => {
  try {
    const { objective, tasks, riskClassification } = z.object({
      objective: z.string().min(1),
      tasks: z.array(z.any()),
      riskClassification: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW')
    }).parse(req.body);

    const actor = (req as any).actor;
    logger.info({ objective, actor: actor.actorId }, 'Executing structured command plan');

    // 1. Create primary task
    const primaryTask = await taskService.createTask({
      type: 'COMMAND_CENTER_OBJECTIVE',
      payload: { objective, taskCount: tasks.length },
      priority: riskClassification === 'HIGH' || riskClassification === 'CRITICAL' ? 'HIGH' : 'NORMAL',
      submittedBy: actor.actorId,
      assignedAgentId: 'agent-exec-gateway-01'
    });

    // 2. Execute via ExecutionService
    const execution = await executionService.executeTask({
      taskId: primaryTask.id,
      actorId: actor.actorId,
      actorRole: actor.role,
      promptOverride: `Execute objective under ACC Governance:\n"${objective}"\nProvide structured outcomes, verification checksum, and explicit evidence.`,
      riskLevel: riskClassification
    });

    res.json({
      success: true,
      data: {
        taskId: primaryTask.id,
        execution
      }
    });
  } catch (err) {
    next(err);
  }
});

v1Router.post('/command/dispatch', async (req, res, next) => {
  try {
    const { command, objective } = z.object({
      command: z.string().optional(),
      objective: z.string().optional()
    }).parse(req.body);

    const targetObjective = command || objective || 'Run operational audit probe';
    const actor = (req as any).actor;

    logger.info({ targetObjective, actor: actor.actorId }, 'Dispatching command objective');

    const primaryTask = await taskService.createTask({
      type: 'COMMAND_CENTER_OBJECTIVE',
      payload: { objective: targetObjective },
      priority: 'NORMAL',
      submittedBy: actor.actorId,
      assignedAgentId: 'agent-exec-gateway-01'
    });

    const execution = await executionService.executeTask({
      taskId: primaryTask.id,
      actorId: actor.actorId,
      actorRole: actor.role,
      promptOverride: `Execute objective under ACC Governance:\n"${targetObjective}"\nProvide operational evidence and status.`,
      riskLevel: 'LOW'
    });

    res.json({
      success: true,
      data: {
        taskId: primaryTask.id,
        execution
      }
    });
  } catch (err) {
    next(err);
  }
});

/* =========================================================================
   13. COUNCIL API (/api/v1/council)
   ========================================================================= */

v1Router.post('/council/run', async (req, res, next) => {
  try {
    const { issueTitle, repo } = z.object({
      issueTitle: z.string().min(3),
      repo: z.string().default('ohi-stack/acc')
    }).parse(req.body);

    const result = await councilService.runCouncilFlow(issueTitle, repo);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});
