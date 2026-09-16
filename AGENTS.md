# ACC™ Repository Operating Instructions

## Canonical role

ACC™ is the OneGodian execution control plane at `https://acc.onegodian.com`.

Canonical operator surfaces:

- Oru’Valen™: `/oruvalen`
- OMOS™: `/omos`
- Agents: `/agents`
- Approvals: `/approvals`
- Audit: `/audit`

## Authority and system boundaries

1. **Oru’Valen™** — O-H-I Twin for continuity, context, lived-experience learning, decision memory, current-state modeling, and decision support.
2. **OMOS™** — governed reasoning, alignment, council synthesis, reference runs, and Decision Records according to verified implementation status.
3. **ACC™** — execution control plane for agents, tasks, workflows, approvals, connections, deployments, verification, and audit.
4. **Agents / tools** — bounded executors registered and permissioned through ACC.
5. **Authorized human judgment** — final authority for material and irreversible decisions.

Oru’Valen is not an external AI agent and must not be collapsed into the ACC Agents registry.

Canonical flow:

```text
Human input
→ Oru’Valen context and continuity
→ OMOS governed reasoning / Decision Record
→ Human gate
→ ACC authorized execution
→ agents / tools / integrations
→ measured outcome
→ proposed learning
```

## Evidence discipline

Material statements about the human authority must remain classified as one of:

- FACT
- STATED POSITION
- INFERENCE
- PREDICTION

Inference and prediction must never be silently promoted to fact or authority.

## Operational versioning

Do not represent a capability as Operational or Production unless it is implemented, documented, repeatable, permissioned, and verified in the applicable environment.

Allowed maturity labels:

- Operational
- Production
- In development
- Prototype
- Concept
- Historical proposal
- Paused
- Archived
- Retired

## Security

- Never commit credentials, API keys, cookies, tokens, private keys, WordPress Application Passwords, database passwords, or deployment secrets.
- Use environment variables and approved secret stores.
- Preserve least privilege.
- Production authority must remain server-bound after authentication.
- Do not trust caller-supplied authority or role headers.
- High-risk and irreversible actions require the applicable human approval gate.
- Do not bypass audit logging.
- Destructive operations require explicit authorization and a rollback path.

## Engineering workflow

1. Inspect the current architecture before changing files.
2. Preserve working functionality and current canonical routes.
3. Identify whether the change belongs to Oru’Valen, OMOS, ACC, or an external agent/tool.
4. Implement the smallest coherent change.
5. Run type checking, build, runtime smoke tests, authentication tests, and production preflight where applicable.
6. Review the diff and update documentation when behavior changes materially.
7. Merge only after required checks pass.
8. Deploy from the canonical production source.
9. Verify the live canonical domain and record deployment evidence.

## Canonical validation

```bash
npm install
npm run check
npm run build
npm test
npm run preflight:production
```

## Definition of Done

A material ACC feature is complete only when it is implemented, tested, documented, permissioned, auditable, deployed where required, verified on the canonical domain, and supported by a rollback path.
