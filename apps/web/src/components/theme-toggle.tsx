"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. The button sets no color of its own — the host passes one
 * (the system header passes `text-muted-foreground`), so the same component
 * works on the page surface and on the dark "apparent" nav panel.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-full p-2 transition-colors hover:bg-accent cursor-pointer",
        className,
      )}
    >
      <span
        className="icon-[solar--sun-2-bold-duotone] block size-4.5 dark:hidden"
        aria-hidden
      />
      <span
        className="icon-[solar--moon-bold-duotone] hidden size-4.5 dark:block"
        aria-hidden
      />
    </button>
  );
}
