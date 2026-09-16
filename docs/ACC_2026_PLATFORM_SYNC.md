# ACC™ 2026 Platform Sync

Canonical domain: `https://acc.onegodian.com`

## Purpose

ACC™ is the unified operator console for the OneGodian operational stack. It must coordinate OHI systems, agents, workflows, queues, audits, WordPress/plugin adapters, OMOS integration, and deployment status without becoming the legal owner, founder, governing authority, or final decision-maker.

## Non-negotiable versioning rule

> If it is not fully operational, documented, and repeatable, it does not exist in the current version.

Every ACC module must be classified as one of:

- Operational
- In production
- In development
- Prototype
- Concept
- Historical proposal
- Paused
- Archived
- Retired

## 2026 ACC system responsibilities

| Area | ACC responsibility | Boundary |
|---|---|---|
| OHI systems | Monitor status, display manifests, route approved actions | ACC does not create doctrine or final authority |
| Agents | Register agents, roles, capabilities, tasks, and workflow ownership | Agents do not bypass human approval |
| OMOS | Consume OMOS manifests and route protocol/tool requests | OMOS remains a separate node |
| OneGodian App | Provide operator-side control data to app-facing surfaces | App remains public/member-facing only |
| WordPress plugins | Track plugin status by site, shortcode, API bridge, and health | No credential storage in code |
| Capital portal | Monitor disclosure-first capital readiness and plugin/node health | No securities claims or live offerings without legal review |
| Galaxy | Track registry, store-world, lore, media, and product modules | Creative universe remains separate from legal authority |
| QuantumOHI | Track platform plugin, enterprise pages, OHI/QOHI docs, and runtime status | Do not claim quantum functions are operational without evidence |
| QRV / OBP-1 | Track verification endpoints, certificate references, and record status | Verification status must be evidence-based |

## Required ACC pages

- `/` — ACC overview
- `/dashboard` — operator dashboard
- `/agents` — agent registry
- `/agents/[id]` — agent detail
- `/tasks` — tasks and queues
- `/workflows` — workflow definitions
- `/plugins` — plugin status by property
- `/sites` — ecosystem sites and node health
- `/omos` — OMOS node sync
- `/app` — app.OneGodian.com sync
- `/capital` — capital.OneGodian.com node/plugin sync
- `/galaxy` — galaxy.OneGodian.com sync
- `/quantumohi` — QuantumOHI.com sync
- `/audit` — immutable audit log view
- `/settings` — environment and integration configuration
- `/docs` — operator documentation

## Required API contracts

- `GET /health`
- `GET /ready`
- `GET /manifest`
- `GET /api/agents`
- `GET /api/tasks`
- `GET /api/workflows`
- `GET /api/plugins`
- `GET /api/sites`
- `GET /api/audit`
- `POST /api/tasks` with approval policy
- `POST /api/workflows/run` with approval policy

## Required plugin status model

Each connected WordPress plugin must report:

```json
{
  "site": "onegodian.org",
  "plugin": "OneGodian Platform Plugin",
  "version": "0.0.0",
  "registered": true,
  "working": false,
  "connected": false,
  "last_checked_at": null,
  "status": "setup",
  "errors": []
}
```

Status labels:

- Registered
- Working
- Connected
- Error
- Setup
- Unknown

## Human approval gates

ACC must require human approval for:

- Production deployment
- Plugin installation or deletion
- Database destructive changes
- Capital transaction flows
- Securities/offering publication
- Policy mutation
- Agent permission escalation
- Credential rotation
- Public claim changes involving legal, financial, or institutional authority

## Immediate 2026 build sequence

1. Confirm canonical deployment target for `acc.onegodian.com`.
2. Add environment contract and `AGENTS.md` across ACC repos.
3. Build shared manifest schema for sites, agents, workflows, plugins, and audit events.
4. Connect `acc-web` dashboard pages to manifest data.
5. Connect `acc-api` to `acc-core` through documented endpoints.
6. Add `acc-wp-adapter` WordPress REST authentication test using environment variables only.
7. Add plugin status screen: Registered / Working / Connected / Error.
8. Add OMOS manifest consumer.
9. Add OneGodian App manifest consumer.
10. Add Capital, Galaxy, QuantumOHI, QRV integration cards.
11. Add smoke tests for health, manifest, and plugin-status output.
12. Do not label ACC production-ready until the complete route/API/plugin sync is tested and repeatable.

## Security standard

Never commit:

- API keys
- WordPress application passwords
- SSH keys
- database credentials
- tokens
- cookies
- private logs
- investor records
- member private records

## Definition of done

A 2026 ACC feature is complete only when it is:

- Implemented
- Tested
- Documented
- Repeatable
- Visible in the appropriate dashboard or API
- Bound by human approval where required
- Supported by rollback or safe failure behavior
