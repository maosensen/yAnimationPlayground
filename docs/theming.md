# Theming architecture

Reference for the theme/settings system. The **rules** new code must follow
live in [AGENTS.md](../AGENTS.md); this document explains the machinery behind
them. Single CSS source: `src/app/globals.css`.

## Token pipeline (three layers)

```
raw values            semantic variables          utilities
:root / .dark    →    --primary, --card-ring, …   →   @theme inline → bg-primary, …
[data-*] blocks       (overridden by settings)        components consume ONLY these
```

Components never see raw colors. Settings never touch components. Everything
meets in the middle at the semantic variables, which is why every setting is
a few lines of CSS instead of component logic.

## Settings system

State lives in a zustand store (`src/lib/stores/settings-store.ts`), persisted
to localStorage under `ytemplate-settings` (versioned, with `migrate`).
Two consumers reflect it onto `<html>`:

| Reflector | File | When |
|---|---|---|
| `SettingsScript` | `src/components/settings/settings-script.tsx` | Blocking inline script, **before first paint** (FOUC prevention) |
| `SettingsEffect` | `src/components/settings/settings-effect.tsx` | React effect, keeps `<html>` in sync after hydration |

**These two must stay mirrored.** Any new setting applied in the effect but
not the script will flash the default on every load; any migration added to
the store but not the script will flash the pre-migration value.

What lands on `<html>`:

| Setting | Mechanism | CSS hook |
|---|---|---|
| preset | `data-preset` | `[data-preset="…"]` blocks |
| custom brand color | inline vars (precomputed) | wins over `[data-preset]` by inline precedence |
| neutral family | `data-neutral` | `[data-neutral="…"]` blocks |
| contrast | `data-contrast` | `[data-contrast="high"]` blocks |
| compact | `data-compact` | `--spacing` override |
| max width | `data-max-width` | boxes `<PageContainer>` (`@/components/page-container`) at 7xl, centered; nav chrome unaffected |
| nav color | `data-nav` | `[data-nav="…"]` blocks |
| nav layout | `data-layout` + React (`AppShell`) | structural; the FOUC guard hides a shell whose `data-shell` tag disagrees with `data-layout` until hydration (SSR always emits the vertical shell) |
| radius | inline `--radius` | `@theme inline` radius scale derives from it |
| font family / size | inline `--font-sans` / `--font-size-base` | `html { font-size: … }` |
| light/dark mode | `next-themes` (`class` + localStorage `theme`) | `.dark` blocks — *not* part of the store |

### Checklist: adding a new setting

1. `src/lib/settings/config.ts` — type, options constant, `DEFAULT_SETTINGS` entry
2. `settings-store.ts` — setter (+ version bump & `migrate` only if changing the *meaning* of an existing persisted value; new keys merge in via defaults)
3. `settings-effect.tsx` — reflect onto `<html>`
4. `settings-script.tsx` — mirror the reflection (and any migration) in the inline script
5. `settings-drawer.tsx` — UI + add to the `isDirty` comparison
6. `globals.css` — the `[data-*]` block or var the setting drives

## Color system

### Brand presets

`[data-preset="…"]` blocks swap `--primary` / `--sidebar-primary` and the
chart ladder. The ladder walks **fixed lightness steps at the preset's hue**
(chart-1 ≈ L 0.797 at half chroma → chart-5 ≈ L 0.407), so multi-series
charts stay harmonized across presets.

The **custom** preset derives the same shape at runtime:
`src/lib/settings/color.ts` converts the picked hex to OKLCH and builds the 9
brand vars. They are **precomputed at pick time and persisted verbatim** so
the FOUC script can replay them without color math. Because they're applied
as inline styles (which beat any stylesheet block), `SettingsEffect` must
*remove* them when a stock preset is re-selected — see `CUSTOM_VAR_KEYS`.

### Neutral families ("base color")

Every grey-bearing token is parameterized:

```css
--muted-foreground: oklch(0.552 calc(0.016 * var(--neutral-tint)) var(--neutral-hue));
```

`--neutral-hue` + `--neutral-tint` (a chroma multiplier; zinc = 1) are the
only things a `[data-neutral="…"]` block sets, and the whole UI
re-temperatures — light and dark, including borders and the contrast tint.

**Rule:** any new token that encodes a grey must use the parameterized form,
or it won't follow the base-color setting.

### Borders

Light-mode hairlines are translucent neutral grey (≈ `#919EAB` @ 20%), not a
solid step of the palette — they blend over any surface. Contrast mode bumps
the alpha, dark mode uses white-alpha.

## Elevation system

shadcn has no elevation tokens; this repo defines two **semantic pairs**, and
surfaces fall into exactly two classes:

| Class | Tokens | Behavior |
|---|---|---|
| **Static** (sits in the page: `Card`) | `--shadow-card` / `--card-ring` | Light mode: soft two-layer shadow, transparent ring. Contrast on **or** dark mode: flat + hairline ring. Elevation is *coupled to contrast* — the tinted background already separates surfaces, so shadow and border never double up. |
| **Overlay** (floats above the page: `Sheet`) | `--shadow-overlay` / `--overlay-border` | Shadow **always** (independent of contrast — overlays are above every background). Border only returns in dark mode, where shadows read as void. |

Both shadow recipes are tinted with the neutral family
(`--neutral-hue`/`--neutral-tint`), so elevation follows the base color.

Notes:

- Dropdown / Popover / Select / Dialog already ship a clean
  `shadow-2xl + ring-foreground/5` hybrid upstream — left as is.
- Components opt out with `shadow-none` / `ring-0` (e.g. the sidebar promo
  card); `cn()`/tailwind-merge resolves the conflict correctly.
- **Flat states must be `0 0 #0000`, never `none`**: `ring-*` and `shadow-*`
  utilities compose into one `box-shadow` list, and a `none` entry
  invalidates the whole declaration.

## Nav surfaces

The vertical sidebar **and** the horizontal top bar consume the `--sidebar-*`
token family (`bg-sidebar text-sidebar-foreground border-sidebar-border`), so
the nav-color setting needs no per-layout logic:

- `integrate` → `--sidebar: var(--background)` (blends into the page)
- `apparent` → dark navy panel in light mode; dark mode's lifted card surface
  already reads as "apparent"

Generic components embedded in a dark nav surface would flash light-grey
`--accent` hovers; the surface carries `data-surface="nav"` and a scoped rule
re-points `--accent` to the sidebar palette inside it. Portaled content
(dropdowns) is outside the scope and keeps popover styling. Reuse this
pattern for any future component hosted on a dark surface.

Anything inside the nav should inherit color (`currentColor`) rather than
hardcode `text-foreground` — that's how the logo and header icons adapt.

## Known pitfalls

- **Turbopack stale CSS (Next 16.2.x):** `globals.css` edits are sometimes
  served stale even across reloads and `lint`-clean builds. Verify via
  computed styles / CSSOM, and fix with: stop dev server → `rm -rf .next/dev`
  → restart.
- **Don't test dark mode by toggling the `dark` class manually** —
  `next-themes` fights the mutation; use the Mode control (or
  `localStorage.theme` + reload).
- Recharts entry animations freeze at frame 0 in hidden/background tabs
  (rAF throttling) — blank charts in a preview tab are not a regression.
