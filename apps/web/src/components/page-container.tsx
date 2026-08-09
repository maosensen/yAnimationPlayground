import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard wrapper for every page's content (inside the shell's <main>).
 *
 * Provides the page padding and obeys the "Max Width" setting: when
 * `[data-max-width="true"]` is on `<html>`, the container boxes at 7xl and
 * centers (rule in globals.css); otherwise it spans the full width. Nav
 * chrome (header / sidebar) stays outside and is never constrained.
 *
 * Pages should not hardcode their own `max-w-* mx-auto` wrappers.
 */
export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-page-container
      className={cn("w-full p-6", className)}
      {...props}
    />
  );
}
