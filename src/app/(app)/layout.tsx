import type { ReactNode } from "react";
import { SettingsDrawer } from "@/components/settings/settings-drawer";
import { AppShell } from "@/components/shadcn-space/blocks/dashboard-shell-01/app-shell";

/**
 * Application shell layout.
 *
 * Every route inside the `(app)` group is rendered inside the shell, whose
 * skeleton (vertical / mini sidebar or horizontal top-bar) is chosen by the
 * `navLayout` setting. Marketing / auth pages can live outside this group to
 * opt out of the shell.
 *
 * `SettingsDrawer` is mounted as a sibling of `AppShell` (not inside it) so
 * switching nav layout — which remounts the shell — never tears the open
 * drawer down. Its open state lives in the UI store; the header only renders
 * the trigger.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <SettingsDrawer />
    </>
  );
}
