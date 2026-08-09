"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Dashboard toolbar — a card-surfaced control bar above the board. Its
 * Customize popover toggles each widget's visibility (all shown by default)
 * and resets to that default. Presentation only: the visible-set state lives
 * in the board so the panel can never disagree with what's rendered.
 */

export type ToolbarWidget = { id: string; label: string };

export function DashboardToolbar({
  widgets,
  hidden,
  onToggle,
  onReset,
}: {
  widgets: ToolbarWidget[];
  hidden: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
}) {
  const shown = widgets.length - hidden.size;
  const atDefault = hidden.size === 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 text-card-foreground shadow-(--shadow-card) ring-1 ring-(--card-ring)">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span
            className="icon-[solar--widget-5-bold-duotone] size-5"
            aria-hidden
          />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">Dashboard</p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular-nums">
            {shown} of {widgets.length} widgets shown
          </p>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <span
              className="icon-[solar--tuning-2-linear] size-4"
              aria-hidden
            />
            Customize
          </Button>
        </PopoverTrigger>
        {/* Same recipe as the List page's view-options panel: a p-4 popover of
            min-h-8 label + sm-switch rows with separators and a full-width
            outline reset. */}
        <PopoverContent align="end" sideOffset={8} className="w-64 p-4">
          <div className="space-y-3">
            {widgets.map((w) => {
              const on = !hidden.has(w.id);
              return (
                <div
                  key={w.id}
                  className="flex min-h-8 items-center justify-between gap-4"
                >
                  <span
                    className={cn(
                      "truncate text-sm transition-colors",
                      !on && "text-muted-foreground",
                    )}
                  >
                    {w.label}
                  </span>
                  <Switch
                    size="sm"
                    checked={on}
                    onCheckedChange={() => onToggle(w.id)}
                    aria-label={`Show ${w.label}`}
                  />
                </div>
              );
            })}

            <Separator />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onReset}
              disabled={atDefault}
            >
              <span className="icon-[solar--restart-linear]" aria-hidden />
              Reset to defaults
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
