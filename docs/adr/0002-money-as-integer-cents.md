# 0002: Store all money as integer cents

Date: 2026-11-05 · Status: accepted

## Context

JavaScript numbers are binary floating point, which cannot represent most decimal fractions exactly:
`0.1 + 0.2 === 0.30000000000000004`. A forecast adds up hundreds of amounts, so small errors accumulate and a
total can be off by a cent.

## Decision

Every amount is an integer number of cents in the database (`integer` columns ending in `_cents`), in the API
and in the forecast engine. Conversion happens only at the edges, with `parseDollarsToCents` for user input
and `formatCents` for display (`packages/shared/src/money.ts`).

## Consequences

- Addition and subtraction are exact.
- Division (for example splitting a goal into monthly amounts) must round explicitly, and we choose how.
- Postgres `integer` holds up to about $21 million in cents, far beyond any personal balance. We can move to
  `bigint` later if needed.

## Alternatives considered

- **Postgres `numeric` with a decimal library in JavaScript:** exact, but adds a dependency and conversions on
  every read.
