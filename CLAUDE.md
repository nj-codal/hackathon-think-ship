# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                              # Start all 3 apps concurrently (Turbo)
pnpm build                            # Build all apps
pnpm typecheck                        # TypeScript check all apps
pnpm format                           # Prettier format everything

# Single-app dev
pnpm --filter @repo/web dev           # Next.js on :3000
pnpm --filter @repo/studio dev        # Sanity Studio on :3333
pnpm --filter @repo/sanity-app dev    # App SDK on :3334

# Single-app typecheck
pnpm --filter @repo/web typecheck
pnpm --filter @repo/studio typecheck
pnpm --filter @repo/sanity-app typecheck
```

No test runner is configured. There is no lint script at root; only the studio has `eslint .`.

## Architecture

pnpm Turborepo monorepo with three apps and one shared package:

```
apps/web          → Next.js 16 frontend (React 19, Tailwind CSS v4)
apps/studio       → Sanity Studio v5 (content editing UI)
apps/sanity-app   → Sanity App SDK (dashboard-embedded app)
packages/typescript-config → Shared tsconfig (base.json, nextjs.json, sanity.json)
```

**Web app** consumes Sanity content via `next-sanity` and `@sanity/client`. The Sanity client is configured in `apps/web/src/sanity/lib/client.ts` with live editing support in `live.ts`. Tailwind v4 uses CSS-first config (`globals.css` with `@import "tailwindcss"`, no `tailwind.config.js`).

**Studio** has an empty `schemaTypes/index.ts` ready for content modeling. Config is in `apps/studio/sanity.config.ts`.

**Sanity App** uses `@sanity/sdk-react` hooks and runs as a standalone app deployable to the Sanity Dashboard. CLI config in `sanity.cli.ts` needs a real `organizationId`.

## Key Constraints

- **Node >=20.9** (pinned in `.nvmrc` as `20`)
- **pnpm 9.15.4** (specified in root `packageManager`)
- **Sanity project ID and dataset**: set in `apps/web/.env.local` (see `.env.example`)
- **Strict TypeScript** with `noUncheckedIndexedAccess` enabled in base config
- React types are pinned to `^19.0.0` via pnpm overrides in root `package.json`

## Environment Variables

Web app reads from `.env.local` (gitignored). See `apps/web/.env.example` for required vars:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` — required
- `SANITY_API_READ_TOKEN` — optional, enables live draft previews
