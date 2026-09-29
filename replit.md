# LinkLedger Backlink Checker

LinkLedger is a responsive Phase 1 backlink checker SaaS prototype that validates a domain and presents clearly labeled sample backlink results.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/backlink-checker run dev` — run the web app through the managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/backlink-checker/src/App.tsx` — home and sample-results routes
- `artifacts/backlink-checker/src/lib/data-provider.ts` — `BacklinkDataProvider` contract and deterministic local sample provider
- `artifacts/backlink-checker/src/index.css` — LinkLedger theme and responsive styles
- `/` — domain/URL entry and plan previews
- `/results?domain=example.com` — labeled sample backlink results

## Architecture decisions

- Phase 1 uses a local deterministic provider so the UI is useful without claiming a live crawl.
- `BacklinkDataProvider` keeps data access replaceable for a future server-side provider; no browser API credentials or external calls are present.
- Domain inputs are normalized to lowercase hostnames and `www.` is removed before routing.
- Sample results always show a visible `SAMPLE DATA · NOT A LIVE SCAN` label.

## Product

- Validates and normalizes domain or URL input.
- Shows sample totals for backlinks, referring domains, follow links, and nofollow links.
- Lists sample source URL, target URL, anchor text, link type, and last-seen date records.
- Presents Free, Starter, and Agency plan previews with “Coming soon” pricing.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
