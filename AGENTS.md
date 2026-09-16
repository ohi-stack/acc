# ACC™ Repository Operating Instructions

## Identity and authority

ACC™ is the OneGodian execution control plane at `acc.onegodian.com`.

Oru’Valen™ is the O-H-I Twin / operational intelligence layer inside ACC. Oru’Valen is not the founder, legal owner, governing authority, or an AI agent. External agents remain separate registry entries controlled through ACC.

Human authority remains final.

Canonical flow:

```text
Human input
→ Oru’Valen context and continuity
→ OMOS governed reasoning / Decision Record
→ Human gate
→ ACC authorized execution
→ Outcome
→ Proposed learning
```

## Architectural boundaries

1. **Oru’Valen™** — continuity, context, lived-experience learning, decision support, current-state modeling.
2. **OMOS™** — governed reasoning, council synthesis, Decision Records, alignment controls.
3. **ACC™** — execution control plane, agents, tasks, workflows, approvals, deployments, audit, connections.
4. **Agents / tools** — external executors registered and permissioned by ACC.
5. **Human authority** — final approval for material or irreversible actions.

Do not collapse these layers into one undifferentiated agent system.

## Evidence discipline

Material statements about the human authority must remain classified as one of:

- FACT
- STATED POSITION
- INFERENCE
- PREDICTION

Inference and prediction must never be silently promoted to fact or authority.

## Operational versioning

A capability is not represented as operational unless it is implemented, documented, repeatable, and verified in the applicable environment.

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

## Security and execution

- Never commit credentials, API keys, cookies, tokens, private keys, WordPress Application Passwords, database passwords, or deployment secrets.
- Use environment variables and the platform secret store.
- Preserve least privilege.
- Production actor/authority must remain server-bound.
- Do not trust caller-supplied role or authority headers.
- High-risk actions require a human approval gate.
- Do not perform destructive database operations without explicit authorization and a rollback path.
- Do not bypass audit logging.

## Required engineering workflow

1. Inspect existing architecture.
2. Preserve working functionality.
3. Define the applicable Oru / OMOS / ACC boundary.
4. Implement the smallest coherent change.
5. Run TypeScript checks, build, smoke tests, and auth-contract tests.
6. Review the diff.
7. Update documentation and version metadata when behavior changes materially.
8. Merge only after tests pass.
9. Deploy from the canonical production source.
10. Verify the live canonical domain.
11. Record deployment evidence.

## Canonical commands

```bash
npm install
npm run check
npm run build
npm run test
npm run preflight:production
```

## Production domain

```text
https://acc.onegodian.com
```

The canonical Oru’Valen surface inside ACC is:

```text
https://acc.onegodian.com/oru
```

OMOS remains a separate governed reasoning platform:

```text
https://omos.onegodian.com
```

## Definition of Done

A material ACC feature is complete only when it is:

- implemented;
- type-safe;
- tested;
- documented;
- permissioned appropriately;
- observable/auditable;
- deployed where required;
- verified on the canonical domain;
- supported by a rollback path.
