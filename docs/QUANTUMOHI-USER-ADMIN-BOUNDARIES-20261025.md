# QuantumOHI User/Admin Separation Contract — 2026-10-25

Status: proposed integration; not proof of live deployment.

## Canonical ownership
- quantumohi.com / ohi-stack/quantumohi-platform: public platform and authenticated customer workspace.
- acc.onegodian.com / ohi-stack/acc: privileged unified OHI Command and Agent Command operator console.
- ohi-stack/acc-web: reusable frontend components for ACC; not a competing production deployment.
- ohi-stack/ohi-control-plane: independently deployed policy, risk, approval, and authorization authority.

## Required route and data separation
Public: /, /platform, /docs, /login
User: /dashboard, /dashboard/requests, /dashboard/executions, /dashboard/records, /dashboard/settings
Admin/operator: /admin, /admin/tenants, /admin/users, /admin/policies, /admin/approvals, /admin/agents, /admin/executions, /admin/audit

Routes are target contracts; do not claim deployed without browser and API evidence. Preserve existing routes with aliases where necessary.

User endpoints must be scoped by authenticated subject and tenant. Administrative endpoints must be independently authorized server-side, deny by default, and never rely on hiding UI elements. Require MFA/step-up for sensitive operations. Separate response DTOs, data queries, caching keys, storage namespaces and audit visibility. Never expose administrative service tokens to browser code. Use OCP for policy decisions and explicit approval gates; ACC is not the source of authority.

## Acceptance gates
1. Inventory deployed routes, current auth provider, API endpoints, tenancy model and hosting mapping before code migration.
2. Create distinct user and admin layout trees with route guards and independent navigation.
3. Enforce subject/tenant isolation in API and persistence; enforce operator role plus OCP authorization for admin operations.
4. Test unauthenticated, ordinary user, cross-tenant user, admin and revoked-role access; assert 401/403 and no data leakage.
5. Validate governance approval, audit provenance, execution idempotency and emergency stop behavior.
6. Run lint, typecheck, unit/integration, E2E and security tests, then deploy to staging and verify actual URLs.
7. Preserve rollback artifact and deploy production only after human approval and verified checks.

Do not copy OCP or ACC server implementation into the QuantumOHI frontend. Do not represent sample telemetry as live. Keep independently replaceable services and versioned contracts.
