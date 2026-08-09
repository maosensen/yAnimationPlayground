# Product roadmap

yAnimationPlayground is an R&D platform for proving animation techniques before
they become production tools. Versions are organized around capabilities and
evidence, not around installing libraries.

The current release is **v0.4.0**, which established the data and visual-runtime
comparison suite. The next active milestone is **v0.5.0**.

## Planning model

The roadmap has three levels:

1. This document defines version themes, scope, flagship work, and exit criteria.
2. `.roadmap/features.yaml` tracks the status of each announceable capability.
3. `notes/` records the evidence and conclusions from individual experiments.

A version is complete only when it produces all of the following:

- A coherent capability a user can see, run, or render.
- One polished flagship work that combines the version's experiments.
- Comparable evidence: authoring cost, runtime cost, accessibility, and failure modes.
- A written decision explaining when to use each evaluated technique.
- Responsive and reduced-motion behavior where the medium supports it.
- Passing repository gates and browser or rendered-output verification.

Dependencies are added only to the workspace that consumes them. Reusable code
moves into `packages/` only after a second real consumer proves the contract.

## Release map

| Version | Status | Capability outcome |
|---|---|---|
| v0.2.0 | Shipped | Monorepo foundation and isolated experiment boundaries |
| v0.3.0 | Shipped | Interaction motion foundations across native CSS/SVG, Motion, and GSAP |
| v0.4.0 | Shipped | Data, vector-runtime, and immediate-mode visual animation |
| v0.5.0 | Next | Repeatable code-driven video pipelines with Remotion and HyperFrames |
| v0.6.0 | Direction | A reusable motion design system with stable tokens and primitives |
| v0.7.0 | Direction | An AI-assisted brief-to-animation production workflow |
| v0.8.0 | Direction | Versioned packages and cross-repository consumption |
| v1.0.0 | Direction | A validated animation R&D platform ready to feed dedicated studios |

Milestones are evidence-driven and intentionally have no fixed dates. Later
versions may be reordered when an earlier experiment changes the technical
direction.

## v0.3.0 — Interaction motion foundations

### Core question

Where should native CSS/SVG stop, where does Motion provide the best React
abstraction, and when does GSAP's explicit timeline control justify its cost?

### Capabilities

- A shared comparison harness with the same stage, controls, viewport presets,
  reduced-motion switch, and lightweight diagnostics across labs.
- A native CSS/SVG baseline covering transitions, keyframes, transforms,
  stroke/path techniques, masks, and state-driven composition.
- A Motion lab covering gestures, enter/exit, layout transitions, shared
  elements, interruption, and React state integration.
- A GSAP lab covering timeline choreography, labels, stagger, seeking,
  reversible sequences, and SVG orchestration.
- A decision guide comparing control model, bundle impact, authoring speed,
  composability, accessibility, and debugging behavior.

### Flagship work

Build one polished multi-stage product story in three implementations: native
CSS/SVG, Motion, and GSAP. The visual result and interaction contract stay the
same so the comparison measures implementation trade-offs rather than design
differences.

### Exit criteria

- All three implementations support replay, pause, seek where applicable, and
  reduced motion.
- Measurements and authoring notes use the shared experiment-note format.
- The decision guide names a default, an escalation path, and explicit
  anti-use-cases for each runtime.
- No runtime is loaded outside the route that demonstrates it.

### Out of scope

Scroll-driven marketing pages, 3D rendering, and video export remain outside
this milestone unless they are needed to answer the core comparison question.

## v0.4.0 — Data and visual runtimes

### Core question

How should data transformation, authored vector animation, interactive state
machines, and high-density drawing cooperate without assigning one tool every
responsibility?

### Capabilities

- A D3 lab focused on scales, geometry, data joins, interpolation inputs, and
  handing rendered elements to the appropriate motion runtime.
- A Lottie lab covering delivery, segments, playback control, responsiveness,
  theming limits, and asset-size trade-offs.
- A Rive lab covering state-machine inputs, interaction, responsive artboards,
  and runtime ownership.
