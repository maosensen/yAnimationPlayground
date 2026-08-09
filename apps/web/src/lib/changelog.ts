/**
 * User-facing changelog — curated, categorized release highlights rendered by
 * the /changelog page, distinct from the developer CHANGELOG.md (which tracks
 * every change for the GitHub release notes).
 *
 * Keep this in sync on release: add one entry per shipped version. Every
 * release needs a headline `title` (plus an optional `summary`); changes
 * usually carry a short row `title` too — and the `text` should not start
 * with that title, or the rendered row reads twice.
 */

/** Change category — drives the colored tag on each row. */
export type ChangeKind = "new" | "improved" | "fixed";

export type ChangelogChange = {
  kind: ChangeKind;
  /** One-sentence description of the change. */
  text: string;
  /** Short feature name shown as the row heading. */
  title?: string;
};

export type ChangelogRelease = {
  version: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Curated, user-facing changes for this release. */
  changes: ChangelogChange[];
  /** Release headline (e.g. "Hello, dashboard"). */
  title: string;
  /** Optional one-paragraph framing shown under the headline. */
  summary?: string;
};

/** Newest first. */
export const changelog: ChangelogRelease[] = [
  {
    version: "0.2.0",
    date: "2026-08-09",
    title: "A playground with room to grow",
    summary:
      "yAnimationPlayground is now a focused monorepo: browser techniques stay easy to compare, while video renderers and reusable motion foundations get clean boundaries of their own.",
    changes: [
      {
        kind: "new",
        title: "Animation lab catalog",
        text: "Seven focused browser labs map out CSS + SVG, GSAP, Motion, D3, Lottie, Rive, and Canvas without loading every runtime up front.",
      },
      {
        kind: "new",
        title: "Purpose-built workspaces",
        text: "Remotion and HyperFrames have isolated application boundaries, alongside shared packages for tokens, motion primitives, and source assets.",
      },
      {
        kind: "improved",
        title: "Project identity",
        text: "The product name, wordmark, package metadata, repository details, and persisted settings namespace now consistently use yAnimationPlayground.",
      },
      {
        kind: "improved",
        title: "Local development",
        text: "Development and production preview servers now use port 4394 by default.",
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-08-06",
    title: "A quick tune-up",
    summary:
      "A housekeeping release — the framework moves to Next.js 16.3, local servers get a port of their own, and design decisions get a ratification checklist.",
    changes: [
      {
        kind: "improved",
        title: "Next.js 16.3",
        text: "The framework is upgraded to 16.3.0 — dev sessions use up to 90% less memory, repeat production builds reuse unchanged artifacts from cache, and server rendering handles up to ~22% more load.",
      },
      {
        kind: "improved",
        title: "Default port 3005",
        text: "Local dev and production servers now start on port 3005 out of the box, clear of other apps parked on port 3000.",
      },
      {
        kind: "new",
        title: "Design-language checklist",
        text: "A section-by-section checklist for reviewing, ratifying, and demoing every design decision before it becomes a house rule.",
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-07-28",
    title: "One chrome across the y-series",
    summary:
      "The header icon row, page headers, and settings drawer are brought in line with the sibling y-series apps — plus a feature ledger that keeps the roadmap honest.",
    changes: [
      {
        kind: "new",
        title: "Header icon row",
        text: "One icon family at one weight across the system header — theming, language, and GitHub / X links — legible on both the light header and the dark nav panel.",
      },
      {
        kind: "improved",
        title: "Page headers",
        text: "Every page band now runs on a slotted PageHeader with icon, toolbar, and tab slots, and stays pinned under the app header as you scroll.",
      },
      {
        kind: "improved",
        title: "Settings drawer",
        text: "Rebuilt with one selected treatment across every picker, options that preview themselves, and a Reset footer that counts what differs from the defaults.",
      },
      {
        kind: "new",
        title: "Feature ledger",
        text: "A machine-readable roadmap file tracks every shipped and planned capability right alongside the code.",
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-07-16",
    title: "Make the board yours",
    summary:
      "The dashboard grid gains a Customize toolbar and cleaner, unified chrome — powered by a reusable grid board under the hood.",
    changes: [
      {
        kind: "new",
        title: "Customize toolbar",
        text: "Show or hide each dashboard widget and reset the board back to its default arrangement.",
      },
      {
        kind: "improved",
        title: "Grid chrome",
        text: "A themeable corner resize grip, standard card surfaces on grid widgets, and no more drag icon cluttering the top-right corner.",
      },
      {
        kind: "improved",
        title: "Grid board internals",
        text: "All grid behavior now runs through one reusable board component, so every grid page shares the same look and feel.",
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-07-13",
    title: "Hardening the foundations",
    summary:
      "A groundwork release — validated configuration, a CI gate on every change, and polished error states across the app.",
    changes: [
      {
        kind: "new",
        title: "Status pages",
        text: "Consistent 404 pages inside and outside the shell, an error screen with one-click retry, and a loading skeleton while pages stream in.",
      },
      {
        kind: "new",
        title: "Validated env vars",
        text: "Environment variables are checked against a zod schema at startup, so a bad config fails the build instead of surfacing at runtime.",
      },
      {
        kind: "new",
        title: "CI gate",
        text: "Every push and pull request now runs lint, type checks, and a production build on GitHub Actions.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-10",
    title: "Hello, dashboard",
    summary:
      "The first cut of the template — a themeable Next.js dashboard shell with a live settings drawer, ready to build on.",
    changes: [
      {
        kind: "new",
        title: "Dashboard shell",
        text: "An app shell with vertical, mini-rail, and horizontal nav layouts, Priority+ overflow for the top bar, and a small-screen drawer.",
      },
      {
        kind: "new",
        title: "Settings drawer",
        text: "Live theme controls — light/dark/system, contrast, compact density, nav layout and color, color presets plus a custom brand color, radius steps, a font picker (Outfit by default), and a max-width toggle — persisted across reloads.",
      },
      {
        kind: "new",
        title: "Token-driven theming",
        text: "Card and overlay elevation, chart series, and borders all run on design tokens, so presets and contrast re-skin the whole app consistently.",
      },
      {
        kind: "new",
        title: "Widgets & demos",
        text: "An analytics dashboard, line and bar chart pages, a drag-and-resize gridstack board, avatar fallbacks, and a display-card gallery.",
      },
      {
        kind: "new",
        title: "Solar icons",
        text: "Iconify-compiled Solar duotone glyphs across nav, settings, and headers.",
      },
      {
        kind: "new",
        title: "This page",
        text: "Curated release notes on a timeline, rendered from a typed changelog module.",
      },
    ],
  },
];
