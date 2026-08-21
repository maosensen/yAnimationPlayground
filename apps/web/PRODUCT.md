# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

yAnimationPlayground primarily serves a Chinese-speaking product engineer who uses the application to research, compare, debug, and review animation technologies and production methods.

## Product Purpose

The product turns animation research into runnable experiments, measurable evidence, and reusable decisions. Success means understanding where each runtime belongs, what it costs, and whether a workflow can repeatedly reach the required quality—not merely producing an isolated demo.

## Positioning

yAnimationPlayground is an evidence-oriented animation R&D workspace. It keeps browser animation labs, code-video renderers, production notes, and shared contracts inspectable without collapsing their runtime boundaries.

## Operating Context

- Browser experiments run in the Next.js application under `apps/web`.
- Remotion and HyperFrames remain isolated video workspaces.
- Experiment evidence and conclusions live in `notes/` and the feature ledger.
- Productized studios are developed in separate repositories after a workflow proves its value here.

## Capabilities and Constraints

- User-facing explanations, controls, diagnostics, principles, and conclusions use Simplified Chinese.
- Copy inside an animation may use English when the visual direction requires it.
- Heavy runtimes load only inside their owning route or renderer workspace.
- A reusable contract is extracted only after a second real consumer validates its API.
- Cross-repository package distribution is deliberately deferred until real studio consumers exist.

## Evidence on Hand

- Version themes and exit criteria: `docs/roadmap.md`
- Runtime and production guidance: `docs/` and `notes/`
- Runnable browser labs: `apps/web/src/app/(app)/labs/`
- Isolated video projects: `apps/remotion/` and `apps/hyperframes/`
- Current capability status: `.roadmap/features.yaml`

## Product Principles

1. Prefer measured evidence over library demos or marketing claims.
2. Keep runtime ownership and dependency boundaries explicit.
3. Treat a repeatable decision as the output of an experiment.
4. Separate generative speed from professional finish quality.
5. Preserve human review gates where aesthetic judgment cannot be automated reliably.
