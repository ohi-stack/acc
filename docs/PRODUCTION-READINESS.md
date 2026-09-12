# ACC Production Readiness

**Service:** ACC — Agent Command Console  
**Target version:** 1.2.0  
**Canonical host:** `https://acc.onegodian.com`  
**Status:** Functional / release-candidate hardening; Production not claimed by this document.

## Production invariants

ACC production is eligible for deployment only when all of the following are true:

1. `npm run check` passes.
2. `npm run build` produces `dist/index.js`, `public/bundle.js`, and `public/index.html`.
3. `npm run test:smoke` passes against the compiled runtime.
4. `npm run preflight:production` passes with protected production environment variables.
5. `NODE_ENV=production` and `ACC_VERSION=1.2.0` are set.
6. Production PostgreSQL is remote/non-local and reachable; local PGlite fallback is prohibited in production.
7. Production startup uses schema-only migrations and never inserts demo/baseline provider, connection, deployment, approval, or agent records.
8. `ALLOW_CORS_ORIGIN` is an explicit trusted origin, not `*`.
9. The server-side API key is configured outside the repository.
10. `/health` returns the expected service/version and `/ready` returns HTTP 200 with a healthy remote PostgreSQL dependency.
11. The exact deployed commit SHA is recorded in the deployment evidence.
12. A restart/redeploy of that same revision preserves authoritative production state and returns to `ready`.

## CI evidence

The repository CI now performs:

- TypeScript type checking;
- production artifact build;
- compiled runtime smoke test;
- production-environment preflight contract validation.

CI is necessary but does not establish Production status. Live deployment proof remains required.

## Production database boundary

Development and test environments may use local PGlite. Production may not. If remote PostgreSQL is missing or unreachable, ACC fails startup instead of silently degrading to local persistence.

The legacy development migration runner still seeds baseline/demo records for local development. Production startup uses `src/db/migrate-production.ts`, which applies schema only and explicitly requires a remote database.

## Deployment proof record

Retain the following non-secret evidence for each production promotion:

- merge SHA;
- deployed SHA;
- deployment timestamp UTC;
- runtime version;
- `/health` result;
- `/ready` result;
- PostgreSQL backend/host classification without credentials;
- smoke-test result;
- rollback target;
- approving human/operator reference.

A merge is not deployment proof, and a successful health response is not proof that external agent/model connectors are verified.
