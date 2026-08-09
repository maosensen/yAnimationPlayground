"use client";

import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import Logo from "@/assets/logo/logo";
import { PageContainer } from "@/components/page-container";
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";
import { navData } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
import { NavHorizontal } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-horizontal";
import { NavMobile } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-mobile";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { cn } from "@/lib/utils";

/**
 * Shared system-header shell (both vertical and horizontal layouts).
 *
 * The band (background + bottom border) spans the full content-area width;
 * its contents sit in a centered <PageContainer> so they line up with the
 * page body and follow the Max Width setting. `z-30` keeps it above page
 * content but below the sidebar container (z-40) and portal layers (z-50).
 *
 * - `className`: surface tokens on the band (`bg`, `border`, `text`, data-*)
 * - `innerClassName`: tweaks to the centered container (mainly `gap`)
 *
 * It also publishes its measured height as `--app-header-height` on `<html>`,
 * which is what a sticky `<PageHeader>` offsets itself by. Measured rather than
 * computed because the height moves with the Compact setting *and* the base
 * font size (the whole spacing scale is rem-based); `globals.css` carries a
 * default for the first paint.
 */
function HeaderBar({
  children,
  className,
  innerClassName,
  ...props
}: ComponentProps<"header"> & { innerClassName?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${el.getBoundingClientRect().height}px`,
      );
    };
    publish();
    // Height moves with the Compact / base-font-size settings, with web fonts
    // finishing, and with the row wrapping at narrow widths — one observer
    // covers all of them. (Delivery pauses in a background tab and resumes
    // with the pending entry when the tab is shown again, so a stale value
    // never survives into a visible frame.)
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className={cn("sticky top-0 z-30 border-b", className)}
      {...props}
    >
      <PageContainer className={cn("flex items-center !py-3", innerClassName)}>
        {children}
      </PageContainer>
    </header>
  );
}

/**
 * Top-level application shell. Reads the `navLayout` setting and renders one
 * of three skeletons:
 *
 * - `vertical` / `mini` → collapsible sidebar (one component, two open states)
 * - `horizontal`        → top-bar navigation, no sidebar
 *
 * The `key` on `SidebarProvider` remounts it when toggling vertical ↔ mini so
 * the correct `defaultOpen` (expanded vs. icon) takes effect.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const navLayout = useSettingsStore((s) => s.navLayout);

  // data-shell tags each shell root so the layout FOUC guard in globals.css
  // can hide a shell that disagrees with the persisted data-layout on <html>
  // (SSR always emits the default vertical shell; a horizontal visitor would
  // otherwise see the sidebar flash before hydration swaps it out).
  if (navLayout === "horizontal") {
    return (
      <div data-shell="horizontal" className="flex min-h-svh flex-col">
        {/* The top bar IS the nav surface in this layout, so it consumes the
            sidebar tokens: "integrate" blends it into the page, "apparent"
            gives it the distinct dark panel. data-surface="nav" lets
            globals.css re-point interaction accents to the sidebar palette. */}
        {/* z-30 matches the vertical layout's header: above page content,
            below portal layers (z-50) so it can't flash over an open
            settings drawer when layouts switch. */}
        {/* The underline is dashed to mark the boundary between the app header
            (this top bar) and the page region below it (horizontal layout
            only). It uses the generic border-border token rather than the
            nav-only --sidebar-border: under "integrate" the latter is
            transparent, which would hide the dashes — border-border matches
            the page's own dividers and stays visible. */}
        <HeaderBar
          data-surface="nav"
          className="border-border border-dashed bg-sidebar text-sidebar-foreground"
          innerClassName="gap-4"
        >
          {/* Below md the horizontal bar can't fit: hamburger → left Sheet */}
          <NavMobile items={navData} />
          <span className="shrink-0">
            <Logo />
          </span>
          {/* flex-1 min-w-0 claims the remaining width; items that don't fit
              collapse into the trailing "More" dropdown (Priority+) */}
          <NavHorizontal items={navData} className="hidden md:flex" />
          <div className="ml-auto shrink-0">
            <SiteHeader />
          </div>
        </HeaderBar>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider
      key={navLayout}
      data-shell={navLayout}
      defaultOpen={navLayout === "vertical"}
      // Default 3rem icon rail is too tight: the edge toggle (12px overhang)
      // collides with the logo. 4.5rem gives icons and the toggle room.
      style={{ "--sidebar-width-icon": "4.5rem" } as CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        {/* z-30 keeps the header above page content but below the sidebar
            container (z-40), so the edge toggle button stays clickable.
            bg-card (not bg-background) so it stays white under Contrast. */}
        <HeaderBar className="bg-card" innerClassName="gap-2">
          {/* Desktop toggle is the round button on the sidebar edge; this
              trigger only surfaces on mobile to open the off-canvas sheet. */}
          <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground md:hidden" />
          <div className="ml-auto">
            <SiteHeader />
          </div>
        </HeaderBar>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
