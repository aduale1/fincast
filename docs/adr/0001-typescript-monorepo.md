# 0001: TypeScript monorepo with npm workspaces

Date: 2026-11-05 · Status: accepted

## Context

Fincast has a React frontend and an Express backend that must agree on the shape of data (validation rules,
money handling, the forecast engine). The developer is building depth in one language over four weeks.

## Decision

Use TypeScript everywhere, in a single repository with three npm workspaces: `apps/web`, `apps/api` and
`packages/shared`. Shared code is imported as `@fincast/shared` by both apps.

## Consequences

- One language and one toolchain (ESLint, Prettier, Vitest) for the whole codebase.
- Validation schemas and money helpers are written once and cannot drift apart between frontend and backend.
- One pull request can change the API and the UI together, and CI checks both.
- Trade-off: slightly more setup than two separate projects, and the shared package must stay free of
  browser-only or Node-only code.

## Alternatives considered

- **Separate repositories for frontend and backend:** shared types would have to be copied or published as a
  package. More overhead for a two-person project.
- **Next.js full-stack framework:** fewer moving parts, but it blurs the client/server boundary that this project
  is meant to demonstrate.
