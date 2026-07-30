# ACC™ Unified Platform Architecture

## Decision

The OHI Command platform and Agent Command Console are merged into one canonical operator platform:

- **Platform:** ACC™
- **Canonical domain:** `acc.onegodian.com`
- **Primary repository:** `ohi-stack/acc`

ACC contains both:

1. OHI Command Console
2. Agent Command Console

They share one navigation shell, identity context, tenant context, audit context, design system, deployment target, and operator experience.

## Merger Rule

The platforms are merged at the product, interface, configuration, and governance-contract levels.

Security-critical services remain independently deployable packages. A unified platform does not mean a monolithic runtime.

## Canonical Repository Family

| Repository | Unified role |
|---|---|
| `ohi-stack/acc` | Canonical platform and integration repository |
| `ohi-stack/acc-web` | Unified web operator interface |
| `ohi-stack/acc-api` | Public/internal ACC API gateway |
| `ohi-stack/acc-core` | Shared contracts, schemas, policies, and types |
| `ohi-stack/acc-auth` | Authentication, identity, sessions, RBAC |
| `ohi-stack/acc-runner` | Task and workflow execution runner |
| `ohi-stack/acc-db` | Database schemas and migrations |
| `ohi-stack/acc-logs` | Audit and event logging |
| `ohi-stack/acc-adapters` | Replaceable external adapters |
| `ohi-stack/acc-wp-adapter` | WordPress and WooCommerce bridge |
| `ohi-stack/ohi-control-plane` | OCP service package consumed by ACC Governance Console |

## Functional Merger

### OHI Command Console functions

- OHI service health
- OEG execution monitoring
- OCP policy status
- OSCC approval visibility
- Runtime topology
- Registry supervision
- Identity visibility
- Audit review
- Integration health

### Agent Command Console functions

- Agent directory
- Agent registry
- Capability management
- Task creation and queue monitoring
- Workflow definitions
- Delegation
- Scheduling
- Retry and failure review
- Agent runtime health

### Shared functions

- Authentication and RBAC
- Tenant selection
- Search
- Notifications and alerts
- Audit context
- Execution IDs
- Approval workflows
- Feature flags
- System settings
- API keys
- Adapter management

## Standard Module Contract

Every module follows:

`intake → validate → execute → verify → log → output`

No client-specific logic belongs in core code. Tenant variation is configuration-driven.

## Authority Boundaries

- ACC is the operator interface.
- OSCC governs orchestration and approvals.
- OCP evaluates policy, authorization, and risk.
- OEG provides governed execution entry.
- Runners execute approved tasks.
- Adapters remain replaceable.
- Audit services maintain append-only records.

## Routing Standard

- `/dashboard`
- `/ohi/*`
- `/agents/*`
- `/tasks/*`
- `/workflows/*`
- `/runtime/*`
- `/governance/*`
- `/registry/*`
- `/identity/*`
- `/audit/*`
- `/integrations/*`
- `/admin/*`

## Deployment Standard

`acc.onegodian.com` serves the unified frontend.

Backend services may remain separately addressable through private networking or controlled API endpoints, but they must not present competing public command-center brands.

## Migration Status

- Canonical ACC identity locked.
- Primary domain locked.
- Unified module registry added.
- Package metadata updated to ACC v1.1.0.
- OHI Control Plane designated as an ACC-consumed governance service.
- Remaining repo documentation and source integration should conform to this document.
