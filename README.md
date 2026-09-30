# ACC™ — OHI Command Console + Agent Command Console

ACC™ is the unified command-and-control platform for the OneGodian operational stack.

**Canonical production domain:** `https://acc.onegodian.com`

**Current production baseline:** `1.3.0`

**ACC V2 foundation branch:** `2.0.0-alpha.1` (pre-release; not production-complete)

ACC unifies governed system supervision, projects, persistent responsibilities, work orders, agents, workflows, approvals, executions, verification, deployment evidence, audit, Oru’Valen™ intelligence-twin support, and OMOS™ runtime integration inside one operator interface.

## ACC V2 Delegation Foundation

The V2 operating model moves ACC above any single agent or model vendor. The project is the durable container; responsibilities and work orders describe what must happen; providers are replaceable execution targets.

```text
Projects
→ Responsibilities
→ Work Orders
→ Delegation
→ Execution
→ Approval
→ Verification
→ Deployment
→ Audit
```

A **Responsibility** is durable operational ownership such as maintaining a production system, following up on a property acquisition pipeline, or supervising recurring engineering work. A **Work Order** is an auditable unit of work tied to a project, context, provider, authority requirements, artifacts, verification, and deployment evidence.

The V2 foundation does not grant external providers independent authority. Provider availability and execution maturity are explicit data.

### Execution-provider contract

| Provider ID | Intended role | Current foundation state |
| --- | --- | --- |
| `acc-runner` | Canonical governed ACC runtime | Executable |
| `human` | Human-assigned work and decisions | Executable assignment target |
| `omos` | Reasoning / operating-system integration | External integration boundary |
| `openai-agents` | OpenAI agent runtime target | Reserved until adapter verification |
| `openai-codex` | Software-engineering execution target | External integration boundary |
| `chatgpt-work` | External work surface | External integration boundary |
| `openai-dot` | Future persistent-worker compatibility | Reserved; non-executable |
| `external-mcp` | Generic external tool/provider boundary | Requires explicit connection |

`openai-dot` is deliberately represented as a **reserved compatibility contract only**. ACC must not claim Dot execution until a supported developer integration is implemented, verified, repeatable, and deployed.

### Foundation API surfaces

- `GET /api/v1/execution-providers`
- `GET /api/v1/work-orders`
- `GET /api/v1/work-orders/:id`
- `POST /api/v1/work-orders`
- `POST /api/v1/work-orders/:id/status`
- `GET /api/v1/responsibilities`
- `POST /api/v1/responsibilities`

These routes are authority-protected through the existing ACC API authentication boundary.

## Canonical Platform Identity

ACC combines two first-class control modules inside one platform:

1. **OHI Command Console** — OHI systems, governed execution, runtime status, registry visibility, identity, policy, audit, and service supervision.
2. **Agent Command Console** — agents, tasks, queues, workflows, delegation, schedules, runtime activity, and automation operations.

ACC also exposes dedicated integration surfaces for:

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
Projects / Responsibilities / Work Orders
        ↓
OCP™ policy and authorization
        ↓
OEG™ governed execution
        ↓
Approved providers / agents / tools / adapters / workflows
        ↓
QR-V / ODIN / OBP-1 verification and audit evidence
```

Oru’Valen may recommend, summarize, model, and prepare execution requests. OMOS may organize reasoning, alignment, provider routing, reference runs, and decision records according to verified implementation status. Neither may self-authorize privileged production action.

## Core Execution Contract

Every governed ACC flow follows:

```text
intake → validate → authorize → execute → verify → log → output
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
- `/work-orders`
- `/responsibilities`
- `/delegation`
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
- Project, responsibility, and work-order records
- Agent registry and workflow services
- Provider adapters
- Verification and audit services
- Human approval gates

ACC displays, routes, supervises, and controls approved workflows through governed APIs.

## Engineering Council Flow

The canonical development sequence is:

```text
GitHub Issue
→ Work Order
→ Task Classification
→ Provider / Agent Assignment
→ Work
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
- Work-order and persistent-responsibility contracts
- Provider maturity registry
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
- `ohi-stack/acc-adapters` — provider and external-system adapter boundary
- `ohi-stack/acc-workflows` — workflow definitions and orchestration contracts
- `ohi-stack/acc-auth` — authentication/authorization support
- `ohi-stack/acc-logs` — cross-provider execution/audit log support

Additional adapter/database/auth/log repositories may remain modular, but they must not redefine ACC independently from `ohi-stack/acc`.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Build and Validation

```bash
npm run test:unit
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

- project-centered context rather than chat-centered state
- persistent responsibilities and work orders
- configuration-driven modules
- tenant-aware routing where required
- versioned service contracts
- replaceable execution adapters
- explicit provider maturity and capability states
- clear interface / governance / execution / identity / audit separation
- human approval for privileged actions
- no false operational claims
- deployment proof before a feature is represented as production-complete
