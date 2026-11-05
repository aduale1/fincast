# Fincast

Cash-flow forecasting for people with irregular income.

Budgeting apps assume a steady salary and look backwards at what you spent. Fincast looks forward. It
projects your balance against upcoming bills and savings goals and warns you early when a gap is coming,
even when your income depends on landing the next client.

It answers two questions:

1. Will I be able to pay my bills on time?
2. Am I on track for my savings goal, or am I fooling myself?

> Status: in development (project setup). See the [roadmap](#roadmap).

## How it works

- **Income sources with certainty levels.** Salary and signed retainers are _confirmed_; client deals you
  are pitching are _expected_, with a confidence level.
- **Two forecasts.** The _safe view_ counts only confirmed money. The _expected view_ adds likely deals.
- **Savings goals judged against real cash flow**, not just a progress bar.
- **Weekly balance check-ins** keep the forecast honest: you type in your real balance, and Fincast shows how
  far reality has drifted from the plan.

## Tech stack

TypeScript throughout. React + Vite + Tailwind on the frontend, Node.js + Express on the backend, PostgreSQL
with Drizzle ORM, Zod for validation, Vitest + Supertest for tests, GitHub Actions for CI.
The reasoning behind each choice is in [docs/adr](docs/adr).

## Repository layout

```
apps/
  api/        Express REST API, database schema and migrations
  web/        React single-page app
packages/
  shared/     Code used by both apps: money helpers, validation schemas, forecast engine
docs/         Development guide, architecture decision records, learning and interview notes
```

## Getting started

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Roadmap

- [x] Week 1: Project setup, CI, database schema
- [ ] Week 1: Sign-up, login, logout, first deploy
- [ ] Week 2: Income sources, bills, balance check-ins
- [ ] Week 3: Forecast engine and dashboard
- [ ] Week 4: Savings goals, drift detection, demo account, launch
