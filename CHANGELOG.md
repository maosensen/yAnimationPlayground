# Changelog

All notable changes to yAnimationPlayground are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); this project uses
[semantic versioning](https://semver.org/).

Versions 0.1.0 through 0.1.4 record the inherited yTemplate baseline that the
playground keeps as its UI and engineering foundation.

## [Unreleased]

## [0.6.0] - 2026-08-09

### Added

- **Runtime-neutral motion language** — shared duration, easing, spring,
  stagger, distance, choreography, and reduced-motion contracts now serve CSS,
  Motion for React, and frame-based video without importing a runtime.
- **Composition-first Motion Kit** — granular policy, transition, reveal,
  stagger, and press-feedback exports provide semantic variants while keeping
  React and Motion as peer dependencies.
- **Motion system workbench** — a Chinese operator page exposes token scales,
  preference simulation, entrance replay, interruption stress testing, and the
  rules that determine what belongs in the system.
- **Motion contract gate** — runtime invariant tests and a compiled public
  consumer fixture now run inside the repository's aggregate check.

### Changed

- **Proven multi-runtime consumption** — the existing Motion interaction probe,
  Remotion compositions, and global CSS now consume the shared contracts, with
  the Motion runtime remaining isolated from routes that do not use it.
- **Remotion timing adapter** — scene fades and entrance easing now convert the
  same millisecond and bezier tokens used by browser animation into deterministic
  frame behavior.

## [0.5.0] - 2026-08-09

### Added

- **Shared video production contract** — one validated 36-second brief now
  defines formats, frame rate, scene timing, safe areas, typography, captions,
  deterministic audio, and output names for both renderers.
- **Remotion render pipeline** — typed frame-driven React compositions provide
  local Studio preview plus reproducible 1920×1080 and 1080×1920 renders.
- **HyperFrames render pipeline** — two valid single-root HTML projects use a
  seekable GSAP timeline, Studio preview, runtime checks, and local MP4 output.
- **Living Signals reference film** — both renderers produce comparable
  36-second landscape and portrait films with H.264 video and AAC audio.
- **Code-video production guide** — a Chinese operator page and detailed
  documentation explain the workflow, commands, evidence, system boundaries,
  and the Remotion-versus-HyperFrames decision.

### Fixed

- **Lottie playback is visibly animated** — each player now receives an
  isolated copy of its animation data, and the sample asset uses complete
  keyframes with an unmistakable orbit indicator and pulse.
- **Simplified Chinese typography** — Chinese interface copy now uses an
  explicit Simplified Chinese font fallback and `zh-CN` document language, so
  Latin font preferences no longer produce inconsistent Japanese-style glyphs.

## [0.4.0] - 2026-08-09

### Added

- **D3 data-geometry reference** — use focused D3 modules for scales, ticks,
  line and area geometry while React owns SVG elements and Motion owns state
  transitions.
- **Lottie delivery reference** — inspect route-scoped Lottie Light loading,
  segment playback, progress control, asset size, cleanup, and authored-theme
  boundaries through a local vector asset.
- **Rive state-machine reference** — drive an official interactive `.riv`
  asset through a named Trigger input, Canvas Lite runtime, playback controls,
  reduced motion, and an explicit network fallback.
- **Canvas frame-budget reference** — compare 120, 360, and 720 deterministic
  particles with pointer response, DPR capping, resize handling, low-frequency
  telemetry, and complete rAF cleanup.
- **Living Data Story** — combine D3 geometry, Motion transitions, Canvas
  atmosphere, and a Lottie cue under one React-owned filter and emphasis model.
- **Visual runtime decision guide** — map CSS/SVG, Motion, GSAP, D3, Lottie,
  Rive, Canvas, Remotion, and HyperFrames by state ownership, asset workflow,
  accessibility, performance, and product fit.

### Changed

- **Chinese operator guidance** — user-facing controls, parameter descriptions,
  technical explanations, summaries, and experiment notes now use Simplified
  Chinese while animation-internal narrative copy may remain English.

## [0.3.0] - 2026-08-09

### Added

- **Comparative interaction-motion suite** — run one polished 7.2-second
  product story through native CSS + SVG, Motion, and GSAP with the same
  playback controls, viewports, and reduced-motion behavior.
- **Native CSS + SVG reference** — study transitions, keyframes, path drawing,
  gradients, masks, and state feedback with no animation runtime dependency.
- **Motion interaction reference** — explore React-owned gestures, shared
  layout, presence, springs, interruption, and scoped sequencing.
- **GSAP choreography reference** — inspect labeled timeline phases, stagger,
  precise seeking, reversing, and coordinated DOM + SVG animation from a
  route-scoped lazy chunk.
- **Interaction runtime decision guide** — follow a practical escalation path
  from native browser motion to Motion or GSAP, backed by a capability and
  route-output comparison matrix.
- **Versioned product roadmap** — defined capability-driven milestones from
  v0.3 through v1.0, with flagship work, exit criteria, and an evidence format
  for completed experiments.

## [0.2.0] - 2026-08-09

### Added

- **Animation monorepo foundation** — moved the complete Next.js + shadcn
  application into `apps/web` and established a pnpm workspace that can grow
  without forcing every animation runtime into one browser bundle.
- **Seven browser labs** — added dedicated routes for CSS + SVG, GSAP, Motion,
  D3, Lottie, Rive, and Canvas, with a shared overview for comparing their
  intended roles before installing heavier dependencies.
- **Purpose-built workspace boundaries** — reserved isolated Remotion and
  HyperFrames applications, plus shared packages for design tokens, motion
  tokens, reusable motion primitives, and source assets.

### Changed

- **Default port 4394** — `pnpm dev` and `pnpm start` now bind to port 4394,
  with the local site URL default and setup documentation aligned.
- **Canonical project identity** — standardized the visible
  `yAnimationPlayground` wordmark, package descriptions, persisted-settings
  namespace, repository metadata, and contributor documentation.

## [0.1.4] - 2026-08-06

### Added

- **Design-language checklist** — `docs/design-checklist.md`, a
  section-by-section checklist (layout, async boundaries, feedback, forms,
  tables, dashboard, icons, typography, status colors, interactions,
  overlays, page templates, data-layer conventions, quality gates) used to
  review, ratify, and demo every design decision before it is written into
  AGENTS.md as a rule.

### Changed

- **Next.js 16.3** — upgraded the framework to 16.3.0: dev sessions use up
  to 90% less memory, repeat production builds read unchanged artifacts from
  cache, and server-side rendering handles up to ~22% more load.
- **Default port 3005** — `pnpm dev` and `pnpm start` now bind to port 3005
  out of the box, so the template no longer collides with other apps on
  port 3000.

## [0.1.3] - 2026-07-28

### Added

- **Unified header icon row** — the system header's icon cluster now matches
  the sibling y-series apps: one Solar family at one weight (bold-duotone),
  a palette glyph opening the theming drawer, GitHub / X profile links, and
  a language panel (presentation-only until i18n lands). Glyphs ride the
  muted foreground, so they stay soft in light mode and legible on the dark
  nav panel.
- **Feature ledger** — `.roadmap/features.yaml` tracks every shipped and
  planned capability (schema v1), maintained in the same commit as the work
  it records and collected by yPulse.

### Changed

- **Slotted `PageHeader`** — the old `AppHeader` is replaced by a
  `PageHeader` ported from yBlocks, with `icon`, `titleSuffix`, `toolbar` /
  `inlineToolbar`, and `tabs` slots; page bands are sticky by default,
  offset by the app header's measured height.
- **Settings drawer rebuilt** — one selected treatment across every picker,
  named options and described switches, mono section eyebrows, layout / nav
  tiles that preview each other's setting, a font list that previews each
  typeface, and a Reset footer that counts what differs from the defaults.

## [0.1.2] - 2026-07-16

### Added

- **Dashboard Customize toolbar** — show/hide each home-dashboard widget with
  a reset to the default arrangement; the board re-initializes cleanly on the
  visible set.
- **Reusable `<GridBoard>`** — a shared grid-board component and `useGridBoard`
  hook (ported from yBlocks) consolidating grid behavior, chrome, and CSS in
  one place.

### Changed

- **Unified GridStack chrome** — themeable corner-grip resize handle, standard
  Card surface on the demo widgets, and the top-right drag-grip icon removed.

## [0.1.1] - 2026-07-13

### Added

- **Validated environment variables** — a zod schema in `apps/web/src/lib/env.ts` is now
  the single source for env vars (server / client / shared split, fail-fast at
  build and dev startup, guard against reading server-only vars on the client),
  with a tracked `.env.example`.
- **CI gate** — a GitHub Actions workflow runs Biome, `tsc --noEmit`, and a
  production build on pushes to `main`/`dev` and on pull requests; new
  `pnpm check` aggregate script.
- **Error & status pages** — a shared `<StatusPage>` component powering a
  global 404, an in-shell 404, an in-shell error boundary with retry, a
  root-crash `global-error` fallback, and a route-group loading skeleton.

## [0.1.0] - 2026-07-10

First release — a themeable Next.js dashboard template.

### Added

- **Dashboard shell** — an app shell with vertical, mini-rail, and horizontal
  nav layouts, Priority+ overflow for the top bar, and a small-screen drawer.
- **Settings drawer** — live theme controls: light/dark/system, contrast,
  compact density, nav layout and color, color presets plus a custom brand
  color, radius steps, a font picker (Outfit by default), and a max-width
  toggle — persisted across reloads.
- **Token-driven theming** — card and overlay elevation, chart series, and
  borders all run on design tokens, so presets and contrast re-skin the whole
  app consistently.
- **Widgets & demos** — an analytics dashboard, line and bar chart pages, a
  drag-and-resize gridstack board, avatar fallbacks (solid / gradient), and a
  display-card gallery.
- **Solar icons** — Iconify-compiled Solar duotone glyphs across nav,
  settings, and headers.
- **Changelog page** — curated release notes on a timeline at `/changelog`,
  rendered from a typed changelog module.

[Unreleased]: https://github.com/maosensen/yAnimationPlayground/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.6.0
[0.5.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.5.0
[0.4.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.4.0
[0.3.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.3.0
[0.2.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.2.0
[0.1.4]: https://github.com/maosensen/yTemplate/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/maosensen/yTemplate/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/maosensen/yTemplate/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/maosensen/yTemplate/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/maosensen/yTemplate/releases/tag/v0.1.0
