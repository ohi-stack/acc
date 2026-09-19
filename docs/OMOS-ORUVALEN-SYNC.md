# OMOS ↔ Oru’Valen™ ↔ ACC Sync

**Canonical OMOS node:** `https://omos.onegodian.com`  
**Canonical ACC node:** `https://acc.onegodian.com`  
**Oru’Valen class:** OHI Twin / Operational Intelligence

## Responsibility boundary

- **Oru’Valen™** owns personalized context, continuity, current-state modeling, decision memory, lived-experience context, and proposed outcome learning.
- **OMOS** owns governed reasoning, alignment, Council review, governed synthesis, the human decision gate, and durable Decision Records.
- **ACC** owns permissions, tools, agent registry, workflow execution, escalation, production controls, attribution, revocation, and execution audit.

## Canonical flow

```text
Human Input
  → Oru Context
  → OMOS Distill
  → Alignment
  → Council Review
  → Governed Synthesis
  → Human Gate
  → Decision Record
  → ACC Authorized Execution
  → Outcome
  → Oru Learning Proposal
```

## ACC contract

ACC MUST reject an OMOS handoff unless all required authorization conditions are satisfied. The minimum handoff envelope is versioned and defined in `contracts/omos-oruvalen-handoff.schema.json`.

Required execution conditions:

1. A durable OMOS Decision Record identifier is present.
2. Human approval is explicitly recorded for material action.
3. Requested action is named and bounded.
4. Requested ACC capability is registered and permitted.
5. Oru context snapshot hash is preserved when Oru context influenced the decision.
6. Inference and prediction are never treated as authority.
7. Execution result is attributable and can be returned to OMOS/Oru as an outcome record.

## Current maturity

This repository update defines the cross-platform contract and ACC architecture surface. It does **not** claim the production execution bridge is complete.

Current OMOS Oru integration supports caller-supplied context snapshots and deterministic context hashes. Remaining production work includes approved-source retrieval, authenticated current-state editing, live ACC handoff, measured outcome ingestion, and the closed digital-twin learning loop.

## UI requirement for ACC.OneGodian.com

ACC should expose an **Oru’Valen** first-class module separate from the external Agents registry, with these operator surfaces:

- Twin Dashboard
- Context & Memory
- OMOS Decisions
- Approvals
- Authorized Executions
- Outcomes & Learning
- Connections
- Audit
- System Health

The module must display live/verified state rather than hard-coded claims. Connection states should use `Connected`, `Degraded`, `Disconnected`, or `Not Configured` based on runtime evidence.

## Authority

Human authority remains final. Oru’Valen cannot represent itself as the human authority. OMOS Council consensus is not factual verification. ACC cannot execute material actions merely because Oru or a model recommends them.
