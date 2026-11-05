# Development guide

## Prerequisites

- Node.js 22 (the version is pinned in `.nvmrc`; with nvm, run `nvm use`)
- PostgreSQL 16 running locally, or a free [Neon](https://neon.tech) database

## First-time setup

```bash
# 1. Install dependencies for every workspace (apps/* and packages/*) in one go.
npm install

# 2. Create a local database user and database (skip if you use Neon).
psql postgres -c "CREATE USER fincast WITH PASSWORD 'fincast' CREATEDB;"
psql postgres -c "CREATE DATABASE fincast OWNER fincast;"

# 3. Create your local environment file. Edit DATABASE_URL if yours differs.
cp .env.example apps/api/.env

# 4. Create the tables by applying every migration in apps/api/drizzle.
npm run db:migrate --workspace apps/api
```

## Everyday commands

| Command              | What it does                                           |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Starts the API (port 3000) and the web app (port 5173) |
| `npm test`           | Runs every test in the repo once                       |
| `npm run test:watch` | Re-runs tests as you save files                        |
| `npm run lint`       | Checks code for likely bugs with ESLint                |
| `npm run typecheck`  | Checks TypeScript types in every workspace             |
| `npm run format`     | Formats every file with Prettier                       |
| `npm run build`      | Builds the API and web app for production              |

Open http://localhost:5173. Requests to `/api/*` are proxied to the API, so the browser sees one origin.

## Changing the database

1. Edit `apps/api/src/db/schema.ts`.
2. Run `npm run db:generate --workspace apps/api -- --name describe_the_change`. This writes a new SQL file in
   `apps/api/drizzle/`.
3. Read the generated SQL. It is what will run against production.
4. Run `npm run db:migrate --workspace apps/api`.
5. Commit the schema change and the migration together.

Never edit a migration that has already been merged; write a new one instead.

## Git workflow

- `main` is always deployable. Nobody pushes to it directly.
- Work on a short-lived branch: `feat/login`, `fix/forecast-month-end`, `docs/readme`.
- Commit messages use [Conventional Commits](https://www.conventionalcommits.org): `feat: add bill form`,
  `fix: handle bills due on the 31st`, `test: ...`, `docs: ...`, `chore: ...`.
- Open a pull request. CI must pass and the change must be reviewed before merging.
