# OHI-ACC™ Sitemap

**Product:** OHI-ACC™ — Agent Command Console  
**Canonical domain:** https://acc.onegodian.com  
**Repository:** `ohi-stack/acc`  
**Version:** 1.4.0

OHI-ACC™ is the operational command and orchestration control plane for OneGodian agents, workflows, approvals, execution, deployment evidence, verification, and connected systems.

## Implemented route surfaces

These routes are backed by the current application router and should be treated as implemented application surfaces:

```text
/
├── /console/*
│   ├── /console/dashboard
│   └── /console/command
├── /agents
├── /agents/*
├── /tasks
├── /tasks/*
├── /workflows
├── /workflows/*
├── /engineering-council
├── /engineering-council/*
├── /models
├── /models/*
├── /connections
├── /connections/*
├── /executions
├── /executions/*
├── /approvals
├── /approvals/*
├── /governance/*
├── /deployments
├── /deployments/*
├── /verification
├── /verification/*
├── /audit
├── /audit/*
├── /status
├── /docs
├── /settings
└── /account
```

## Canonical product information architecture

The following structure defines the intended OHI-ACC information architecture. Items not listed in the implemented route section above remain planned until code, routing, tests, and deployment verification exist.

```text
/
├── /about
├── /architecture
│   ├── /architecture/control-plane
│   ├── /architecture/agent-orchestration
│   ├── /architecture/engineering-council
│   ├── /architecture/omos
│   ├── /architecture/ocp
│   ├── /architecture/oeg
│   ├── /architecture/verification
│   └── /architecture/security
│
├── /console
│   ├── /console/dashboard
│   ├── /console/command
│   ├── /console/tasks
│   ├── /console/workflows
│   ├── /console/agents
│   ├── /console/approvals
│   ├── /console/executions
│   ├── /console/deployments
│   └── /console/activity
│
├── /agents
│   ├── /agents/development
│   ├── /agents/research
│   ├── /agents/real-estate
│   ├── /agents/finance
│   ├── /agents/legal-compliance
│   ├── /agents/security
│   ├── /agents/media
│   └── /agents/operations
│
├── /workflows
│   ├── /workflows/engineering
│   ├── /workflows/development
│   ├── /workflows/deployment
│   ├── /workflows/research
│   ├── /workflows/verification
│   └── /workflows/templates
│
├── /engineering-council
│   ├── /engineering-council/issues
│   ├── /engineering-council/assignments
│   ├── /engineering-council/pull-requests
│   ├── /engineering-council/reviews
│   ├── /engineering-council/ci
│   ├── /engineering-council/omos-review
│   └── /engineering-council/deployment-proof
│
├── /integrations
│   ├── /integrations/github
│   ├── /integrations/omos
│   ├── /integrations/ocp
│   ├── /integrations/oeg
│   ├── /integrations/odin
│   ├── /integrations/obp-1
│   ├── /integrations/qrv
│   ├── /integrations/openai
│   └── /integrations/providers
│
├── /governance
│   ├── /governance/authority
│   ├── /governance/permissions
│   ├── /governance/approval-gates
│   ├── /governance/policies
│   ├── /governance/audit
│   └── /governance/kill-switches
│
├── /verification
│   ├── /verification/executions
│   ├── /verification/deployments
│   ├── /verification/records
│   └── /verification/proof
│
├── /status
│   ├── /status/system
│   ├── /status/agents
│   ├── /status/providers
│   ├── /status/services
│   └── /status/incidents
│
├── /docs
│   ├── /docs/getting-started
│   ├── /docs/architecture
│   ├── /docs/api
│   ├── /docs/agents
│   ├── /docs/workflows
│   ├── /docs/adapters
│   ├── /docs/security
│   ├── /docs/authority-model
│   ├── /docs/environment
│   └── /docs/deployment
│
├── /developers
│   ├── /developers/api
│   ├── /developers/sdk
│   ├── /developers/adapters
│   ├── /developers/webhooks
│   └── /developers/examples
│
├── /settings
│   ├── /settings/general
│   ├── /settings/agents
│   ├── /settings/providers
│   ├── /settings/integrations
│   ├── /settings/permissions
│   └── /settings/security
│
├── /login
└── /account
```

## Primary navigation target

`Console · Agents · Workflows · Engineering Council · Integrations · Architecture · Docs`

Utility surfaces: `System Status · Account`

## Authority and execution boundary

```text
Human Operator
  ↓
OHI-ACC™
  ↓
OCP™ — Policy / Authorization
  ↓
OEG™ — Execution Gateway
  ↓
Authorized Agent / Model / Tool / Adapter
  ↓
Verification / Audit / Deployment Evidence
```

OMOS™ and Oru’Valen™ may provide reasoning, context, policy-alignment support, and decision support, but they do not self-authorize privileged production actions.

## Maturity rule

A sitemap item must not be represented as operational merely because it appears in this document.

Canonical lifecycle:

`Planned → Implemented → Tested → Operational → Verified`

Production claims require deployed runtime evidence.
