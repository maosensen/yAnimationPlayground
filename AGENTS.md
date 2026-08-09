# AGENTS.md

This file is the **single source of truth** for AI coding assistants (Claude Code, Cursor, Copilot, etc.) when working with code in this repository. Tool-specific entry points (e.g. `CLAUDE.md`) should only reference this file so guidance stays unified.

## Prerequisites

- Node.js >= 22 (the shared floor for Next.js and the future HyperFrames workspace)
- pnpm 10.x (pinned via `packageManager` in `package.json`)

## Core commands

```sh
pnpm install
pnpm dev              # Turbopack dev server (port 3005)
pnpm build            # Production build for the web workspace
pnpm start            # Run production build (port 3005)
pnpm check            # root Biome check + every workspace typecheck
pnpm check-types      # run each workspace's supported typecheck
pnpm lint             # repository-wide Biome lint + format check
pnpm lint:fix         # biome check --write
pnpm format           # biome format --write
```

### UI component workflow

```sh
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

- Components land in `apps/web/src/components/ui/` and are **owned by this repo** — edit them freely.
- The `@shadcn-space` registry is configured in `apps/web/components.json` for dashboard blocks.
- For new themes / token changes, prefer `pnpm dlx shadcn@latest init --preset <id> -c apps/web` over manual CSS variable edits.

### Tests

There is currently no test runner configured in this repository, so there is no supported single-test command yet.

## Architecture overview

This is a **pnpm monorepo** for browser animation labs and isolated video-rendering experiments. The existing Next.js 16 template lives intact in `apps/web`; video tools and reusable contracts stay outside its runtime boundary.

```
apps/
├── web/                      # Next.js 16 + shadcn playground shell
│   └── src/app/(app)/labs/   # CSS/SVG, GSAP, Motion, D3, Lottie, Rive, Canvas
├── remotion/                 # isolated frame-driven React video workspace
└── hyperframes/              # isolated HTML-to-video workspace
packages/
├── design-tokens/            # future cross-runtime visual contracts
├── motion-tokens/            # duration, easing, stagger, rhythm
├── motion-kit/               # reusable animation primitives
└── assets/                   # shared source assets and fixtures
notes/                        # evidence and conclusions from each lab
```

The complete shadcn component set, dashboard shell, changelog, runtime theme
settings, and token source remain under `apps/web/src/`. The working theme is
not duplicated into `packages/design-tokens`; extract a token only after a
second real consumer proves its API.

### Cross-cutting wiring

- Routes that need the sidebar/header shell go inside the `(app)` group; marketing/auth pages can live outside it to opt out.
- Sidebar navigation is data-driven via `navData` in `apps/web/src/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar.tsx`; nav items use `next/link` and highlight by `usePathname()`.
- Within `apps/web`, the `@/*` alias maps to that workspace's `src/*`.
- Remote images are served via `next/image`; allowed hosts live in `images.remotePatterns` in `apps/web/next.config.ts`.
- Do not install Remotion or HyperFrames in `apps/web`. Each renderer owns its dependencies and generated output inside its dedicated workspace.
- Heavy browser runtimes belong to their lab route and must be loaded only when that lab is active; never register them in the root layout or provider stack.
- Shared packages expose granular subpaths. Do not create a barrel that pulls every animation runtime into consumers.

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + React Compiler
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Lint & format:** Biome — single tool, do not add ESLint or Prettier
- **Package manager:** pnpm — do not generate `package-lock.json` or `yarn.lock`; delete them if they appear
- **Dev server:** Turbopack (default via `next dev`) — do not fall back to webpack unless there is a concrete incompatibility

## Standard libraries

Use these for their respective domains. Do not introduce alternatives without explicit approval.

| Domain | Library |
|---|---|
| Logging | `pino` (+ `pino-pretty` in dev) — import from `@/lib/logger` |
| Client state | `zustand` — stores under `apps/web/src/lib/stores/` |
| IDs | `nanoid` |
| Animation | `motion` (the package formerly known as framer-motion) |
| Date / time | `date-fns` |
| Server state / fetching | `@tanstack/react-query` — `QueryClient` factory at `@/lib/get-query-client` |
| Theme | `next-themes` — wrapped in `@/components/theme-provider` |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Charts | `recharts` via shadcn `ChartContainer` (`@/components/ui/chart`) |
| Toasts | `sonner` (`@/components/ui/sonner`) |

**Explicitly out of scope:**

- ❌ `axios` — use native `fetch` (react-query handles caching)
- ❌ ESLint / Prettier — Biome covers both
- ❌ `npm` / `yarn` commands — always `pnpm` (`pnpm dlx` instead of `npx`)
- ❌ `moment` / `dayjs` — `date-fns` only

## Next.js (read the installed docs, not training data)

This repo uses **Next.js 16**. Assumptions from training data or older articles may differ from the actual APIs, conventions, and recommended directory structure. **Before writing framework-related code**, read the docs bundled with the installed package and follow deprecation warnings:

- `apps/web/node_modules/next/dist/docs/`
- Verify the resolved version with `pnpm --filter @yanimation/web why next` or `apps/web/package.json` if in doubt.

## UI and styling constraints

### Theme & colors

The brand color is **`#2b7eff`** (`oklch(0.617 0.208 259.473)`). All theme tokens live in `apps/web/src/app/globals.css` (`:root` + `.dark`); the chart scale `--chart-1` … `--chart-5` is derived from the same hue.

Color usage priority:

1. Prefer shadcn semantic theme variables (`bg-primary`, `text-muted-foreground`, `border-border`, …).
2. For multi-dataset charts, use Chart variables `--chart-1` … `--chart-5`.
3. If more variants are needed, derive from base variables + opacity (e.g. `bg-primary/10`, `color-mix(..., transparent)`), not new hardcoded values.
4. Hardcoded color literals (`bg-white`, `text-black`, hex values, raw Tailwind palette colors for brand accents) are forbidden. Palette colors (`teal-400`, `orange-400`, …) are tolerated only as **data-differentiating** accents in demo blocks, never as the brand/primary color.

### Theming system (settings panel)

The runtime theme system (presets, custom brand color, neutral families, contrast, elevation, nav color, radius, fonts) is documented in **`docs/theming.md`** — read it before touching theme tokens, the settings drawer, or building new surface-level components. Hard rules:

- The settings pipeline has two reflectors that **must stay mirrored**: `settings-effect.tsx` (runtime) and `settings-script.tsx` (pre-paint FOUC script). A setting or migration applied in one but not the other is a bug.
- Adding a setting → follow the 6-step checklist in `docs/theming.md` (config → store → effect → script → drawer + isDirty → CSS).
- Any new grey-bearing token in `globals.css` must use the neutral parameterization (`oklch(L calc(C * var(--neutral-tint)) var(--neutral-hue))`), or it won't follow the Base color setting.
- Elevation is token-driven, two classes only: static surfaces (in the page) use `--shadow-card`/`--card-ring` (already wired into `Card`); floating surfaces (above the page) use `--shadow-overlay`/`--overlay-border`. Never put a hardcoded `shadow-*` and a visible border on the same surface; opt out with `shadow-none`/`ring-0`. Flat shadow states are `0 0 #0000`, never `none` (ring and shadow share one `box-shadow` list).
- Components hosted on nav surfaces inherit color (`currentColor`) instead of hardcoding `text-foreground`; a dark surface hosting generic components re-points `--accent` via the `data-surface="nav"` scope pattern.

### Recharts

- Pie charts (`<Pie>`) must render **clockwise from 12 o'clock**: always set `startAngle={90} endAngle={-270}` (the Recharts default `0 → 360` starts at 3 o'clock counter-clockwise, which is unintuitive).
  - Exception: gauges/half-circles that intentionally specify their own angles keep them; the rule applies to full-circle pies only.
- Chart components are client components (`"use client"`); colors come from `ChartConfig` referencing `--chart-*` / `--primary`.

### General

- Avoid over-design: keep shadcn defaults for padding and sizing; radius and elevation come from the theme tokens (`--radius`, `--shadow-card`, `--shadow-overlay`). Do not add ad-hoc radius/shadow/spacing utilities without a clear, documented requirement.
- Every page wraps its content in `<PageContainer>` (`@/components/page-container`) — it provides the page padding and obeys the Max Width setting. Do not hardcode `max-w-* mx-auto` page wrappers.
- Prefer `@/components/ui` primitives; do not re-implement equivalents inline:
  - `<Button>` not `<button className="...">`
  - `<Card>` not `<div className="rounded border...">`
  - `<Table>` not `<table className="...">`
  - `<Dialog>` / `<Sheet>` not custom modal `<div>` stacks
  - `<Select>` not native `<select>`

### System-header icon row

The header's icon cluster (`site-header.tsx`) is one visual family — mixing
icon sets or weights is what makes a toolbar look assembled by accident. New
header controls must follow all four rules:

- **One family, one weight:** Solar `*-bold-duotone` at `size-4.5`. Brand
  glyphs Solar doesn't carry (GitHub, X) are inlined SVGs with `fill-current`.
- **Muted, never full-strength:** `text-muted-foreground` plus
  `hover:text-foreground`. Letting glyphs inherit the header's own color makes
  them pure black in light mode, which reads as dirty next to the page's greys.
  The dark "apparent" panel is covered by the `data-surface="nav"` scope, which
  re-points `--foreground` / `--muted-foreground` to the sidebar palette — so
  this one pair of classes is correct on both surfaces.
- **Hover on `accent`, not `muted`:** that same scope re-points only
  `--accent` / `--accent-foreground`, so `hover:bg-accent` is the one hover
  that stays legible on the dark panel.
- **Panels match:** dropdown surfaces use the shared shape — mono uppercase
  label, `gap-1.5` rows, active row `border-primary bg-accent/60` with a
  `solar--check-circle-bold` in `text-primary`.

## Conventions

### Environment variables

- All env vars are declared in the zod schema in `apps/web/src/lib/env.ts` and read via
  `import { env } from "@/lib/env"` — never read `process.env` directly in app
  code (the only exceptions are `env.ts` itself and `apps/web/next.config.ts`).
- Adding a variable = schema (server / client / shared) + `runtimeEnv` map +
  `apps/web/.env.example` entry. Client-exposed vars must use the `NEXT_PUBLIC_` prefix.
- Validation runs at build/dev startup (imported by `apps/web/next.config.ts`), so a
  missing or malformed variable fails fast instead of at runtime.

### Error & status pages

- Full-page 4xx/5xx states use `<StatusPage>` (`@/components/status-page`) so
  they stay visually consistent; don't hand-roll centered error markup.
- Conventions already wired: global 404 (`apps/web/src/app/not-found.tsx`), in-shell 404
  (`(app)/not-found.tsx`), in-shell error boundary (`(app)/error.tsx`),
  root-crash fallback (`apps/web/src/app/global-error.tsx`), and a group-level loading
  skeleton (`(app)/loading.tsx` — override per page when the shape matters).
- Next 16.2 error boundaries receive `unstable_retry` (re-fetch + re-render);
  prefer it over the legacy `reset`.

### Logging

- Always import the shared logger: `import { logger } from "@/lib/logger"`
- Don't `console.log` in committed code — use `logger.debug` / `logger.info` / `logger.warn` / `logger.error`
- Log structured objects, not concatenated strings: `logger.info({ userId, action }, "user logged in")`

### State

- **Client-only ephemeral state:** `useState` / `useReducer`
- **Cross-component client state:** zustand store under `apps/web/src/lib/stores/`
- **Server data:** `@tanstack/react-query` — never put server response data into zustand

### Forms

- Schema first: define a `zod` schema, infer the TS type from it
- Wire to `react-hook-form` via `@hookform/resolvers/zod`
- Don't write manual validation logic alongside zod

### Provider stack

Root layout wraps children in `<Providers>` from `@/components/providers`. The order is `QueryClientProvider` → `ThemeProvider`. Don't change the order without a reason — `next-themes` reads from `localStorage` and needs to be inside any client-only context.

`<html>` must carry `suppressHydrationWarning` for `next-themes` to work without console noise.

### Naming

New files use kebab-case.

## Known issues

- **Turbopack dev CSS cache (Next 16.2.x):** edits to `apps/web/src/app/globals.css` theme variables are sometimes served stale by the dev server even after recompile. If colors don't update after a hard refresh: stop the dev server → remove `apps/web/.next/dev` → `pnpm dev`.

## Git commit messages

Write commit messages in **English**, following conventional commit prefixes:

- Line 1: type + summary (e.g. `feat: add dashboard app shell from shadcn-space/dashboard-shell-01`)
- Prefixes: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`, …
- Optional body: briefly explain the why/background

## Code style (Biome)

Biome handles both linting and formatting (no ESLint or Prettier). Key settings (`biome.json`):

- 2-space indent, double quotes, semicolons, trailing commas (Biome defaults)
- `organizeImports` is enforced as an assist action
- Next + React recommended rule domains are enabled
- shadcn components under `apps/web/src/components/ui/**` have relaxed rules (a11y, `noArrayIndexKey`, `noDangerouslySetInnerHtml`, etc.) because they are upstream-managed — do not "fix" upstream patterns there, and do not extend these relaxations to app code

## Before committing

1. `pnpm lint` passes
2. `pnpm check-types` passes
3. `pnpm build` passes (catches type errors that dev mode tolerates)
4. No `console.log` in committed code
5. No new top-level dependencies introduced without justification

## Feature ledger

`.roadmap/features.yaml` is this project's **feature ledger** — the single
source of truth for what exists, what's planned, and what blocks launch
(schema v1: yPulse repo `docs/feature-ledger.md`). yPulse collects it nightly.

**The one rule: completing a feature updates the ledger in the same commit.**
Set the entry's `status: done` and `completedAt: YYYY-MM-DD`; when starting
something new that has no entry, add one first. Granularity is announce-level —
one entry = one capability you could put in What's New; implementation details
go in the host entry's `note`, not into new entries. `id` values are permanent —
never rename or reuse them. Releases reconcile the ledger as a gate step
(`shippedIn` backfill happens there).
