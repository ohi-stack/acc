# QuantumOHI unified ACC platform integration

Date: 2026-10-25. Target public domain: https://quantumohi.com/. This is a planned canonical platform entry, not confirmation of hosting linkage or production deployment.

ACC = OHI Command Console + Agent Command Console. Preserve independent service boundaries: ohi-control-plane governs policies; acc-web renders distinct user and admin dashboards; acc-api mediates requests; acc-auth verifies identity; acc-runner invokes approved tasks; acc-logs records audit events.

## Proposed routes
- / : public landing and product information
- /login : authentication
- /dashboard : authenticated user home
- /dashboard/tasks, /dashboard/workflows, /dashboard/usage, /dashboard/settings : tenant-scoped user features
- /admin : restricted admin home
- /admin/governance, /admin/policies, /admin/approvals, /admin/runtime, /admin/audit, /admin/tenants, /admin/integrations : restricted operations

All routes are proposals until source implementation and deployment checks confirm them. Preserve acc.onegodian.com compatibility pending approved migration. Never redirect authenticated sessions across domains without validating cookies, OIDC callback URIs, CSRF, and logout behavior.

## Definition of done
1. Server-side user/admin authorization and tenant isolation tests pass.
2. User and admin data queries and caches are independently scoped.
3. All workflows use intake -> validate -> execute -> verify -> log -> output.
4. Live health, audit, deployment rollback, and smoke tests are evidenced.
5. Hostinger deployment source and DNS for quantumohi.com are confirmed before cutover.
