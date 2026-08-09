/**
 * Minimal sRGB → OKLCH conversion + custom-theme derivation for the settings
 * panel's "custom" preset.
 *
 * The stock presets pin the chart ladder to fixed lightness steps at the
 * preset's hue (see `[data-preset="…"]` in `globals.css`); a custom pick
 * follows the same recipe so charts stay harmonized regardless of how light
 * or dark the chosen brand color is.
 */

type Oklch = { l: number; c: number; h: number };

const srgbToLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;

export function hexToOklch(hex: string): Oklch | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  const r = srgbToLinear(((n >> 16) & 0xff) / 255);
  const g = srgbToLinear(((n >> 8) & 0xff) / 255);
  const b = srgbToLinear((n & 0xff) / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m_ - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m_ + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m_ - 0.808675766 * s;

  const c = Math.hypot(a, bb);
  const h = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

const fmt = (l: number, c: number, h: number) =>
  `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;

/**
 * Derives the full set of brand CSS variables from a picked hex color.
 * Returned vars are applied as inline styles on `<html>` (which win over the
 * `[data-preset]` stylesheet blocks) and persisted verbatim so the
 * FOUC-blocking script can re-apply them without color math.
 */
export function buildCustomVars(hex: string): Record<string, string> | null {
  const oklch = hexToOklch(hex);
  if (!oklch) return null;
  const { l, c, h } = oklch;

  const primary = fmt(l, c, h);
  // White-ish foreground on mid/dark brands, near-black on very light picks.
  const primaryFg =
    l > 0.75 ? fmt(0.2, Math.min(c, 0.02), h) : fmt(0.97, 0.014, h);

  return {
    "--primary": primary,
    "--primary-foreground": primaryFg,
    "--sidebar-primary": primary,
    "--sidebar-primary-foreground": primaryFg,
    // Same lightness ladder / chroma ratios as the stock presets.
    "--chart-1": fmt(0.797, c * 0.5, h),
    "--chart-2": fmt(0.617, c, h),
    "--chart-3": fmt(0.547, c, h),
    "--chart-4": fmt(0.477, c * 0.95, h),
    "--chart-5": fmt(0.407, c * 0.85, h),
  };
}

/** Variable names managed by the custom preset; cleared when leaving it. */
export const CUSTOM_VAR_KEYS = [
  "--primary",
  "--primary-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];
