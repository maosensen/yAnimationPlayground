import type { ReactNode } from "react";
import { PageContainer } from "@/components/page-container";
import { cn } from "@/lib/utils";

export type PageHeaderProps = {
  /**
   * Leading icon / logo, rendered before the title. Pass a styled element —
   * {@link PageHeaderIcon} provides the standard tile.
   */
  icon?: ReactNode;
  /**
   * The page's primary heading. Required, but nullable: pass `title={null}` for
   * a chrome-only band (see `inlineToolbar`).
   */
  title: ReactNode;
  /** Supporting copy under the title. */
  description?: ReactNode;
  /** Inline content pinned to the title (badge, status dot, dropdown…). */
  titleSuffix?: ReactNode;
  /** Actions at the right of the title row; wraps to its own line when narrow. */
  actions?: ReactNode;
  /** A second row of filters / context controls. */
  toolbar?: ReactNode;
  /**
   * Navigation tabs on their own row. The band's bottom padding is dropped and
   * the row is pulled down a hairline, so an underlined tab list lands exactly
   * on the band's bottom border.
   */
  tabs?: ReactNode;
  /** Escape hatch for anything the named slots don't cover. */
  children?: ReactNode;
  /**
   * Stick the band directly under the app header while the page scrolls
   * (default). The offset follows `--app-header-height`, which the shell
   * publishes from the app header's measured height.
   */
  sticky?: boolean;
  /**
   * Put `toolbar` on the title row instead of its own line. Useful on pages
   * with no title, where the toolbar and the actions should share one row.
   */
  inlineToolbar?: boolean;
  /** Extra classes for the band (background / border / positioning). */
  className?: string;
  /** Extra classes for the inner (centered) container. */
  innerClassName?: string;
};

/**
 * Standard tile for {@link PageHeaderProps.icon} — the same recipe as the
 * dashboard board bar, one step up in size to match a `text-2xl` heading.
 * Pass an iconify class via `icon`, or arbitrary content as children (a logo).
 */
export function PageHeaderIcon({
  icon,
  className,
  children,
}: {
  /** Iconify Tailwind class, e.g. "icon-[solar--widget-5-bold-duotone]". */
  icon?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
        className,
      )}
      aria-hidden
    >
      {children ?? (icon ? <span className={cn(icon, "size-5.5")} /> : null)}
    </span>
  );
}

/**
 * Page header band shared across pages.
 *
 * The band (background + bottom border) spans the full content-area width and
 * sits directly under the app header; its contents live in a centered
 * `<PageContainer>`, so they line up with the page body and follow the Max
 * Width setting. Background is the Card surface (`bg-card`) so it stays white
 * under Contrast, matching the app header and sidebar.
 *
 * Rows stack in this order, each one optional except the title row:
 *
 *   icon · title · titleSuffix …………………………………… actions
 *   description
 *   toolbar                      (or inline on the title row)
 *   children
 *   tabs                         (flush with the band's bottom border)
 *
 * Render it as a page's first child, before its `<PageContainer>` body:
 *
 *   <PageHeader title="…" description="…" />
 *   <PageContainer>…page content…</PageContainer>
 *
 * `z-20` keeps the sticky band above page content (which tops out at `z-10`)
 * and below the app header (`z-30`) it tucks under.
 */
export function PageHeader({
  icon,
  title,
  description,
  titleSuffix,
  actions,
  toolbar,
  tabs,
  children,
  sticky = true,
  inlineToolbar = false,
  className,
  innerClassName,
}: PageHeaderProps) {
  const hasHeading = Boolean(icon || title || description || titleSuffix);
  const inlineToolbarNode = inlineToolbar ? toolbar : null;
  const rowToolbarNode = inlineToolbar ? null : toolbar;

  return (
    <div
      className={cn(
        "border-b bg-card",
        sticky && "sticky top-(--app-header-height) z-20",
        className,
      )}
    >
      <PageContainer
        // `!pb-0` comes after innerClassName on purpose: dropping the bottom
        // padding is what puts the tab row on the band's border, so it has to
        // survive a caller's own padding tweak.
        className={cn("flex flex-col gap-3", innerClassName, tabs && "!pb-0")}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          {hasHeading ? (
            <div className="flex min-w-0 items-center gap-3">
              {icon}
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {titleSuffix}
                </div>
                {description ? (
                  <p className="text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          {inlineToolbarNode ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {inlineToolbarNode}
            </div>
          ) : null}
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
        {rowToolbarNode ? (
          <div className="flex flex-wrap items-center gap-2">
            {rowToolbarNode}
          </div>
        ) : null}
        {children}
        {/* -mb-px lands an underlined tab list on the band's own border
            instead of stacking two hairlines */}
        {tabs ? <div className="-mb-px">{tabs}</div> : null}
      </PageContainer>
    </div>
  );
}
