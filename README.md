# ACC™ — OneGodian Control Plane

**Current baseline:** v1.3.0  
**Canonical production domain:** `https://acc.onegodian.com`

ACC™ is the unified execution and supervision console for the OneGodian operational stack.

ACC combines three first-class operating surfaces inside one control-plane interface:

1. **Oru’Valen™** — O-H-I Twin / operational intelligence, continuity, current-state model, lived-experience architecture, and decision support.
2. **OHI Command Console** — governed O-H-I systems, runtime status, registry visibility, identity, policy, audit, and service supervision.
3. **Agent Command Console** — external agents, tasks, queues, workflows, delegation, schedules, runtime activity, and automation operations.

These are not competing dashboards. Oru’Valen is not an external AI agent. External agents remain separate bounded executors registered and governed through ACC.

## Canonical operating chain

```text
Human input
→ Oru’Valen context and continuity
→ OMOS governed reasoning / Decision Record
→ Human gate
→ ACC authorized execution
→ Agents / tools / integrations
→ Outcome
→ Proposed learning
```

Human authority remains final.

## Repository description

> ACC™ — unified OneGodian control plane for Oru’Valen, O-H-I systems, governed execution, agents, workflows, approvals, deployments, registry operations, identity, verification, audit, and platform supervision at acc.onegodian.com.

## Architectural position

ACC is the operator and execution-control layer. It does not replace human authority or OMOS governed reasoning.

Primary boundaries:

- **Oru’Valen™** — continuity, context, lived-experience model, decision support.
- **OMOS™** — governed reasoning, Alignment, Council synthesis, Decision Records.
- **ACC™** — execution control, permissions, tasks, agents, workflows, approvals, deployment, audit.
- **OSCC™ / OCP™ / OEG™** — governance/policy/execution infrastructure where applicable.
- **Identity / JWT / RBAC** — authorization and actor binding.
- **Registry / audit / verification** — provenance and evidence.

ACC displays, routes, supervises, and controls approved workflows through governed APIs.

## Included in this repository

- Express + TypeScript service
- React ACC shell
- Oru’Valen first-class console surface
- OHI Command Console module
- Agent Command Console module
- Agent registry API
- Task queue API with BullMQ
- Workflow registry API
- Engineering Council interface
- Model/provider interface
- Connections interface
- Approval queue
- Deployment records
- Verification and audit surfaces
- Redis connectivity
- PostgreSQL connectivity
- Health and readiness endpoints
- Docker and Docker Compose support
- PM2 ecosystem configuration
- GitHub Actions CI

## Primary console routes

### Oru’Valen™

- `/oru`

Purpose:

- show the O-H-I Twin architecture and authority boundary;
- expose the five Oru intelligence systems;
- distinguish fact, stated position, inference, and prediction;
- link into approvals, audit, Engineering Council, connections, and OMOS;
- serve as the canonical ACC surface for future lived-experience, decision-memory, and current-state integrations.

### Core ACC

- `/`
- `/console/dashboard`
- `/console/command`
- `/agents`
- `/tasks`
- `/workflows`
- `/engineering-council`
- `/models`
- `/connections`
- `/executions`
- `/approvals`
- `/deployments`
- `/verification`
- `/audit`
- `/status`
- `/docs`
- `/settings`
- `/account`

## Operational versioning rule

A capability must not be represented as Operational or Production unless it is implemented, documented, repeatable, permissioned, and verified in the applicable environment.

Allowed maturity labels:

- Operational
- Production
- In development
- Prototype
- Concept
- Historical proposal
- Paused
- Archived
- Retired

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Validation

```bash
npm run check
npm run build
npm test
npm run preflight:production
```

## Docker

```bash
docker compose up --build
```

## Health endpoints

- `GET /health`
- `GET /ready`
- `GET /api/health`

## Security boundary

- Never commit credentials or deployment secrets.
- Production authority is server-bound after authentication.
- Caller-supplied authority headers cannot elevate permissions.
- High-risk or irreversible actions require the applicable human approval gate.
- Auditability and rollback are part of the Definition of Done.

## Deployment target

Canonical domain:

- `acc.onegodian.com`

Canonical Oru surface:

- `acc.onegodian.com/oru`

OMOS reasoning platform:

- `omos.onegodian.com`

Legacy or secondary ACC references should redirect to `acc.onegodian.com` unless a later infrastructure decision intentionally changes canonical routing.

Recommended runtime:

- Node 20+
- Redis 7
- PostgreSQL 15+
- PM2 or container runtime
- Nginx reverse proxy

## Documentation

- `AGENTS.md` — repository operating and authority rules
- `docs/ORUVALEN-ACC-OPERATING-MODEL.md` — Oru / OMOS / ACC architecture
- `docs/PRODUCTION-READINESS.md` — production readiness controls
- `docs/canonical-deployment.md` — canonical domain and deployment mapping
- `docs/UNIFIED-PLATFORM-ARCHITECTURE.md` — broader ACC platform architecture

## Production direction

ACC is reusable control-plane infrastructure, not a one-off dashboard:

- configuration-driven console modules;
- replaceable adapters;
- versioned service contracts;
- tenant-aware routing where required;
- explicit human approval gates;
- clear separation between intelligence, reasoning, execution, identity, and audit;
- measurable outcomes and provenance for future Oru learning.
