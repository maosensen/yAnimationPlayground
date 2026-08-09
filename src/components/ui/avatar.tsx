"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Deterministic 32-bit hash of a string. Stable across renders and SSR, so a
 * fallback's generated color depends only on its seed — never on Math.random,
 * which would mismatch between the server and client paint (hydration error)
 * and reshuffle on every render.
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(hash, 31) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Coerces text-ish children to a seed: strings, numbers, and arrays of them, so
 * composed initials like `{first}{last}` still seed a color. Non-text nodes
 * (icon elements, etc.) yield "" — those callers must pass an explicit `seed`,
 * otherwise every such avatar collapses to one fixed hue.
 */
function resolveSeed(
  seed: string | undefined,
  children: React.ReactNode,
): string {
  if (seed) return seed;
  return stringifyChildren(children);
}

function stringifyChildren(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(stringifyChildren).join("");
  }
  return "";
}

/**
 * Background for the colored fallback variants. The hue is derived from the
 * seed so it spans the whole wheel deterministically; lightness and chroma are
 * fixed so every generated color stays harmonious and dark enough for the light
 * initials to read on top. Expressed in OKLCH to match the rest of the theme.
 */
function generateFallbackStyle(
  variant: "solid" | "gradient",
  seed: string,
): React.CSSProperties {
  const hue = hashSeed(seed) % 360;
  const color = "oklch(0.99 0 0)"; // light initials over the saturated fill
  if (variant === "solid") {
    return { background: `oklch(0.56 0.19 ${hue})`, color };
  }
  const hue2 = (hue + 55) % 360;
  // The lighter stop drives worst-case contrast, so keep it dark enough for the
  // light initials to clear ~3:1 across the whole hue wheel (cyan/teal is the
  // worst case); the second stop goes deeper for depth.
  return {
    background: `linear-gradient(135deg, oklch(0.58 0.19 ${hue}), oklch(0.46 0.21 ${hue2}))`,
    color,
  };
}

function AvatarFallback({
  className,
  variant = "text",
  seed,
  style,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  /**
   * `text` (default) keeps the muted initials placeholder. `solid` / `gradient`
   * generate a colored background derived from `seed` (or the text children),
   * Attio-style — same seed always yields the same color.
   *
   * A colored variant with no text children (empty, or an icon only) conveys
   * identity through color alone, which is silent to screen readers — pass an
   * accessible name (`aria-label`) in that case.
   */
  variant?: "text" | "solid" | "gradient";
  /**
   * Color seed; identical seeds produce identical colors. Defaults to the text
   * children (including several text nodes). Pass it explicitly whenever the
   * children aren't plain text — otherwise the color can't vary and falls back
   * to a single fixed hue.
   */
  seed?: string;
}) {
  const generated =
    variant === "text"
      ? undefined
      : generateFallbackStyle(variant, resolveSeed(seed, children));
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-variant={variant}
      className={cn(
        "flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
        variant === "text" ? "bg-muted text-muted-foreground" : "font-medium",
        className,
      )}
      style={generated ? { ...generated, ...style } : style}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
