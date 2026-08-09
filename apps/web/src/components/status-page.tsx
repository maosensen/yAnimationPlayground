import type { ReactNode } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type StatusPageProps = {
  /**
   * Status code rendered as an oversized figure (e.g. "404", "403", "500").
   * When present it replaces the icon.
   */
  code?: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--danger-triangle-line-duotone]". */
  icon?: string;
  title: string;
  description: string;
  /** Action buttons (links, retry, …). */
  children?: ReactNode;
  className?: string;
};

/**
 * Unified full-page status state (404 / 403 / 500 / error boundaries).
 * Centers itself in whatever flex column it is placed in; give the parent
 * `flex-1` (or a min-height) so vertical centering has room to work.
 */
export function StatusPage({
  code,
  icon,
  title,
  description,
  children,
  className,
}: StatusPageProps) {
  return (
    <Empty className={cn("flex-1 border-none", className)}>
      <EmptyHeader>
        {code ? (
          <span
            aria-hidden
            className="font-heading text-8xl font-semibold tracking-tight text-primary/20 select-none"
          >
            {code}
          </span>
        ) : icon ? (
          <EmptyMedia variant="icon">
            <span aria-hidden className={cn(icon, "size-5")} />
          </EmptyMedia>
        ) : null}
        <EmptyTitle className="text-base">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}
