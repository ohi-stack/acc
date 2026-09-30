# ACC V2 Delegation Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the provider-independent ACC delegation foundation so projects can own persistent responsibilities and auditable work orders routed to OpenAI Agents, Codex, ACC Runner, OMOS, human operators, and future Dot-compatible adapters without making any unverified provider operational claim.

**Architecture:** ACC remains the canonical control plane. Work Orders and Responsibilities become first-class records above provider-specific execution. Provider capabilities are declared separately from runtime availability, and privileged actions remain human-approval gated. OpenAI Dots is represented only as a reserved adapter contract until a supported developer integration exists.

**Tech Stack:** TypeScript, Express, PostgreSQL, Zod, React shell, GitHub Actions.

**Spec:** `README.md` and this implementation plan.

## Global Constraints

- Canonical production domain remains `acc.onegodian.com`.
- Human final authority remains mandatory for privileged execution.
- No feature may be represented as production-operational without deployment evidence and runtime verification.
- `openai-dot` is a reserved provider contract only; do not mark it executable until a supported integration exists.
- Existing tasks, executions, approvals, verification, and audit contracts must remain backward compatible during the foundation release.
- ACC V2 remains pre-release until the new model is operational, documented, and repeatable.

## Review Focus

- Unknown or unsupported provider identifiers must be rejected rather than silently routed.
- A work order with a provider that is not executable must remain blocked/planned and must not create a false execution record.
- Privileged work orders must preserve human-approval requirements across status changes.
- Responsibility triggers and schedules must be stored as data and not self-execute in this foundation phase.
- Existing `/api/v1/tasks`, `/api/v1/executions`, and `/api/v1/approvals` behavior must remain unchanged.

---

### Task 1: Shared Delegation Contracts

**Files:**
- Create: `src/core/delegation-contracts.ts`
- Create: `src/core/delegation-contracts.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `EXECUTION_PROVIDERS`, `isExecutionProvider()`, `WorkOrderStatus`, `ResponsibilityStatus`.

- [ ] Write failing tests for accepted provider identifiers, rejection of unknown identifiers, and reserved `openai-dot` status.
- [ ] Run the tests and confirm RED.
- [ ] Implement the minimal provider/status contracts.
- [ ] Run the tests and full suite; confirm GREEN.
- [ ] Commit.

### Task 2: Persistence Model

**Files:**
- Modify: `src/db/schema.sql`
- Create: `src/services/DelegationService.ts`
- Create: `src/services/DelegationService.test.ts`

**Interfaces:**
- Consumes: provider/status contracts from Task 1.
- Produces: CRUD methods for work orders and persistent responsibilities.

- [ ] Write failing tests for work-order validation, reserved-provider blocking, and status transitions.
- [ ] Run tests and confirm RED.
- [ ] Add `work_orders`, `responsibilities`, and provider-routing metadata to the schema.
- [ ] Implement the service methods.
- [ ] Run tests and full suite; confirm GREEN.
- [ ] Commit.

### Task 3: Delegation API

**Files:**
- Create: `src/api/delegation.routes.ts`
- Modify: `src/api/v1.routes.ts`
- Create: `src/api/delegation.routes.test.ts`

**Interfaces:**
- Consumes: `DelegationService`.
- Produces: `/api/v1/work-orders`, `/api/v1/responsibilities`, and `/api/v1/execution-providers`.

- [ ] Write failing endpoint contract tests.
- [ ] Run tests and confirm RED.
- [ ] Implement routes and Zod request validation.
- [ ] Confirm unsupported/non-executable providers cannot be dispatched.
- [ ] Run tests and full suite; confirm GREEN.
- [ ] Commit.

### Task 4: ACC Documentation and Version Boundary

**Files:**
- Modify: `README.md`
- Modify: `package.json`

**Interfaces:**
- Produces: documented V2 foundation architecture and explicit provider/runtime maturity table.

- [ ] Document `Projects → Responsibilities → Work Orders → Delegation → Execution → Approval → Verification → Deployment → Audit`.
- [ ] Mark Dots as a reserved adapter contract, not an active runtime integration.
- [ ] Set the branch package version to a V2 prerelease identifier only after Tasks 1–3 are verified.
- [ ] Run `npm run check`, `npm run build`, and the complete test command.
- [ ] Commit.

### Task 5: Repository-Family Synchronization

**Files:**
- Update corresponding architecture/contracts in `acc-core`, `acc-api`, `acc-runner`, `acc-web`, `acc-adapters`, `acc-workflows`, `acc-logs`, `acc-auth`, `omos-site`, and `acc-oruvalen` as applicable.

**Interfaces:**
- Consumes: canonical ACC provider and work-order terminology.
- Produces: repository-family consistency without redefining ACC independently.

- [ ] Add shared schemas/contracts to `acc-core`.
- [ ] Update API/runner/web/adapter/workflow/log/auth documentation boundaries.
- [ ] Update OMOS and Oru’Valen delegation contracts without granting execution authority.
- [ ] Verify each changed repository using its available CI/build checks.
- [ ] Open reviewable pull requests; do not merge without explicit approval.
