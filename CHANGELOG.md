# Changelog

All notable changes to yAnimationPlayground are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/); this project uses
[semantic versioning](https://semver.org/).

Versions 0.1.0 through 0.1.4 record the inherited yTemplate baseline that the
playground keeps as its UI and engineering foundation.

## [Unreleased]

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

[Unreleased]: https://github.com/maosensen/yAnimationPlayground/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/maosensen/yAnimationPlayground/releases/tag/v0.2.0
[0.1.4]: https://github.com/maosensen/yTemplate/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/maosensen/yTemplate/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/maosensen/yTemplate/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/maosensen/yTemplate/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/maosensen/yTemplate/releases/tag/v0.1.0
