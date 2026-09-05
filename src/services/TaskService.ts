import { randomUUID } from 'crypto';
import { pgPool } from '../db/postgres';
import { logger } from '../utils/logger';

export type TaskStatus = 
  | 'CREATED'
  | 'VALIDATED'
  | 'QUEUED'
  | 'RESERVED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'DEAD_LETTERED';

export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface CreateTaskInput {
  type: string;
  payload: any;
  priority?: TaskPriority;
  submittedBy: string;
  assignedAgentId?: string;
  workflowId?: string;
  correlationId?: string;
}

export class TaskService {
  private static instance: TaskService;

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public async createTask(input: CreateTaskInput): Promise<any> {
    const id = `task-${randomUUID()}`;
    const priority = input.priority || 'NORMAL';
    const correlationId = input.correlationId || `corr-${randomUUID()}`;

    logger.info({ taskId: id, type: input.type }, 'Creating new task');

    const res = await pgPool.query(
      `INSERT INTO tasks (
        id, type, payload, status, priority, submitted_by, assigned_agent_id, workflow_id, correlation_id, created_at
      ) VALUES ($1, $2, $3::jsonb, 'CREATED', $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        id,
        input.type,
        JSON.stringify(input.payload || {}),
        priority,
        input.submittedBy,
        input.assignedAgentId || null,
        input.workflowId || null,
        correlationId
      ]
    );

    const task = res.rows[0];

    // Record initial event
    await this.recordTaskEvent(id, 'TASK_CREATED', undefined, 'CREATED', { submittedBy: input.submittedBy });

    // Transition to VALIDATED
    await this.transitionStatus(id, 'VALIDATED', { reason: 'Payload schema validated successfully' });

    // Transition to QUEUED
    await this.transitionStatus(id, 'QUEUED', { queue: 'acc-tasks', priority });

    return task;
  }

  public async transitionStatus(taskId: string, newStatus: TaskStatus, details?: any): Promise<any> {
    const currentRes = await pgPool.query(`SELECT status FROM tasks WHERE id = $1`, [taskId]);
    if (!currentRes.rows.length) {
      throw new Error(`Task ${taskId} not found`);
    }
    const fromStatus = currentRes.rows[0].status;

    let timeUpdate = '';
    if (newStatus === 'RUNNING') {
      timeUpdate = ', started_at = NOW()';
    } else if (['COMPLETED', 'FAILED', 'CANCELLED', 'DEAD_LETTERED'].includes(newStatus)) {
      timeUpdate = ', completed_at = NOW()';
    }

    const res = await pgPool.query(
      `UPDATE tasks SET status = $1, error = $2, result = $3::jsonb ${timeUpdate} WHERE id = $4 RETURNING *`,
      [
        newStatus,
        details?.error || null,
        details?.result ? JSON.stringify(details.result) : null,
        taskId
      ]
    );

    await this.recordTaskEvent(taskId, `STATUS_TRANSITION_TO_${newStatus}`, fromStatus, newStatus, details);
    return res.rows[0];
  }

  public async recordTaskEvent(taskId: string, eventType: string, fromStatus?: string, toStatus?: string, details?: any): Promise<void> {
    const eventId = `tevt-${randomUUID()}`;
    await pgPool.query(
      `INSERT INTO task_events (id, task_id, event_type, from_status, to_status, details)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [eventId, taskId, eventType, fromStatus || null, toStatus || null, JSON.stringify(details || {})]
    );
  }

  public async getTask(id: string): Promise<any> {
    const res = await pgPool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    if (!res.rows.length) return null;
    const task = res.rows[0];
    const events = await pgPool.query(`SELECT * FROM task_events WHERE task_id = $1 ORDER BY created_at ASC`, [id]);
    return { ...task, events: events.rows };
  }

  public async listTasks(filters?: { status?: string; agentId?: string; search?: string }): Promise<any[]> {
    let query = `SELECT * FROM tasks WHERE 1=1`;
    const params: any[] = [];

    if (filters?.status && filters.status !== 'ALL') {
      params.push(filters.status);
      query += ` AND status = $${params.length}`;
    }
    if (filters?.agentId) {
      params.push(filters.agentId);
      query += ` AND assigned_agent_id = $${params.length}`;
    }
    if (filters?.search) {
      params.push(`%${filters.search}%`);
      query += ` AND (type ILIKE $${params.length} OR id ILIKE $${params.length} OR submitted_by ILIKE $${params.length})`;
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;
    const res = await pgPool.query(query, params);
    return res.rows;
  }

  public async retryTask(id: string): Promise<any> {
    const task = await this.getTask(id);
    if (!task) throw new Error('Task not found');
    if (task.retry_count >= task.max_retries) {
      return this.transitionStatus(id, 'DEAD_LETTERED', { error: 'Max retries exceeded' });
    }

    await pgPool.query(`UPDATE tasks SET retry_count = retry_count + 1 WHERE id = $1`, [id]);
    return this.transitionStatus(id, 'QUEUED', { reason: 'Operator initiated task retry' });
  }

  public async cancelTask(id: string, reason?: string): Promise<any> {
    return this.transitionStatus(id, 'CANCELLED', { error: reason || 'Task cancelled by operator' });
  }
}

export const taskService = TaskService.getInstance();
