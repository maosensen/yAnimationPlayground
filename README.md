# yAnimationPlayground

English | [简体中文](./README.zh-CN.md)

yAnimationPlayground is a pnpm monorepo for learning browser animation and
code-driven video through small, comparable experiments. It keeps a production-quality Next.js +
shadcn/ui shell for interactive labs while isolating video renderers and future
shared motion packages.

## What is included

- **Web labs** — routes for CSS + SVG, GSAP, Motion, D3, Lottie, Rive, Canvas, and Three.js
- **Production-ready shell** — Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, and React Compiler
- **Theme system preserved** — runtime presets, custom brand color, neutral families, contrast, elevation, navigation, radius, and fonts
- **Code-video pipelines** — runnable Remotion and HyperFrames workspaces with landscape and portrait reference films
- **AI-assisted production** — a provider-neutral brief-to-storyboard compiler with review gates, semantic QA, provenance, and a Remotion proof
- **Shared foundations** — explicit packages for design tokens, motion tokens, motion primitives, assets, and video production contracts
- **Engineering gates** — pnpm workspaces, Biome, TypeScript, environment validation, and CI

## Roadmap

Development is organized around capability outcomes rather than a checklist of
libraries. v0.3 focuses on comparable interaction-motion experiments, v0.4 on
data and visual runtimes, v0.5 on repeatable code-driven video pipelines, and
v0.8 on spatial/WebGL animation with Three.js. Later milestones turn proven
results into shared packages without turning this repository into a productized studio.

See [docs/roadmap.md](./docs/roadmap.md) for version scope, flagship work, exit
criteria, and the boundary between this playground and future studio repositories.

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
| `pnpm pipeline:generate` | Compile the reviewed Signal Atlas source into tracked production artifacts |
| `pnpm pipeline:check` | Validate schema, semantic QA, and generated-artifact drift |
| `pnpm pipeline:inspect` | Inspect the rendered v0.7 Remotion proof |
| `pnpm three:inspect` | Verify the built Three.js chunk remains isolated to its lab route |
| `pnpm video:prepare` | Validate and synchronize shared video inputs |
| `pnpm video:check` | Check both renderer workspaces |
| `pnpm video:render` | Render all landscape and portrait reference outputs |
| `pnpm video:inspect` | Verify output dimensions, duration, frame rate, and audio |

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
│       ├── canvas/
│       ├── threejs/
│       ├── code-video/
│       └── ai-pipeline/
├── remotion/                  # isolated React video workspace
└── hyperframes/               # isolated HTML-to-video workspace
packages/
├── design-tokens/             # color, typography, spacing, elevation
├── motion-tokens/             # duration, easing, stagger, rhythm
├── motion-kit/                # reusable animation primitives
├── animation-pipeline/        # AI-facing schemas, compiler, QA, and reference bundle
├── assets/                    # shared source assets and fixtures
└── video-contract/            # shared brief and render production contract
notes/                         # findings from completed experiments
```

The full shadcn component set and the working theme implementation remain in
`apps/web/src/`. Shared packages start deliberately small: a contract is
extracted only after a second real consumer proves it.

See [docs/code-video-production.md](./docs/code-video-production.md) for the
v0.5 workflow, renderer comparison, commands, and verified output contract.
See [docs/ai-assisted-production.md](./docs/ai-assisted-production.md) for the
v0.7 structured AI boundary, review stages, deterministic compiler, and QA policy.
See [docs/threejs-spatial-animation.md](./docs/threejs-spatial-animation.md) for
the v0.8 scene lifecycle, performance controls, accessibility boundary, and
Canvas-versus-Three.js decision.

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
