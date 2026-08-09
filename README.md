# yTemplate

English | [简体中文](./README.zh-CN.md)

A personal Next.js starter template with an opinionated stack and a ready-to-use dashboard shell, so new projects can skip setup and start shipping features immediately.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8) ![Biome](https://img.shields.io/badge/Biome-2.x-60a5fa) ![pnpm](https://img.shields.io/badge/pnpm-10-f69220)

## Features

- **Next.js 16** — App Router, TypeScript, Turbopack, React Compiler
- **Tailwind CSS v4 + shadcn/ui** — full component set in-repo (`src/components/ui/`), themed via CSS variables
- **Dashboard shell** — sidebar + header layout (`shadcn-space/dashboard-shell-01`) with data-driven navigation, light/dark theme toggle, and demo analytics/chart pages
- **Brand theme** — blue `#2b7eff` primary with a derived 5-step chart color scale, light & dark modes
- **Biome** — single tool for linting and formatting (no ESLint/Prettier)
- **Batteries included** — `pino` (logging), `zustand` (client state), `@tanstack/react-query` (server state), `react-hook-form` + `zod` (forms), `date-fns`, `motion`, `next-themes`, `recharts`

## Getting started

Requires **Node.js >= 20** and **pnpm 10.x**.

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3005](http://localhost:3005) — the dev server and
`pnpm start` both default to port **3005**.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Turbopack dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm check-types` | TypeScript type check (`tsc --noEmit`) |
| `pnpm lint` | Biome lint + format check |
| `pnpm lint:fix` | Apply Biome fixes |
| `pnpm format` | Format only |

## Project structure

```
src/
├── app/
│   ├── (app)/                # Routes wrapped by the dashboard shell
│   │   ├── page.tsx          # / — analytics dashboard
│   │   └── charts/           # /charts/line, /charts/bar
│   ├── layout.tsx            # Root layout (fonts, providers)
│   └── globals.css           # Tailwind v4 + theme tokens
├── components/
│   ├── ui/                   # shadcn components (owned by this repo)
│   ├── shadcn-space/blocks/  # Dashboard blocks (sidebar, header, charts)
│   ├── providers.tsx         # QueryClient → Theme provider stack
│   └── theme-toggle.tsx      # Light/dark toggle
└── lib/                      # logger, query client, zustand stores, utils
```

## Adding components

```sh
pnpm dlx shadcn@latest add <component-name>
```

Generated components live in `src/components/ui/` and can be edited freely. The `@shadcn-space` registry is preconfigured in `components.json` for dashboard blocks.

## Conventions

All coding conventions, library choices, and rules for AI coding assistants are documented in **[AGENTS.md](./AGENTS.md)** — the single source of truth for this repository.
