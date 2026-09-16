# ACC™ — OHI Command Console + Oru’Valen Twin Console + Agent Command Console

ACC™ is the unified command console for the OneGodian operational stack.

Canonical production domain:

- `acc.onegodian.com`

ACC combines three first-class console modules inside one platform:

1. **OHI Command Console** — OHI systems, governed execution, runtime status, registry visibility, identity, policy, audit, and service supervision.
2. **Oru’Valen Twin Console** — personalized continuity/context, Lived Experience, Decision Memory, learning proposals, Current State review, and OMOS synchronization.
3. **Agent Command Console** — agents, tasks, queues, workflows, delegation, schedules, runtime activity, and automation operations.

These are not separate competing dashboards. They are unified modules inside the same ACC control-plane interface.

Oru’Valen is **not** classified as an AI agent and must not be merged into the external agent registry.

## Repository description

Use this description on GitHub:

> ACC™ — unified command console for OHI systems, Oru’Valen continuity/context, governed execution, agents, workflows, automation, registry operations, identity, audit, and platform governance at acc.onegodian.com.

## Architectural position

ACC is the operator and authorized execution control-plane interface. It does not replace human governance authority or the OMOS governed reasoning/Human Gate/Decision Record runtime.

Canonical Oru/OMOS/ACC loop:

```text
Human input or authorized evidence
→ Oru context snapshot
→ OMOS governed reasoning
→ Council / synthesis
→ Human Gate
→ Decision Record
→ ACC authorized execution
→ Verification / audit
→ Outcome
→ Proposed Oru learning
→ Human-approved memory/current-state update
```

Authority flows through the applicable governance and execution controls, including:

- OMOS™ — governed reasoning, Council synthesis, Human Gate, Decision Records, persistence, and audit/history
- OSCC™ — OHI Systems Command Center / governance control plane where applicable
- OCP™ — policy and authorization layer
- OEG™ — OHI Execution Gateway
- Identity / JWT / RBAC services
- Registry and audit services

ACC displays, routes, supervises, and controls approved workflows through governed APIs.

## Included in this repository

- Express + TypeScript service
- Unified ACC shell
- OHI Command Console module
- Oru’Valen Twin Console module
- Agent Command Console module
- Agent registry API
- Task queue API with BullMQ
- Workflow registry API
- OHI service status panels
- OEG execution bridge configuration
- OSCC/OCP integration placeholders
- Redis connectivity
- PostgreSQL connectivity
- Health and readiness endpoints
- Docker and Docker Compose support
- PM2 ecosystem configuration
- GitHub Actions CI

## Console modules

### OHI Command Console

Purpose:

- Monitor OHI infrastructure
- View OEG runtime status
- Surface OSCC governance state
- Track service health
- Display registry and audit summaries
- Trigger approved execution workflows through governed APIs

Suggested routes:

- `/`
- `/dashboard`
- `/ohi`
- `/ohi/services`
- `/ohi/executions`
- `/ohi/policies`
- `/ohi/audit`
- `/ohi/registry`
- `/ohi/settings`

### Oru’Valen Twin Console

Purpose:

- Surface approved Oru continuity/context
- Present the Lived Experience architecture
- Preserve Decision Memory and outcome-learning boundaries
- Separate FACT / USER_STATEMENT / INFERENCE / PREDICTION
- Review proposed learning before durable memory/current-state updates
- Display OMOS and ACC synchronization/maturity status
- Keep Oru separate from the external Agents registry

Current route:

- `/oru`

Planned sub-surfaces may include:

- `/oru/context`
- `/oru/lived-experience`
- `/oru/decisions`
- `/oru/learning`
- `/oru/current-state`
- `/oru/connections`

Canonical architecture and machine profile are defined by OMOS source targets:

- `https://omos.onegodian.com/oru/`
- `https://omos.onegodian.com/api/oru.json`

### Agent Command Console

Purpose:

- Manage agents
- Register capabilities
- Create and monitor tasks
- Manage workflow definitions
- View queue status
- Inspect failed/retried jobs

Suggested routes:

- `/agents`
- `/agents/:id`
- `/tasks`
- `/tasks/:id`
- `/workflows`
- `/workflows/:id`
- `/queues`
- `/logs`

## Oru learning and authority boundaries

The Twin architecture is evidence- and approval-driven:

- Lived Experience does not imply background surveillance.
- Only user-supplied or explicitly authorized sources may contribute context.
- Model inference and prediction do not become facts automatically.
- Direct human correction has higher authority than a prior model inference about that human.
- Historical records remain preserved; newer verified and approved state may supersede earlier current-state assumptions.
- Restricted financial, health, legal, identity, and private-contact data require access controls.
- High-risk external execution remains approval-gated.
- Durable memory/current-state changes must be attributable, versioned, reviewable, and governed by the configured approval policy.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker compose up --build
```

## Health endpoints

- `GET /health`
- `GET /ready`

## Example API usage

All protected routes support the `x-api-key` header when `API_KEY` is set.

### Create agent

```bash
curl -X POST http://localhost:4000/agents \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "name": "verification-worker-1",
    "type": "worker",
    "capabilities": ["verify", "issue", "queue"]
  }'
```

### Create task

```bash
curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "type": "verify-record",
    "payload": {
      "recordId": "abc-123"
    }
  }'
```

### Create workflow

```bash
curl -X POST http://localhost:4000/workflows \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "name": "QR-V Issue + Register",
    "steps": ["issue", "sign", "register", "notify"]
  }'
```

## Deployment target

Canonical domain:

- `acc.onegodian.com`

Legacy or secondary references such as `acc.quantumohi.com` should redirect to `acc.onegodian.com` unless a later infrastructure decision intentionally changes canonical routing.

Recommended runtime:

- Node 20+
- Redis 7
- PostgreSQL 15
- PM2 or container runtime
- Nginx reverse proxy

## Production direction

ACC should be developed as reusable infrastructure, not a one-off dashboard:

- No client-specific logic in core code
- Configuration-driven console modules
- Tenant-aware routing
- Versioned service contracts
- Replaceable execution adapters
- Unified operator shell
- Clear separation between interface, governance, execution, identity, continuity/context, and audit

## Maturity rule

Repository implementation, green CI, merge, deployment, and production proof are separate states. A capability must not be labeled Verified or Production until the relevant evidence exists on the canonical domain.
