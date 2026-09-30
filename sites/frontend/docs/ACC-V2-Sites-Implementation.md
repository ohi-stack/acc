# ACC V2 Sites implementation

User-authorized scope: the September 30, 2026 ACC V2 task board, including frontend build and redeployment. Preserve owner-only Sites access. Canonical domain remains acc.onegodian.com; production baseline remains v1.3.0 until canonical V2 verification.

Source contract: ohi-stack/acc, feat/acc-v2-delegation-foundation, fd2f4604fcb7c8c7c4b8e98fa65562ee4bd664a7. V2 branch version 2.0.0-alpha.1.

## Architecture

Projects → Responsibilities → Work Orders → Delegation → Execution → Approval → Verification → Deployment → Audit. Shared authenticated console shell with grouped navigation on all operator routes. Read real backend records through a server-only proxy; never seed fake operational records. Derive project index from existing project references until a first-class project API is implemented. Preserve every existing canonical console route.

The authenticated Sites owner can read and create Work Orders and Responsibilities and submit governed approval decisions through verified foundation endpoints. API credentials stay server-bound. Unknown providers fail closed. Generic status mutations, direct dispatch, deployment writes and frontend approval assertions are prohibited. Unsupported backend capabilities remain unavailable with a documented gap. PostgreSQL remains owned by canonical ACC; no replacement persistence is introduced.

## Implementation plan (native execution)

1. Add behavioral tests for fail-closed providers, approval separation, verified deployment evidence, project derivation and proxy path restrictions. Run red.
2. Add contract helpers, canonical provider catalog, authenticated server proxy and endpoint validation. Run governance tests.
3. Replace simulated landing page with exception-first dashboard. Add catch-all authenticated routes, project tabs, record inspectors, creation forms, provider registry, delegation inspection and integration surfaces. Build shared loading/empty/error/unauthorized/degraded states.
4. Write OruValen Guide.txt, version policy, task-board coverage, API requirements and rollback procedure. Do not call backend gaps complete.
5. Run type checks, lint, behavioral tests, Worker route/auth smoke tests, production build and artifact validation. Inspect desktop and mobile rendering. Push exact source, save built artifact, publish owner-private version, inspect terminal deployment status and verify reachable Sites routes. Verify canonical domain only when accessible; record missing evidence accurately.

## Review focus

- Missing credentials must give 503 and Unknown, not fake zero activity or operational health.
- Caller-supplied role/actor/approval fields cannot elevate authority.
- Unknown/reserved providers cannot dispatch.
- Approval mutations must use independent governed endpoint and require a reason.
- Merged engineering work cannot imply verified deployment.
