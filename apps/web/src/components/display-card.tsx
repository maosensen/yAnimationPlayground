import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DisplayCardProps = {
  /** Header heading (left side). */
  title: ReactNode;
  /**
   * Element used to render the title. Defaults to `h2` (continues the page's
   * `PageHeader` `h1` to keep the document outline). Drop to `h3` etc. when
   * nesting inside another heading.
   */
  titleAs?: "h2" | "h3" | "h4" | "div";
  /** Optional supporting copy under the title. */
  subtitle?: ReactNode;
  /** Actions placed at the right of the header (variant toggles, links…). */
  actions?: ReactNode;
  /** Footer content; the footer is only rendered when this is provided. */
  footer?: ReactNode;
  /** Main content area (where the example / component is shown). */
  children: ReactNode;
  /** Extra classes for the root Card. */
  className?: string;
  /** Extra classes for the content area (e.g. to override padding). */
  contentClassName?: string;
};

/**
 * Example/showcase card.
 *
 * A container for laying out component or tool samples. Built on the standard
 * {@link Card}, it splits into three border-separated regions:
 *
 * - Header: `title` + `subtitle`; `actions` adds controls on the right.
 * - Content: `children` — the actual demo (rendered component or code sample).
 * - Footer: only rendered when `footer` is passed.
 */
export function DisplayCard({
  title,
  titleAs: TitleTag = "h2",
  subtitle,
  actions,
  footer,
  children,
  className,
  contentClassName,
}: DisplayCardProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
        <div className="space-y-1">
          <TitleTag className="font-semibold leading-none">{title}</TitleTag>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      <div className={cn("px-6 py-6", contentClassName)}>{children}</div>

      {footer ? (
        <div className="flex items-center gap-2 border-t px-6 py-4 text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
