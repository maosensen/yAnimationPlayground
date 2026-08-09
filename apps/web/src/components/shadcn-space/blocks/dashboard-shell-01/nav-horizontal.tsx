"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* gap-1 (= 0.25rem) in px, used by the fit computation. */
const ITEM_GAP = 4;

/**
 * Horizontal top-bar navigation for the "horizontal" shell layout
 * (Priority+ pattern).
 *
 * Items that don't fit the container collapse into a trailing "More"
 * dropdown. How it works:
 * - An invisible measurement strip always renders every item (plus the
 *   More button) at natural width so their real sizes can be read.
 * - A ResizeObserver watches the container (resizes), the measurement
 *   strip (content-driven width changes, e.g. the font-size setting), and
 *   the always-visible parent header (so crossing the md breakpoint —
 *   where the container itself goes display:none — still recomputes).
 * - If everything fits, all items render with no More; otherwise the More
 *   width is reserved and items fill from the start.
 *
 * Section dividers are dropped; leaf items render as links and parents
 * with children render as dropdowns (submenus inside More). Active state
 * highlights by `usePathname()`, mirroring the vertical `NavMain`; when
 * the active item is collapsed into More, the More button highlights.
 */
export function NavHorizontal({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLDivElement>(null);

  const navItems = items.filter((item) => item.title);
  const [visibleCount, setVisibleCount] = useState(navItems.length);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    const strip = measureRef.current;
    if (!container || !strip) return;
    const avail = container.clientWidth;
    // Below md the container is display:none and reports width 0; skip the
    // computation and keep the previous count (computing with 0 would leave
    // a stale collapsed state behind when the nav reappears).
    if (avail === 0) return;
    const widths = [...strip.children].map(
      (c) => (c as HTMLElement).offsetWidth,
    );
    const moreWidth = moreMeasureRef.current?.offsetWidth ?? 0;

    const total = widths.reduce(
      (sum, w, i) => sum + w + (i > 0 ? ITEM_GAP : 0),
      0,
    );
    if (total <= avail) {
      setVisibleCount(widths.length);
      return;
    }
    // Doesn't fit: reserve the More button width and fill from the start.
    let used = 0;
    let count = 0;
    for (const w of widths) {
      const next = used + (count > 0 ? ITEM_GAP : 0) + w;
      if (next + ITEM_GAP + moreWidth > avail) break;
      used = next;
      count++;
    }
    setVisibleCount(count);
  }, []);

  // Measure before paint on mount to avoid a wrapped/flickering first frame,
  // then keep watching via ResizeObserver.
  useLayoutEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) {
      ro.observe(containerRef.current);
      if (containerRef.current.parentElement)
        ro.observe(containerRef.current.parentElement);
    }
    if (measureRef.current) ro.observe(measureRef.current);
    return () => ro.disconnect();
  }, [recompute]);

  const isActive = useCallback(
    (item: NavItem): boolean =>
      item.href === pathname ||
      (item.children?.some((child) => isActive(child)) ?? false),
    [pathname],
  );

  const visible = navItems.slice(0, visibleCount);
  const overflow = navItems.slice(visibleCount);
  const moreActive = overflow.some(isActive);

  const renderButton = (item: NavItem) => {
    const active = isActive(item);

    if (item.children?.length) {
      return (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={active ? "default" : "ghost"}
              size="sm"
              // Resting state mirrors the vertical nav's muted grey
              // (dimmed white on the dark "apparent" surface).
              className={cn("gap-1.5", !active && "text-sidebar-foreground/60")}
            >
              {item.icon && (
                <span className={cn(item.icon, "size-4")} aria-hidden />
              )}
              {item.title}
              <span
                className="icon-[solar--alt-arrow-down-linear] size-3.5 opacity-70"
                aria-hidden
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {item.children.map((child) => (
              <DropdownMenuItem key={child.title} asChild>
                <Link
                  href={child.href ?? "#"}
                  className={cn(
                    child.href === pathname && "text-primary font-medium",
                  )}
                >
                  {child.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        key={item.title}
        asChild
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn("gap-1.5", !active && "text-sidebar-foreground/60")}
      >
        <Link href={item.href ?? "#"}>
          {item.icon && (
            <span className={cn(item.icon, "size-4")} aria-hidden />
          )}
          {item.title}
        </Link>
      </Button>
    );
  };

  /** Measurement-only dummy button (not clickable, hidden from a11y tree). */
  const renderMeasureButton = (item: NavItem) => (
    <Button
      key={item.title}
      variant="ghost"
      size="sm"
      className="gap-1.5"
      tabIndex={-1}
    >
      {item.icon && <span className={cn(item.icon, "size-4")} aria-hidden />}
      {item.title}
      {item.children?.length ? (
        <span
          className="icon-[solar--alt-arrow-down-linear] size-3.5"
          aria-hidden
        />
      ) : null}
    </Button>
  );

  return (
    <nav
      ref={containerRef}
      className={cn(
        "relative flex min-w-0 flex-1 items-center gap-1 overflow-hidden",
        className,
      )}
    >
      {/* Measurement strip: every item at natural width (invisible, out of flow) */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 flex w-max items-center gap-1"
      >
        {navItems.map(renderMeasureButton)}
      </div>
      <div
        ref={moreMeasureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 w-max"
      >
        <Button variant="ghost" size="sm" className="gap-1.5" tabIndex={-1}>
          <span className="icon-[solar--menu-dots-linear] size-4" aria-hidden />
          More
        </Button>
      </div>

      {visible.map(renderButton)}

      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={moreActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "gap-1.5",
                !moreActive && "text-sidebar-foreground/60",
              )}
            >
              <span
                className="icon-[solar--menu-dots-linear] size-4"
                aria-hidden
              />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflow.map((item) =>
              item.children?.length ? (
                <DropdownMenuSub key={item.title}>
                  <DropdownMenuSubTrigger
                    className={cn(
                      "gap-2",
                      isActive(item) && "text-primary font-medium",
                    )}
                  >
                    {item.icon && (
                      <span className={cn(item.icon, "size-4")} aria-hidden />
                    )}
                    {item.title}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.title} asChild>
                        <Link
                          href={child.href ?? "#"}
                          className={cn(
                            child.href === pathname &&
                              "text-primary font-medium",
                          )}
                        >
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "gap-2",
                      isActive(item) && "text-primary font-medium",
                    )}
                  >
                    {item.icon && (
                      <span className={cn(item.icon, "size-4")} aria-hidden />
                    )}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}
