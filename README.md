# ACC™ — OHI Command Console + Agent Command Console

ACC™ is the unified command-and-control platform for the OneGodian operational stack.

**Canonical production domain:** `https://acc.onegodian.com`

**Current platform version:** `1.3.0`

ACC unifies governed system supervision, agents, workflows, approvals, executions, verification, deployment evidence, audit, Oru’Valen™ intelligence-twin support, and OMOS™ runtime integration inside one operator interface.

## Canonical Platform Identity

ACC combines two first-class control modules inside one platform:

1. **OHI Command Console** — OHI systems, governed execution, runtime status, registry visibility, identity, policy, audit, and service supervision.
2. **Agent Command Console** — agents, tasks, queues, workflows, delegation, schedules, runtime activity, and automation operations.

ACC now also exposes dedicated integration surfaces for:

3. **Oru’Valen™** — OHI Twin decision-support, institutional memory, lived-experience memory, decision memory, current-state modeling, and provenance visibility.
4. **OMOS™** — operating-system and reasoning integration, reference-run visibility, provider/persistence surfaces, engineering workflow, and decision records.

These are not separate competing control planes. ACC remains the canonical execution-control interface.

## Authority Model

ACC does not replace human authority.

Canonical operating chain:

```text
Authorized Human Judgment
        ↓
Oru’Valen™ / OMOS™ decision support and reasoning
        ↓
ACC™ control plane
        ↓
OCP™ policy and authorization
        ↓
OEG™ governed execution
        ↓
Agents / tools / adapters / workflows
        ↓
QR-V / ODIN / OBP-1 verification and audit evidence
```

Oru’Valen may recommend, summarize, model, and prepare execution requests. OMOS may organize reasoning, alignment, provider routing, reference runs, and decision records according to verified implementation status. Neither may self-authorize privileged production action.

## Core Execution Contract

Every governed ACC flow follows:

```text
intake → validate → execute → verify → log → output
```

Privileged execution must remain subject to applicable policy, identity, role, approval, and audit controls.

## Current Console Surfaces

### Core

- `/console/dashboard`
- `/console/command`
- `/oruvalen`
- `/omos`
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

### Oru’Valen™ integration contract

- `/oruvalen`
- `/oruvalen/context`
- `/oruvalen/memory`
- `/oruvalen/decisions`
- `/oruvalen/provenance`

### OMOS™ integration contract

- `/omos`
- `/omos/reference-run`
- `/omos/providers`
- `/omos/persistence`
- `/omos/manifest`

Canonical OMOS node: `https://omos.onegodian.com`

## Architectural Position

ACC is the operator interface and governed control plane. It does not replace governance authority or execution authority.

Authority and execution flow through:

- OSCC™ — OHI Systems Command Center / governance control plane
- OCP™ — policy and authorization layer
- OEG™ — OHI Execution Gateway
- Identity / JWT / RBAC services
- Agent registry and workflow services
- Verification and audit services
- Human approval gates

ACC displays, routes, supervises, and controls approved workflows through governed APIs.

## Engineering Council Flow

The canonical development sequence is:

```text
GitHub Issue
→ Task Classification
→ Agent Assignment
→ Agent Work
→ Pull Request
→ Cross-Agent Review
→ Tests / CI
→ OMOS Review
→ Human Approval
→ Merge
→ Deployment Proof
```

**Merge is not completion.** Production status requires deployment evidence and runtime verification.

## Included in this repository

- Express + TypeScript service
- React ACC shell
- OHI Command Console module
- Agent Command Console module
- Oru’Valen integration surface
- OMOS integration surface
- Engineering Council interface
- Agent registry API
- Task queue API with BullMQ
- Workflow registry API
- OHI service status panels
- OEG execution bridge configuration
- OSCC/OCP integration points
- Redis connectivity
- PostgreSQL connectivity
- Health and readiness endpoints
- Docker and Docker Compose support
- PM2 ecosystem configuration
- GitHub Actions CI

## Repository Family

The canonical family remains:

- `ohi-stack/acc` — primary platform and source of truth
- `ohi-stack/acc-core` — shared authority/control-plane contracts
- `ohi-stack/acc-api` — governed API edge
- `ohi-stack/acc-runner` — controlled execution runtime
- `ohi-stack/acc-web` — web interface family / compatibility surface

Additional adapter/database/auth/log repositories may remain modular, but they must not redefine ACC independently from `ohi-stack/acc`.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Build and Validation

```bash
npm run check
npm run build
npm run test:smoke
npm run test:auth
npm run preflight:production
```

## Docker

```bash
docker compose up --build
```

## Health Endpoints

- `GET /health`
- `GET /ready`

## Deployment Target

Canonical domain:

- `acc.onegodian.com`

Future dedicated API target:

- `api.acc.onegodian.com`

Until that API is separated, ACC may continue consuming the existing OneGodian Node API where required by the deployed environment.

`acc.qrv.network` must not be used as the primary ACC destination. QR-V remains the verification, registry, certificate, audit, and public-trust layer supporting ACC.

## Production Direction

ACC must remain reusable infrastructure rather than a one-off dashboard:

- configuration-driven modules
- tenant-aware routing where required
- versioned service contracts
- replaceable execution adapters
- clear interface / governance / execution / identity / audit separation
- human approval for privileged actions
- no false operational claims
- deployment proof before a feature is represented as production-complete
