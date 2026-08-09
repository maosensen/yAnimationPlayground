"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  PlaybackController,
  RuntimeDefinition,
  ViewportPreset,
} from "./interaction-types";

const viewportClasses: Record<ViewportPreset, string> = {
  wide: "max-w-5xl",
  square: "max-w-[42rem]",
  portrait: "max-w-[28rem]",
};

const statusLabels = {
  preparing: "Preparing",
  playing: "Playing",
  paused: "Paused",
  complete: "Complete",
} as const;

type InteractionHarnessProps = {
  runtime: RuntimeDefinition;
  controller: PlaybackController;
  reducedMotion: boolean;
  onReducedMotionChange: (enabled: boolean) => void;
  children: ReactNode;
};

export function InteractionHarness({
  runtime,
  controller,
  reducedMotion,
  onReducedMotionChange,
  children,
}: InteractionHarnessProps) {
  const [viewport, setViewport] = useState<ViewportPreset>("wide");
  const progressPercent = Math.round(controller.progress * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{runtime.name}</Badge>
              <Badge variant="outline">{runtime.model}</Badge>
              <Badge variant="secondary">{runtime.payload}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              One 7.2 second product story · identical scene contract
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-2 rounded-full",
                controller.state === "playing"
                  ? "bg-primary motion-safe:animate-pulse"
                  : "bg-muted-foreground/50",
              )}
              aria-hidden
            />
            {statusLabels[controller.state]}
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[auto_minmax(12rem,1fr)_auto_auto] xl:items-center">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="icon"
              onClick={
                controller.state === "playing"
                  ? controller.pause
                  : controller.play
              }
              disabled={!controller.ready}
              aria-label={controller.state === "playing" ? "Pause" : "Play"}
            >
              <span
                className={
                  controller.state === "playing"
                    ? "icon-[solar--pause-bold] size-4"
                    : "icon-[solar--play-bold] size-4"
                }
                aria-hidden
              />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={controller.restart}
              disabled={!controller.ready}
              aria-label="Restart animation"
            >
              <span
                className="icon-[solar--restart-bold-duotone] size-4"
                aria-hidden
              />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={controller.reverse}
              disabled={!controller.ready || reducedMotion}
              aria-label="Reverse animation"
            >
              <span
                className="icon-[solar--rewind-back-bold-duotone] size-4"
                aria-hidden
              />
            </Button>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <span className="w-8 font-mono text-[0.68rem] text-muted-foreground tabular-nums">
              {progressPercent}%
            </span>
            <Slider
              value={[progressPercent]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => controller.seek((value ?? 0) / 100)}
              disabled={!controller.ready || reducedMotion}
              aria-label="Animation progress"
            />
            <span className="hidden font-mono text-[0.68rem] text-muted-foreground tabular-nums sm:inline">
              {(controller.progress * controller.duration).toFixed(1)}s /
              {controller.duration.toFixed(1)}s
            </span>
          </div>

          <Select
            value={viewport}
            onValueChange={(value) => setViewport(value as ViewportPreset)}
          >
            <SelectTrigger
              className="w-full xl:w-36"
              aria-label="Stage viewport"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wide">Wide · 16:9</SelectItem>
              <SelectItem value="square">Square · 1:1</SelectItem>
              <SelectItem value="portrait">Portrait · 9:16</SelectItem>
            </SelectContent>
          </Select>

          <label
            htmlFor="reduced-motion-switch"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-2.5 py-1.5 text-xs xl:border-transparent xl:px-0"
          >
            Reduced motion
            <Switch
              id="reduced-motion-switch"
              size="sm"
              checked={reducedMotion}
              onCheckedChange={onReducedMotionChange}
              aria-label="Use reduced motion"
            />
          </label>
        </div>
      </CardHeader>

      <CardContent className="bg-muted/25 p-3 sm:p-5">
        <div
          className={cn(
            "mx-auto w-full transition-[max-width] duration-300",
            viewportClasses[viewport],
          )}
          data-stage-viewport={viewport}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
