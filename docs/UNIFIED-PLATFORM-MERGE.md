# ACC™ Unified Platform Merge

## Decision

ACC™ is the single production platform for both:

- OHI Command Console
- Agent Command Console

Canonical domain: `acc.onegodian.com`

These are first-class modules inside one operator shell, not separate competing dashboards.

## Unified Platform Functions

### OHI Command

- OHI service health and runtime supervision
- OEG execution monitoring
- OSCC governance state
- OCP policy and authorization state
- Identity, JWT, and RBAC visibility
- Registry lifecycle visibility
- Audit and ledger summaries
- Governed workflow dispatch

### Agent Command

- Agent registry and capability management
- Task creation, assignment, and status
- Workflow definition and execution
- Queue supervision
- Schedules and automation activity
- Retry, failure, and exception handling
- Runtime logs and execution history

## Shared Core Contract

Every module follows:

`intake → validate → execute → verify → log → output`

Core rules:

- No tenant-specific logic in core code
- Tenant variation belongs in configuration and templates
- Governance, identity, execution, audit, and adapters remain separable
- Execution engines remain replaceable
- Human authorization gates remain available for governed actions

## Repository Roles

- `ohi-stack/acc` — canonical platform shell, integration contract, deployment target
- `ohi-stack/acc-web` — web interface module
- `ohi-stack/acc-api` — public/internal API surface
- `ohi-stack/acc-core` — shared domain contracts and orchestration primitives
- `ohi-stack/acc-auth` — identity and authorization adapter
- `ohi-stack/acc-db` — persistence and migration layer
- `ohi-stack/acc-logs` — append-only audit/logging service
- `ohi-stack/acc-runner` — execution worker/runtime
- `ohi-stack/acc-workflows` — workflow definitions and validation
- `ohi-stack/acc-adapters` — replaceable external/provider adapters
- `ohi-stack/acc-infra` — deployment and infrastructure configuration
- `ohi-stack/acc-wp-adapter` — WordPress bridge only

## Integration Boundary

ACC is the operator interface. It does not replace:

- OSCC™ governance authority
- OCP™ policy authority
- OEG™ execution authority
- Identity service authority
- Registry or audit source-of-truth services

ACC routes, displays, supervises, and invokes approved operations through versioned APIs.

## Canonical Route Map

### Shared

- `/`
- `/dashboard`
- `/ecosystem`
- `/registry`
- `/tools`
- `/settings`
- `/admin`

### OHI Command

- `/ohi`
- `/ohi/services`
- `/ohi/executions`
- `/ohi/policies`
- `/ohi/audit`
- `/ohi/registry`
- `/ohi/settings`

### Agent Command

- `/agents`
- `/agents/:id`
- `/tasks`
- `/tasks/:id`
- `/workflows`
- `/workflows/:id`
- `/queues`
- `/logs`

### APIs

- `/api/health`
- `/api/manifest`
- `/api/tools`
- `/api/stats`
- `/api/v1/ohi/*`
- `/api/v1/agents/*`
- `/api/v1/tasks/*`
- `/api/v1/workflows/*`

## Deployment Rule

Primary production destination: `acc.onegodian.com`

Optional separated API destination: `api.acc.onegodian.com`

QRV remains the verification, registry, certificate, and public trust layer. It supports ACC but does not absorb ACC branding or operator authority.

## Definition of Done

The merge is complete only when:

1. One authentication session serves both console modules.
2. One navigation shell exposes OHI and Agent functions.
3. Shared tenant context is enforced across all requests.
4. All execution requests pass through governed APIs.
5. Audit events include actor, tenant, action, timestamp, payload hash, and outcome.
6. Existing ACC repositories conform to the repository-role map above.
7. CI validates contracts across the platform repositories.
8. Production deployment resolves through `acc.onegodian.com`.