- A Canvas lab covering frame budgets, particles, pointer interaction, resize
  behavior, device-pixel ratio, and cleanup.
- A visual-runtime decision guide covering accessibility fallbacks, authoring
  workflow, asset ownership, performance, and product fit.

### Flagship work

Create **Living Data Story**, an interactive narrative that changes time range,
filter, and emphasis while using the right runtime per layer. It should show
hybrid composition rather than forcing the whole experience through one tool.

### Exit criteria

- Every runtime has a keyboard-accessible or semantic fallback where needed.
- Frame-time and asset-size observations are captured on agreed reference
  viewports.
- The flagship work remains responsive and usable with reduced motion enabled.
- The final note states which responsibilities belong to D3, a motion runtime,
  an authored vector asset, or Canvas.

### Out of scope

WebGL engines, production charting replacements, and a general-purpose visual
editor are not part of this milestone.

## v0.5.0 — Code-driven video production

### Core question

What repeatable contracts let the same design language, assets, and motion
decisions produce deterministic video without turning the playground into a
studio application?

### Capabilities

- A runnable Remotion workspace with deterministic compositions, typed props,
  local preview, and reproducible rendering.
- A runnable HyperFrames workspace with an equivalent brief and documented
  rendering workflow.
- Shared production contracts for aspect ratio, frame rate, duration, safe
  areas, typography, assets, audio, and captions.
- Comparable 16:9 and 9:16 outputs generated from one product-story brief.
- A decision guide covering iteration speed, rendering model, portability,
  integration surface, and operational constraints.

### Flagship work

Produce a polished 30–60 second product narrative and its vertical adaptation.
Use the same storyboard and asset manifest for both renderer investigations so
the resulting comparison remains meaningful.

### Exit criteria

- A clean checkout can install, preview, render, and locate the outputs using
  documented commands.
- Renders are deterministic for identical inputs.
- Shared tokens and source assets are consumed across at least two workspaces
  before their package contracts are declared stable.
- Output files are inspected for dimensions, duration, frame rate, audio, and
  visual correctness.

### Out of scope

Cloud render orchestration, collaborative editing, a nonlinear timeline UI,
and production asset management belong to future dedicated studio repositories.

## v0.6.0–v1.0.0 — Directional milestones

### v0.6.0 — Motion design system

Promote proven duration, easing, stagger, choreography, interruption, and
reduced-motion decisions into `motion-tokens` and `motion-kit`. The milestone
ends with stable consumer APIs, examples, and contract tests rather than a
large catalogue of speculative abstractions.

### v0.7.0 — AI-assisted production pipeline

Define a reviewable pipeline from creative brief to storyboard, asset manifest,
implementation scaffold, and QA report. AI output must remain structured,
reproducible, and human-editable; the milestone evaluates workflow leverage,
not autonomous generation as an end in itself.

### v0.8.0 — Cross-repository distribution

Make the proven token, primitive, and asset contracts consumable by independent
studio and SaaS repositories. Add versioning, compatibility policy, package
tests, and at least one external consumer before declaring the distribution
model complete.

### v1.0.0 — Validated R&D platform

Graduate the playground when its lab protocol, reference works, decision
guides, shared packages, and studio handoff contracts are coherent and stable.
Version 1.0 does not mean the playground becomes a full editor; it means it can
reliably answer technical choices and transfer proven foundations to one.

## Studio boundary

This repository owns experiments, evidence, reference works, reusable
contracts, and handoff documentation. A productized studio owns editing UX,
project persistence, collaboration, cloud rendering, billing, and its own
release lifecycle. Studios therefore live in separate repositories and consume
only versioned outputs that have survived this playground's extraction rule.

## Change policy

- Starting implementation moves the corresponding ledger item from `todo` to
  `doing`; completing it records `completedAt` in the same commit.
- Releases backfill `shippedIn` and reconcile the CHANGELOG against the ledger.
- Scope may move between unreleased milestones, but permanent feature IDs are
  never renamed or reused.
- A library installation, isolated API demo, or unfinished study is not enough
  to close a milestone.
