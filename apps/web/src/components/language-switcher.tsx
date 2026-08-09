"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Locale picker — **presentation-only placeholder.**
 *
 * This repo has no i18n runtime (no `next-intl`, no message catalogs), so the
 * panel only tracks which row looks selected; picking a language does not
 * translate anything. It exists so the header's icon row matches yStage's and
 * so wiring real i18n later is a drop-in: replace the local `useState` with
 * the router locale and the labels with catalog lookups.
 *
 * Language names are endonyms (proper nouns) and stay as-is in every locale.
 */
const LOCALES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
] as const;

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>("en");
  const [open, setOpen] = useState(false);

  function switchTo(next: string) {
    setOpen(false);
    setLocale(next);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Language"
        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <span
          className="icon-[solar--global-bold-duotone] block size-4.5"
          aria-hidden
        />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-48 p-3">
        <p className="px-1 pb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Language
        </p>
        <div className="flex flex-col gap-1.5">
          {LOCALES.map(({ code, label }) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                onClick={() => switchTo(code)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-2 text-left transition-colors",
                  active
                    ? "border-primary bg-accent/60"
                    : "border-transparent hover:bg-accent/60",
                )}
              >
                <span className="w-7 shrink-0 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {code}
                </span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                {active && (
                  <span
                    className="icon-[solar--check-circle-bold] size-4.5 text-primary"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
