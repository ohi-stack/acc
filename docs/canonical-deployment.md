# ACC Canonical Deployment Policy

## Primary subdomain

Use `acc.onegodian.com` as the primary subdomain.

## Decision

### Primary public/admin destination

```txt
acc.onegodian.com
```

ACC is the Agent Command Console and control-plane interface for the OneGodian ecosystem. It belongs under the main OneGodian operational domain because it governs agents, workflows, modules, dashboards, and internal execution infrastructure.

## QRV relationship

QRV is the verification and infrastructure layer, not the main ACC brand location.

## Best structure

```txt
acc.onegodian.com
```

Primary ACC dashboard, login, admin console, workflow control, agent registry, and execution monitoring.

```txt
api.acc.onegodian.com
```

ACC API, if separated from the frontend.

```txt
verify.qrv.network
```

QRV verification endpoint.

```txt
registry.qrv.network
```

QRV registry and verification records.

```txt
docs.qrv.network
```

QRV developer and verification documentation.

## Do not use as primary

```txt
acc.qrv.network
```

Using `acc.qrv.network` as the main ACC destination makes ACC appear to be a QRV product instead of the OneGodian command layer. QRV should support ACC, not absorb ACC.

## Clean architecture rule

```txt
OneGodian.com = ecosystem, apps, dashboards, command systems
QRV.network = verification, registry, certificates, audit, public trust layer
Capital.OneGodian.com = financial, investor, disclosure, instruments
```

## Recommended final mapping

| Function | Subdomain |
|---|---|
| ACC dashboard | `acc.onegodian.com` |
| ACC API | `api.acc.onegodian.com` |
| ACC docs | `acc.onegodian.com/docs` |
| ACC admin | `acc.onegodian.com/admin` |
| ACC health | `api.acc.onegodian.com/healthz` |
| ACC readiness | `api.acc.onegodian.com/readyz` |
| QRV verification | `verify.qrv.network` |
| QRV registry | `registry.qrv.network` |
| QRV developer docs | `docs.qrv.network` |

## Final domain standard

Use:

```txt
ACC.OneGodian.com
```

DNS-standard lowercase form:

```txt
acc.onegodian.com
```

Connect ACC to QRV through APIs, registry links, audit IDs, and verification routes.

## Live API note

`api.onegodian.org` is already live as a Node API. Until `api.acc.onegodian.com` is separated, ACC may consume the live OneGodian API base while preserving `api.acc.onegodian.com` as the future dedicated ACC API target.