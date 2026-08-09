import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildCustomVars } from "@/lib/settings/color";
import {
  DEFAULT_SETTINGS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type FontFamily,
  type NavColor,
  type NavLayout,
  type Neutral,
  type Preset,
  SETTINGS_STORAGE_KEY,
  type SettingsValues,
} from "@/lib/settings/config";

/**
 * Holds the user's UI preferences (everything in the settings drawer except
 * light/dark mode, which stays with `next-themes`).
 *
 * The values here are reflected onto `<html>` as `data-*` attributes / CSS
 * variables by `@/components/settings/settings-effect`; components themselves
 * stay unaware and keep consuming theme tokens (`--primary`, `--spacing`, …).
 */
type SettingsState = SettingsValues & {
  setContrast: (v: boolean) => void;
  setCompact: (v: boolean) => void;
  setMaxWidth: (v: boolean) => void;
  setNavLayout: (v: NavLayout) => void;
  setNavColor: (v: NavColor) => void;
  setPreset: (v: Preset) => void;
  setNeutral: (v: Neutral) => void;
  setRadius: (v: number) => void;
  /** Picks a custom brand color; derives + stores its CSS vars, activates the "custom" preset. */
  setCustomPrimary: (hex: string) => void;
  setFontFamily: (v: FontFamily) => void;
  setFontSize: (v: number) => void;
  reset: () => void;
};

const clampFontSize = (v: number) =>
  Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(v)));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setContrast: (contrast) => set({ contrast }),
      setCompact: (compact) => set({ compact }),
      setMaxWidth: (maxWidth) => set({ maxWidth }),
      setNavLayout: (navLayout) => set({ navLayout }),
      setNavColor: (navColor) => set({ navColor }),
      setPreset: (preset) => set({ preset }),
      setNeutral: (neutral) => set({ neutral }),
      setRadius: (radius) => set({ radius }),
      setCustomPrimary: (hex) => {
        const customVars = buildCustomVars(hex);
        if (!customVars) return;
        set({ customHex: hex, customVars, preset: "custom" });
      },
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize: clampFontSize(fontSize) }),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      // v1: default font changed public-sans → outfit. Visitors still on the
      // old default follow the new one; an explicit non-default choice can't
      // be told apart, so it migrates too (re-selectable in the drawer).
      // v2: "apparent" gained its dark surface and the default flipped to
      // "integrate". Pre-v2 "apparent" was the visually-light default, so it
      // migrates to "integrate" to preserve what those visitors were seeing.
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsValues>;
        if (version < 1 && state.fontFamily === "public-sans") {
          state.fontFamily = "outfit";
        }
        if (version < 2 && state.navColor === "apparent") {
          state.navColor = "integrate";
        }
        return state;
      },
    },
  ),
);
