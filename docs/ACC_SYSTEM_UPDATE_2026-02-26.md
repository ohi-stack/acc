# ACC™ — Agent Command Console

## System Update: February 26, 2026

**Repository:** `ohi-stack/acc`  
**Primary node:** `https://acc.onegodian.com`  
**Classification:** Operator-facing command console  
**Status:** Internal-first control interface; SaaS-ready architecture direction

---

## 1. Executive Definition

ACC™ is the operator-facing command console for AI Agents, OHI Architects, OHI Robots, and governed execution workflows within the OneGodian technology stack.

ACC is not the authority layer.

ACC is the interface layer used to submit, supervise, review, and monitor governed work.

Authority flows through:

- OSCC™ — OHI Systems Command Center
- OCP™ — OHI Control Plane
- OEG™ — OHI Execution Gateway
- Identity and RBAC services
- Registry and audit services
- Policy and approval layers

ACC must never become an uncontrolled execution surface.

---

## 2. Current Architectural Position

ACC sits between users/operators and governed backend systems.

```text
Operator / Admin
   ↓
ACC Web Interface
   ↓
ACC API
   ↓
ACC Core
   ↓
OCP / OSCC Policy Evaluation
   ↓
OEG Execution Gateway
   ↓
Adapters / Models / OpenClaw / External Services
   ↓
Audit + Logs + Telemetry
```

ACC provides visibility and command submission.  
OCP/OSCC provide authorization.  
OEG provides execution.  
Adapters provide replaceable external connectivity.

---

## 3. Confirmed Repo Family

The ACC system is intentionally split into reusable infrastructure repositories:

| Repository | Role |
|---|---|
| `ohi-stack/acc` | Canonical ACC documentation, system coordination, operator definition |
| `ohi-stack/acc-web` | Dashboard UI, task submission, monitoring, workflow control |
| `ohi-stack/acc-api` | API surface, request routing, auth handoff, service communication |
| `ohi-stack/acc-core` | Control-plane logic, task coordination, workflow governance |
| `ohi-stack/acc-runner` | Execution worker/runner for approved tasks |
| `ohi-stack/acc-workflows` | Reusable workflow definitions and execution templates |
| `ohi-stack/acc-db` | Persistence schema, migrations, task state, workflow runs |
| `ohi-stack/acc-auth` | Auth, roles, API keys, permission boundaries |
| `ohi-stack/acc-logs` | Structured logs, audit records, trace metadata |
| `ohi-stack/acc-adapters` | External adapters and replaceable service connectors |
| `ohi-stack/acc-infra` | Deployment, environment, process, reverse proxy, CI/CD |
| `ohi-stack/acc-wp-adapter` | WordPress bridge with contracts, auth, idempotency, and audit alignment |

This separation must be preserved unless a repository is formally deprecated.

---

## 4. Design Contract

All ACC modules must follow the standard OneGodian infrastructure contract:

```text
intake → validate → execute → verify → log → output
```

### Required behavior

1. **Intake** — receive request with tenant, actor, task type, payload, and context.
2. **Validate** — check schema, tenant policy, role permissions, required fields, and risk class.
3. **Execute** — call only approved internal services or adapters.
4. **Verify** — confirm output structure, status, result integrity, and policy compliance.
5. **Log** — write structured logs, audit events, and telemetry metadata.
6. **Output** — return normalized response envelope.

No ACC module should directly bypass this sequence.

---

## 5. Multi-Tenant Requirement

ACC must be designed as internal-first but SaaS-ready.

That means:

- Every task must carry a `tenant_id`.
- Every actor must carry a `user_id` and `role`.
- Every workflow must declare its `risk_class`.
- Every adapter call must be traceable.
- Every output must be attached to an execution record.

No global operational state should be used for tenant data.

---

## 6. OpenClaw Position

OpenClaw is compute-only.

It may be used as an execution worker through an adapter, but it must not own:

- Policy
- Identity
- Tenant state
- Audit authority
- Registry state
- Approval logic

Correct flow:

```text
ACC → OCP/OSCC authorization → OEG → OpenClaw Adapter → OpenClaw runtime → OEG response → ACC display
```

Incorrect flow:

```text
ACC → OpenClaw direct execution
```

---

## 7. Telemetry and Observability

ACC must integrate with the broader OpenTelemetry/OTLP strategy.

Every governed task should emit trace metadata containing:

- `tenant_id`
- `actor_id`
- `task_id`
- `workflow_id`
- `execution_id`
- `adapter`
- `model_or_runtime`
- `status`
- `latency_ms`
- `risk_class`
- `approval_required`

Telemetry failure must not crash task execution, but it must be recorded as an observability fault.

---

## 8. MVP Scope

ACC v0.1 should provide:

- Login / operator session
- Dashboard home
- Task submission form
- Task lifecycle view
- Workflow list
- Execution detail page
- Audit/log viewer
- Adapter status panel
- Health/status panel

ACC v0.1 should not attempt to include every OneGodian system.

The first monetizable workflow remains:

```text
Missed Call → SMS → Booking → Payment → Review → Audit
```

This workflow is useful because it is simple, revenue-facing, auditable, and repeatable across local businesses.

---

## 9. Completion Order

Build in this order:

1. Tenant-aware auth and role model
2. Task schema and task lifecycle state machine
3. ACC API task intake endpoints
4. ACC Core validation and routing contract
5. OEG integration
6. Logs/audit integration
7. ACC Web dashboard screens
8. OpenClaw adapter bridge
9. WordPress adapter bridge
10. Telemetry enrichment
11. Usage/metering foundation
12. Production deployment and health checks

Do not build new public subdomains before the core flow works end-to-end.

---

## 10. Definition of Done for ACC v0.1

ACC v0.1 is complete when an authorized operator can:

1. Sign in.
2. Submit a structured task.
3. Have the task validated against tenant policy.
4. Route the task to an approved execution service.
5. Receive a normalized output.
6. View the execution record.
7. View audit/log data.
8. See health status for connected services.

If the system cannot demonstrate this sequence, it is not v0.1 complete.

---

## 11. Architectural Rule

WordPress = presentation and commerce.  
Node services = authority, execution, identity, ledger, orchestration.  
OpenClaw = compute worker only.  
ACC = operator-facing command interface.  
OSCC/OCP = governance and authorization authority.
