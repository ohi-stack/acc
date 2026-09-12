# ACC™ MCP Authorization Contract

Status: Production-readiness contract  
Scope: ACC / OCP / OEG integration with the OneGodian MCP Standard™ and OMOS Connection & Adaptation Layer™

## Purpose

ACC is the operator and orchestration control plane. It may initiate, supervise, approve, route, or monitor authorized execution, but it must not let a caller or connector manufacture authority for a consequential external action.

This contract defines the evidence ACC should provide to OMOS when a consequential MCP operation requires human or governed authorization.

## Separation of Responsibilities

- **MCP / Connection Layer:** transport, interoperability, discovery, normalized invocation.
- **OMOS:** connector permissions, governance, verification boundaries, state transitions, Decision Records, and maturity controls.
- **ACC:** operator workflow, approval UX, task/execution coordination, and approved-action routing.
- **OCP / policy service:** policy evaluation and authorization rules where deployed.
- **OEG / execution gateway:** governed execution boundary where deployed.
- **Connected domain:** source of record for its own state/action result.

ACC approval does not make ACC the source of record for GitHub, WordPress, Drive, QR-V, or another connected domain.

## Consequential Operations

A production approval record is required where policy marks an operation consequential, including at minimum:

- external-effect `tools/call`;
- `tasks/update`;
- `tasks/cancel`;
- domain writes;
- destructive changes;
- production deployment/restart actions;
- credential or permission changes;
- identity or registry mutation;
- payment, refund, funds movement, or other financially operative actions.

## Approval Record

The minimum production approval object should contain:

```json
{
  "approvalId": "ACC-APPROVAL-...",
  "approved": true,
  "approvedBy": "human-or-authority-id",
  "approvedAt": "2026-09-12T20:00:00Z",
  "policyRef": "OCP-POLICY-...",
  "operation": "tasks/update",
  "connectionId": "OMOS-CONN-...",
  "target": "domain-resource-or-action",
  "scope": {},
  "expiresAt": null,
  "executionId": null,
  "auditRef": "ACC-AUDIT-..."
}
```

The exact API representation may evolve, but the semantic evidence above must remain reconstructable.

## Verification Requirement

OMOS must not treat caller-supplied fields such as `approved: true` and `approvedBy` as authoritative production evidence by themselves.

For production consequential calls, OMOS should verify the approval through an approved authority mechanism, such as:

1. an ACC/OCP approval lookup by `approvalId`;
2. a signed/verifiable approval token with bounded scope and expiry;
3. an authenticated internal authorization service;
4. an equivalent approved authority verifier.

The verifier should establish that:

- the approval exists;
- the approval is valid and not revoked/expired;
- the operation matches;
- the connection/target matches;
- the approving actor had authority;
- the request remains within approved scope.

## Required Execution Sequence

`Operator Request → Policy Evaluation → Human/Authority Approval → OMOS Permission Check → Approval Verification → MCP Dispatch → Domain Result → Verification → Audit/Engineering Record`

Permission and approval are separate gates. Approval cannot grant a connector an undeclared permission, and connector permission cannot waive required human approval.

## Failure Behavior

The system must fail closed when:

- an approval is required but absent;
- an approval reference cannot be verified;
- an approval is expired or revoked;
- operation/target/scope does not match;
- connector permissions do not allow the operation;
- the connected domain cannot confirm a consequential result where verification is required.

A failed or missing approval must not be converted into success by retry, synthesis, model output, or administrator-facing UI state.

## Audit Requirements

ACC should retain or reference:

- approval ID;
- actor/authority;
- policy reference;
- timestamps;
- requested operation and target;
- OMOS connection ID;
- execution ID;
- request/response or result hashes where appropriate;
- final domain verification/disposition;
- exact deployed revision of the executing service where available.

Secrets must not be copied into approval or audit records.

## Maturity Boundary

A documented approval contract is not proof that the production authority service is operational.

The ACC/OMOS authorization path becomes **Verified** only after a real consequential test demonstrates the approval lookup/verification, permission enforcement, execution, domain result, and audit evidence end-to-end. It becomes **Production** only when that path is deployed, monitored, documented, repeatable, and recoverable.
