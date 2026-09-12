# ACC Production Readiness

**Service:** ACC — Agent Command Console  
**Target version:** 1.2.0  
**Canonical host:** `https://acc.onegodian.com`  
**Status:** Functional / release-candidate hardening; Production not claimed by this document.

## Production invariants

ACC production is eligible for deployment only when all of the following are true:

1. `npm run check` passes.
2. `npm run build` produces `dist/index.js`, `dist/db/schema.sql`, `public/bundle.js`, and `public/index.html`.
3. `npm run test:smoke` passes against the compiled runtime.
4. `npm run test:auth` proves invalid API keys are rejected and caller-supplied identity/role headers cannot elevate production authority.
5. `npm run preflight:production` passes with protected production environment variables.
6. `NODE_ENV=production` and `ACC_VERSION=1.2.0` are set.
7. Production PostgreSQL is remote/non-local and reachable; local PGlite fallback is prohibited in production.
8. Production startup uses schema-only migrations and never inserts demo/baseline provider, connection, deployment, approval, or agent records.
9. `ALLOW_CORS_ORIGIN` is an explicit trusted origin, not `*`.
10. The server-side API key is configured outside the repository.
11. Production operator identity/role are server-configured with `ACC_OPERATOR_ID` / `ACC_OPERATOR_ROLE`; request headers cannot self-authorize `super_admin` or impersonate another operator.
12. `/health` returns the expected service/version and `/ready` returns HTTP 200 with a healthy remote PostgreSQL dependency.
13. The exact deployed commit SHA is recorded in the deployment evidence.
14. A restart/redeploy of that same revision preserves authoritative production state and returns to `ready`.

## CI evidence

The repository CI now performs:

- TypeScript type checking;
- production artifact build including packaged SQL schema;
- compiled runtime smoke test;
- production API-authentication / anti-self-elevation contract;
- production-environment preflight contract validation.

CI is necessary but does not establish Production status. Live deployment proof remains required.

## Production database boundary

Development and test environments may use local PGlite. Production may not. If remote PostgreSQL is missing or unreachable, ACC fails startup instead of silently degrading to local persistence.

The legacy development migration runner still seeds baseline/demo records for local development. Production startup uses `src/db/migrate-production.ts`, which applies the packaged schema only and explicitly requires a remote database.

## Production authority boundary

`/api/v1` is private in production. Requests require the configured server-side API key. After successful authentication, ACC overwrites caller-provided actor/role headers with the server-configured operator identity. This prevents a client from becoming `super_admin` merely by supplying a header.

This is still an initial single-operator authentication boundary, not a complete multi-user IAM system. Production expansion to multiple operators should bind API credentials to distinct persisted identities/roles rather than reintroducing caller-asserted roles.

## Deployment proof record

Retain the following non-secret evidence for each production promotion:

- merge SHA;
- deployed SHA;
- deployment timestamp UTC;
- runtime version;
- authentication test result;
- `/health` result;
- `/ready` result;
- PostgreSQL backend/host classification without credentials;
- smoke-test result;
- rollback target;
- approving human/operator reference.

A merge is not deployment proof, and a successful health response is not proof that external agent/model connectors are verified.
