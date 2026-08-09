import { create } from "zustand";

/**
 * Transient UI state (not persisted).
 *
 * `settingsOpen` lives here rather than inside the settings drawer so the
 * drawer survives shell remounts — switching nav layout tears down and
 * rebuilds `AppShell`, but the open state (and the drawer itself, mounted
 * outside the shell) is unaffected.
 */
type UiState = {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  toggleSettings: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
}));
