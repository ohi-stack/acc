# ACC v1

ACC v1 is the first production-oriented control-plane repository for the Agent Command Console.

## Included
- Express API
- Agent registry module
- Task submission module
- Workflow registry module
- Redis-backed BullMQ queue
- Postgres persistence
- Health and readiness endpoints
- PM2 config
- Dockerfile
- GitHub Actions CI

## Routes
- `GET /health`
- `GET /ready`
- `GET /agents`
- `POST /agents`
- `GET /tasks`
- `POST /tasks`
- `GET /workflows`
- `POST /workflows`

## Local startup
```bash
cp .env.example .env
npm install
npm run build
npm start
```

## Development
```bash
npm install
npm run dev
```

## Production notes
- Build TypeScript before running under PM2.
- Provide live Redis and Postgres services.
- Place behind Nginx at `acc.quantumohi.com`.
- Do not expose Redis or Postgres publicly.
