/**
 * Static configuration for the settings panel.
 *
 * Each "preset" / font / layout option here maps cleanly onto a CSS variable
 * or a `data-*` attribute on `<html>`; the reflect effect
 * (`@/components/settings/settings-effect`) is what actually applies them.
 */

export type NavLayout = "vertical" | "horizontal" | "mini";
export type NavColor = "integrate" | "apparent";
export type Preset =
  | "blue"
  | "green"
  | "purple"
  | "indigo"
  | "orange"
  | "red"
  | "custom";
export type Neutral = "zinc" | "slate" | "gray" | "stone" | "neutral";
export type FontFamily =
  | "outfit"
  | "public-sans"
  | "inter"
  | "dm-sans"
  | "nunito";

/** Maps a font key to the CSS variable provided by `next/font` in the root layout. */
export const FONT_VAR_MAP: Record<FontFamily, string> = {
  outfit: "var(--font-outfit)",
  "public-sans": "var(--font-public-sans)",
  inter: "var(--font-inter)",
  "dm-sans": "var(--font-dm-sans)",
  nunito: "var(--font-nunito)",
};

export const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "outfit", label: "Outfit" },
  { value: "public-sans", label: "Public Sans" },
  { value: "inter", label: "Inter" },
  { value: "dm-sans", label: "DM Sans" },
  { value: "nunito", label: "Nunito Sans" },
];

/**
 * Preset swatch colors (for the settings UI only). The actual `--primary` /
 * chart scale lives in `globals.css` under `[data-preset="…"]`; this is just
 * the dot rendered in the picker, kept in sync by hue.
 */
export const PRESET_OPTIONS: {
  value: Exclude<Preset, "custom">;
  swatch: string;
}[] = [
  { value: "blue", swatch: "oklch(0.617 0.208 259.473)" },
  { value: "green", swatch: "oklch(0.62 0.17 152)" },
  { value: "purple", swatch: "oklch(0.617 0.22 303)" },
  { value: "indigo", swatch: "oklch(0.585 0.22 277)" },
  { value: "orange", swatch: "oklch(0.7 0.17 65)" },
  { value: "red", swatch: "oklch(0.62 0.23 25)" },
];

/**
 * Neutral ("base color") families, shadcn-create style. The grey-bearing
 * tokens in `globals.css` are parameterized by `--neutral-hue` /
 * `--neutral-tint` (a chroma multiplier relative to zinc), so one
 * `data-neutral` attribute re-temperatures the whole UI.
 */
export const NEUTRAL_OPTIONS: {
  value: Neutral;
  label: string;
  /** Mid-tone swatch for the picker dot (≈ the family's 400 shade). */
  swatch: string;
}[] = [
  { value: "zinc", label: "Zinc", swatch: "oklch(0.705 0.015 286)" },
  { value: "slate", label: "Slate", swatch: "oklch(0.704 0.04 257)" },
  { value: "gray", label: "Gray", swatch: "oklch(0.707 0.022 261)" },
  { value: "stone", label: "Stone", swatch: "oklch(0.709 0.01 56)" },
  { value: "neutral", label: "Neutral", swatch: "oklch(0.708 0 0)" },
];

/** Radius steps offered in the drawer; written to `--radius` as rem. */
export const RADIUS_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "None" },
  { value: 0.375, label: "Small" },
  { value: 0.625, label: "Default" },
  { value: 1, label: "Round" },
];

export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 20;

export type SettingsValues = {
  contrast: boolean;
  compact: boolean;
  /** Boxed content: main area caps at 7xl (80rem) and centers. Off = fluid. */
  maxWidth: boolean;
  navLayout: NavLayout;
  navColor: NavColor;
  preset: Preset;
  neutral: Neutral;
  /** `--radius` in rem. */
  radius: number;
  /** Picked brand color (hex) when `preset === "custom"`; null otherwise. */
  customHex: string | null;
  /**
   * CSS variables derived from `customHex` (primary + chart ladder),
   * precomputed at pick time so the FOUC script can apply them verbatim
   * without doing color math before first paint.
   */
  customVars: Record<string, string> | null;
  fontFamily: FontFamily;
  fontSize: number;
};

export const DEFAULT_SETTINGS: SettingsValues = {
  contrast: false,
  compact: false,
  maxWidth: false,
  navLayout: "vertical",
  // Matches Minimals: blended (light) nav by default; "apparent" opts into
  // the distinct dark surface.
  navColor: "integrate",
  preset: "blue",
  neutral: "zinc",
  radius: 0.625,
  customHex: null,
  customVars: null,
  fontFamily: "outfit",
  fontSize: 16,
};

/** localStorage key shared between the zustand store and the FOUC-blocking script. */
export const SETTINGS_STORAGE_KEY = "ytemplate-settings";
