# ACC™ Platform Sync — September 16, 2026

## Scope

This update synchronizes the canonical ACC platform with the current OneGodian architecture for Oru’Valen™, OMOS™, governed engineering, human approval, and deployment evidence.

## Canonical Platform Roles

### Oru’Valen™

Oru’Valen is the OHI Twin and decision-support intelligence identity. It may learn from authorized institutional memory, lived-experience records, decision memory, current-state records, and outcome evidence. It must not be represented as the founder, legal owner, governing authority, or final decision-maker.

### OMOS™

OMOS is the OneGodian operating and reasoning framework. ACC may expose OMOS runtime and integration surfaces such as the reference run, health, manifest, providers, persistence, engineering review, and decision records according to verified implementation status.

### ACC™

ACC is the governed operator/control plane. It coordinates agents, tasks, workflows, approvals, executions, deployments, integrations, verification, and audit. ACC does not independently create authority.

## Authority Hierarchy

```text
Authorized Human Judgment
        ↓
Oru’Valen / OMOS decision support
        ↓
ACC control plane
        ↓
OCP policy + authorization
        ↓
OEG execution
        ↓
Agents / tools / adapters / workflows
        ↓
QR-V / ODIN / OBP-1 verification + audit evidence
```

## Engineering Council Standard

```text
GitHub Issue
→ Task Classification
→ Agent Assignment
→ Agent Work
→ Pull Request
→ Cross-Agent Review
→ Tests / CI
→ OMOS Review
→ Human Approval
→ Merge
→ Deployment Proof
```

Merge is not completion. A release is production-complete only when the deployed runtime has been verified at the canonical destination.

## New ACC Surfaces

### Oru’Valen

- `/oruvalen`
- `/oruvalen/context`
- `/oruvalen/memory`
- `/oruvalen/decisions`
- `/oruvalen/provenance`

### OMOS

- `/omos`
- `/omos/reference-run`
- `/omos/providers`
- `/omos/persistence`
- `/omos/manifest`

## Canonical External Nodes

- ACC: `https://acc.onegodian.com`
- OMOS: `https://omos.onegodian.com`
- QR-V Verify: `https://verify.qrv.network`
- QR-V Registry: `https://registry.qrv.network`

## Operational Status Rule

A system, adapter, provider, route, or integration must not be represented as operational merely because it is planned, documented, or visible in the UI. Operational status requires implemented functionality, successful verification, repeatability, and deployment evidence where applicable.

## Version

This sync establishes ACC platform metadata and user-interface integration at version `1.3.0`.
