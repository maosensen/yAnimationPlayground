# yAnimationPlayground

English | [简体中文](./README.zh-CN.md)

A pnpm monorepo for learning browser animation and code-driven video through
small, comparable experiments. It keeps a production-quality Next.js +
shadcn/ui shell for interactive labs while isolating video renderers and future
shared motion packages.

## What is included

- **Web labs** — routes for CSS + SVG, GSAP, Motion, D3, Lottie, Rive, and Canvas
- **Production-ready shell** — Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, and React Compiler
- **Theme system preserved** — runtime presets, custom brand color, neutral families, contrast, elevation, navigation, radius, and fonts
- **Renderer boundaries** — dedicated workspaces reserved for Remotion and HyperFrames
- **Shared foundations** — explicit packages for design tokens, motion tokens, motion primitives, and assets
- **Engineering gates** — pnpm workspaces, Biome, TypeScript, environment validation, and CI

## Getting started

Requires **Node.js >= 22** and **pnpm 10.x**.

```sh
pnpm install
pnpm dev
```

Open [http://localhost:4394](http://localhost:4394).

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js web workspace with Turbopack |
| `pnpm build` | Build the web workspace for production |
| `pnpm start` | Run the production web build |
| `pnpm check` | Run the repository lint and type-check gate |
| `pnpm check-types` | Run every supported workspace type check |
| `pnpm lint` | Run Biome across the monorepo |
| `pnpm lint:fix` | Apply safe Biome fixes |
| `pnpm format` | Format supported files |

## Repository structure

```text
apps/
├── web/                       # Next.js + shadcn interactive playground
│   └── src/app/(app)/labs/
│       ├── css-svg/
│       ├── gsap/
│       ├── motion/
│       ├── d3/
│       ├── lottie/
│       ├── rive/
│       └── canvas/
├── remotion/                  # isolated React video workspace
└── hyperframes/               # isolated HTML-to-video workspace
packages/
├── design-tokens/             # color, typography, spacing, elevation
├── motion-tokens/             # duration, easing, stagger, rhythm
├── motion-kit/                # reusable animation primitives
└── assets/                    # shared source assets and fixtures
notes/                         # findings from completed experiments
```

The full shadcn component set and the working theme implementation remain in
`apps/web/src/`. Shared packages start deliberately small: a contract is
extracted only after a second real consumer proves it.

## Adding UI components

```sh
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

Generated components live in `apps/web/src/components/ui/` and are owned by
this repository. The `@shadcn-space` registry remains configured in
`apps/web/components.json`.

## Conventions

All coding conventions, library choices, workspace boundaries, and rules for
AI coding assistants live in [AGENTS.md](./AGENTS.md), the repository's single
source of truth.
