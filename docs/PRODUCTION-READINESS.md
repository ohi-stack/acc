# ACC Production Readiness

**Service:** ACC — OneGodian Agent Command Console / Control Plane  
**Target version:** 1.3.0  
**Canonical host:** `https://acc.onegodian.com`  
**Canonical Oru’Valen route:** `/oruvalen`  
**Canonical OMOS route:** `/omos`  
**Status:** Functional / release-candidate hardening; Production is not claimed by this document alone.

## Production invariants

ACC production is eligible for deployment only when all of the following are true:

1. `npm run check` passes.
2. `npm run build` produces `dist/index.js`, `public/bundle.js`, and `public/index.html`.
3. `npm run test:smoke` passes against the compiled runtime.
4. `npm run test:auth` confirms unauthorized access is rejected, caller role elevation is blocked, and authority remains server-bound.
5. `npm run preflight:production` passes with protected production environment variables.
6. `NODE_ENV=production` and `ACC_VERSION=1.3.0` are set.
7. Production PostgreSQL is remote/non-local and reachable; local PGlite fallback is prohibited in production.
8. Production startup uses schema-only migrations and never inserts demo/baseline provider, connection, deployment, approval, or agent records.
9. `ALLOW_CORS_ORIGIN` is an explicit trusted origin, not `*`.
10. The server-side API key is configured outside the repository.
11. `/health` returns the expected service/version and `/ready` returns HTTP 200 with a healthy remote PostgreSQL dependency.
12. `/oruvalen` and `/omos` resolve through the canonical ACC shell for the deployed revision.
13. The exact deployed commit SHA is recorded in deployment evidence.
14. A restart/redeploy of that same revision preserves authoritative production state and returns to `ready`.

## CI evidence

The repository CI performs:

- TypeScript type checking;
- production artifact build;
- compiled runtime smoke test;
- production API authentication contract validation;
- production-environment preflight contract validation.

CI is necessary but does not establish Production status. Live deployment proof remains required.

## Oru’Valen / OMOS authority boundary

Oru’Valen™ is the O-H-I Twin / operational-intelligence layer. OMOS™ provides governed reasoning and Decision Record functions according to verified implementation status. ACC remains the execution control plane.

Neither Oru’Valen nor OMOS may be treated as self-authorizing production authority. Privileged actions remain subject to the applicable identity, policy, approval, execution, and audit controls.

## Production database boundary

Development and test environments may use local PGlite. Production may not. If remote PostgreSQL is missing or unreachable, ACC fails startup instead of silently degrading to local persistence.

The legacy development migration runner may seed baseline/demo records for local development. Production startup uses `src/db/migrate-production.ts`, which applies schema only and explicitly requires a remote database.

## Deployment proof record

Retain the following non-secret evidence for each production promotion:

- merge SHA;
- deployed SHA;
- deployment timestamp UTC;
- runtime version;
- `/health` result;
- `/ready` result;
- `/oruvalen` route verification;
- `/omos` route verification;
- PostgreSQL backend/host classification without credentials;
- smoke-test result;
- authentication-contract result;
- rollback target;
- approving human/operator reference.

A merge is not deployment proof, and a successful health response is not proof that external agent/model connectors are verified.
