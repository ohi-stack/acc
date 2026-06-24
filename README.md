# ACC™ — OHI Command Console + Agent Command Console

ACC™ is the unified command console for the OneGodian operational stack.

Canonical production domain:

- `acc.onegodian.com`

ACC combines two first-class console modules inside one platform:

1. **OHI Command Console** — OHI systems, governed execution, runtime status, registry visibility, identity, policy, audit, and service supervision.
2. **Agent Command Console** — agents, tasks, queues, workflows, delegation, schedules, runtime activity, and automation operations.

These are not separate products and should not be deployed as competing dashboards. They are unified modules inside the same ACC control-plane interface.

## Repository description

Use this description on GitHub:

> ACC™ — unified command console for OHI systems, governed execution, agents, workflows, automation, registry operations, identity, audit, and platform governance at acc.onegodian.com.

## Architectural Position

ACC is the operator interface layer. It does not replace governance authority or execution authority.

Authority flows through:

- OSCC™ — OHI Systems Command Center / governance control plane
- OCP™ — policy and authorization layer
- OEG™ — OHI Execution Gateway
- Identity / JWT / RBAC services
- Registry and audit services

ACC displays, routes, supervises, and controls approved workflows through governed APIs.

## Included in this repository

- Express + TypeScript service
- Unified ACC shell
- OHI Command Console module
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

## Console Modules

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

## Deployment Target

Canonical domain:

- `acc.onegodian.com`

Legacy or secondary references such as `acc.quantumohi.com` should redirect to `acc.onegodian.com` unless a later infrastructure decision intentionally changes canonical routing.

Recommended runtime:

- Node 20+
- Redis 7
- PostgreSQL 15
- PM2 or container runtime
- Nginx reverse proxy

## Production Direction

ACC should be developed as reusable infrastructure, not a one-off dashboard:

- No client-specific logic in core code
- Configuration-driven console modules
- Tenant-aware routing
- Versioned service contracts
- Replaceable execution adapters
- Unified operator shell
- Clear separation between interface, governance, execution, identity, and audit
