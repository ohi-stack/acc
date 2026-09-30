# ACC V2 Sites frontend

Project-centered operator console for the existing owner-private OHI Command Center Sites project. Development track **2.0.0-alpha.1**. Canonical production baseline remains **v1.3.0** pending V2 merge, deployment and verification on acc.onegodian.com.

The source implements Projects → Responsibilities → Work Orders → Delegation → Execution → Approval → Verification → Deployment → Audit. Agents are bounded executors. No fake operational records are seeded. Missing runtime evidence is Unknown.

## Run and verify

Node >=22.13; `npm run install:ci`, `npm run dev`, `npx tsc --noEmit`, `npm run lint`, `npm test`. Tests build the Worker, validate the artifact, check every preserved route, and enforce API authentication, provider and approval boundaries. The Worker artifact is under `dist/` with `.openai/hosting.json`.

## Connect

Set **server-only** `ACC_API_ORIGIN`, secret `ACC_API_KEY`, and `ACC_OPERATOR_EMAILS` through the Sites runtime environment. API origin must be HTTPS. Backend is the authenticated canonical ACC V2 PostgreSQL service; no local database replaces it. Never expose credentials to the browser. Backend production API authentication binds authority to configured operator identity; caller headers cannot self-elevate.

Supported writes create PLANNED Work Orders, DRAFT Responsibilities, and governed APPROVED/REJECTED decisions through the separate approval endpoint. Direct dispatch and generic status writes are blocked. Request Changes, first-class Projects, correlated audit timeline, Oru/OMOS integration data and complete engineering lifecycle need canonical backend implementation.

See `docs/ACC-V2-Sites-Implementation.md` and downloadable guides under `public/` for coverage, release gates, integration requirements and rollback. Sites deployment does not certify canonical ACC V2 production. Preserve owner-only audience. Rollback to prior saved Sites version 2 if needed.

Frontend mirror belongs in `ohi-stack/acc/sites/frontend` on the Sites integration branch. Keep application source and lockfile synchronized with Sites. Merge/deploy canonical ACC only after its own release gates pass.
