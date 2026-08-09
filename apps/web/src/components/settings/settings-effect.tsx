"use client";

import { useEffect, useLayoutEffect } from "react";
import { CUSTOM_VAR_KEYS } from "@/lib/settings/color";
import { FONT_VAR_MAP } from "@/lib/settings/config";
import { useSettingsStore } from "@/lib/stores/settings-store";

// Layout effect on the client so attribute updates land before paint — the
// shell-mismatch guard in globals.css hides shells whose data-shell disagrees
// with data-layout, so a post-paint update would blank the new shell for a
// frame when switching layouts. Plain effect on the server (no-op) to avoid
// the SSR useLayoutEffect warning.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Reflects the settings store onto `<html>` so plain CSS can react.
 *
 * - `data-*` attributes drive the `globals.css` override blocks
 *   (`[data-contrast]`, `[data-compact]`, `[data-nav]`, `[data-preset]`,
 *   `[data-neutral]`, `[data-layout]`).
 * - Font family / size, radius and custom brand vars are set inline.
 *
 * Mounted once near the top of the provider tree. Renders nothing.
 * The initial paint is handled by `SettingsScript` to avoid a flash; this
 * effect keeps `<html>` in sync afterwards.
 */
export function SettingsEffect() {
  const {
    contrast,
    compact,
    maxWidth,
    navLayout,
    navColor,
    preset,
    neutral,
    radius,
    customVars,
    fontFamily,
    fontSize,
  } = useSettingsStore();

  useIsomorphicLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.contrast = contrast ? "high" : "normal";
    el.dataset.compact = compact ? "true" : "false";
    el.dataset.maxWidth = maxWidth ? "true" : "false";
    el.dataset.layout = navLayout;
    el.dataset.nav = navColor;
    el.dataset.preset = preset;
    el.dataset.neutral = neutral;
    el.style.setProperty("--font-sans", FONT_VAR_MAP[fontFamily]);
    el.style.setProperty("--font-size-base", `${fontSize}px`);
    el.style.setProperty("--radius", `${radius}rem`);
    // Inline brand vars win over the [data-preset] stylesheet blocks, so they
    // must be cleared when a stock preset is active.
    if (preset === "custom" && customVars) {
      for (const [key, value] of Object.entries(customVars)) {
        el.style.setProperty(key, value);
      }
    } else {
      for (const key of CUSTOM_VAR_KEYS) {
        el.style.removeProperty(key);
      }
    }
  }, [
    contrast,
    compact,
    maxWidth,
    navLayout,
    navColor,
    preset,
    neutral,
    radius,
    customVars,
    fontFamily,
    fontSize,
  ]);

  return null;
}
