# ACC™ — Oru’Valen™ / OMOS™ Sync Contract

**Effective:** 2026-09-16

ACC is the unified execution control plane. Oru’Valen is the personalized O-H-I Twin/context layer. OMOS is the governed reasoning, human-gate and Decision Record runtime.

## Canonical pipeline

```text
Human input → Oru context → OMOS governed reasoning → Human gate
→ Decision Record → ACC authorized execution → verification/audit
→ outcome → proposed Oru learning
```

## ACC requirements

ACC must treat Oru as a first-class O-H-I Twin module, not as an external AI agent. The external Agent Registry remains available for agents/workers/tools/executors.

ACC execution handoff must carry at minimum:
- Decision Record ID
- approved action scope
- approval identity/state
- Oru context reference/hash where applicable
- execution adapter/tool
- idempotency/correlation identifier
- audit/provenance metadata

ACC must return:
- execution ID
- status
- timestamps
- tool/adapter identity
- result or failure class
- verification evidence/reference
- audit reference
- outcome payload suitable for OMOS reconciliation

## Human authority

No Oru recommendation or OMOS synthesis is itself execution authority. High-risk actions require explicit human approval and applicable policy authorization before ACC dispatch.

## Site/module surfaces

ACC should surface Oru through Twin Dashboard, Context & Memory, Decisions, Engineering Council, Connections, Approvals, Executions, Verification, Audit and System Health while preserving the unified OHI/Agent Command Console architecture.

## Production proof

Do not mark the Oru/OMOS/ACC loop operational until an authenticated end-to-end test proves decision approval, execution, verification, outcome return and proposed learning without hard-coded status claims.
