# 0003: Balance check-ins instead of transaction imports

Date: 2026-11-05 · Status: accepted (supersedes the original plan for manual transactions and CSV import)

## Context

The forecast only needs the user's plan (income, bills, goals) to project forward. But a plan alone drifts from
reality, because everyday spending and surprises never appear as bills. The original plan kept the forecast
honest with manual transaction entry and CSV bank-statement import. The product owner found that tedious, and
tedious finance apps get abandoned.

## Decision

Users record a **balance check-in** about once a week: the date and their real bank balance. The forecast always
starts from the latest check-in. Each check-in also stores what the forecast predicted for that day, so the app
can measure drift ("about $250 a month more spending than planned") and offer to adjust a single monthly
everyday-spending estimate.

## Consequences

- Much less effort for users: one number a week.
- Two fewer tables (`transactions`, `imports`) and no CSV parsing, which lowers the risk in week 4.
- Trade-off: no per-transaction history, so no spending-by-category insights. CSV import remains a possible
  later addition if check-ins prove too coarse.
