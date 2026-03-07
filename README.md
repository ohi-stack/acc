# ACC — Agent Command Console

Agent Command Console (ACC) is the control plane for agents, tasks, workflows, and automation in the QuantumOHI infrastructure layer.

## Included in this repository

- Express + TypeScript service
- Agent registry API
- Task queue API with BullMQ
- Workflow registry API
- Redis connectivity
- PostgreSQL connectivity
- Health and readiness endpoints
- Docker and Docker Compose support
- PM2 ecosystem configuration
- GitHub Actions CI

## Repository description

Use this description on GitHub:

> Agent Command Console (ACC) — control plane for agents, tasks, workflows, and automation.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker compose up --build
```

## Health endpoints

- `GET /health`
- `GET /ready`

## Example API usage

All protected routes support the `x-api-key` header when `API_KEY` is set.

### Create agent

```bash
curl -X POST http://localhost:4000/agents \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "name": "verification-worker-1",
    "type": "worker",
    "capabilities": ["verify", "issue", "queue"]
  }'
```

### Create task

```bash
curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "type": "verify-record",
    "payload": {
      "recordId": "abc-123"
    }
  }'
```

### Create workflow

```bash
curl -X POST http://localhost:4000/workflows \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{
    "name": "QR-V Issue + Register",
    "steps": ["issue", "sign", "register", "notify"]
  }'
```

## Deployment target

Recommended domain:

- `acc.quantumohi.com`

Recommended runtime:

- Node 20
- Redis 7
- PostgreSQL 15
- PM2
- Nginx reverse proxy
