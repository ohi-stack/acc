# ACC™ Domain Mapping and QRV Boundary

## Decision

The primary public and administrative destination for ACC™ is:

```text
acc.onegodian.com
```

ACC™ stands for **Agent Command Console**. It is the OneGodian command layer for agents, workflows, modules, dashboards, internal execution infrastructure, and operator-facing control functions.

## Architectural Rule

```text
OneGodian.com = ecosystem, apps, dashboards, command systems
QRV.network = verification, registry, certificates, audit, public trust layer
Capital.OneGodian.com = financial, investor, disclosure, instruments
```

ACC belongs under the main OneGodian operational domain because it governs ecosystem operations. QRV supports ACC through verification, registry, audit, and public proof services, but QRV does not absorb or brand the ACC console.

## Do Not Use

```text
acc.qrv.network
```

Reason: this makes ACC appear to be a QRV product. ACC is the OneGodian command console; QRV is the verification and public trust infrastructure layer.

## Final Mapping

| Function | Destination |
|---|---|
| ACC dashboard | `acc.onegodian.com` |
| ACC API | `api.onegodian.com/acc` |
| ACC docs | `acc.onegodian.com/docs` |
| ACC admin | `acc.onegodian.com/admin` |
| ACC health | `api.onegodian.com/acc/healthz` |
| ACC readiness | `api.acc.onegodian.com/readyz` |
| QRV verification | `verify.qrv.network` |
| QRV registry | `registry.qrv.network` |
| QRV developer docs | `docs.qrv.network` |

## Relationship Between ACC and QRV

ACC connects to QRV through:

- QRV API calls
- Registry references
- Audit IDs
- Verification URLs
- Certificate/proof records
- Public verification routes

ACC is the command console. QRV is the verification layer.

## Implementation Requirements

1. Use `acc.onegodian.com` as the canonical domain in documentation, metadata, deployment notes, and environment examples.
2. Use `api.onegodian.com/acc` as the preferred shared API route unless a separate API host is required.
3. Use `api.acc.onegodian.com` only for separated ACC API deployment.
4. Keep `verify.qrv.network`, `registry.qrv.network`, and `docs.qrv.network` dedicated to verification and public trust infrastructure.
5. Do not route ACC admin surfaces through QRV subdomains.

## Product Positioning

ACC™ is the unified operator console for:

- Agent registry
- Workflow control
- Module dashboards
- Internal execution infrastructure
- OHI governance visibility
- OEG execution monitoring
- OSCC/OCP supervision surfaces
- System health and readiness

QRV.network supports ACC by providing verification, registry, certificate, audit, and public proof endpoints.
