"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_SETTINGS,
  FONT_OPTIONS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_VAR_MAP,
  type NavColor,
  type NavLayout,
  NEUTRAL_OPTIONS,
  PRESET_OPTIONS,
  RADIUS_OPTIONS,
} from "@/lib/settings/config";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                            One selection idiom                             */
/* -------------------------------------------------------------------------- */

/**
 * Every picker in this drawer — layout, nav color, preset, base color, radius —
 * uses the *same* selected treatment. Selection reads as one language instead
 * of the five it used to speak (ring / wash / shadow / filled button / tint).
 * The unselected state keeps a visible border so nothing shifts on click.
 */
function tile(selected: boolean) {
  return cn(
    "flex flex-col items-center gap-1.5 rounded-xl border bg-card p-1.5 transition-colors",
    selected
      ? "border-primary bg-primary/5"
      : "border-border hover:bg-accent hover:text-accent-foreground",
  );
}

/** Caption under a tile — muted until the tile is the active one. */
function tileLabel(selected: boolean) {
  return cn(
    "text-[10px] leading-none font-medium",
    selected ? "text-primary" : "text-muted-foreground",
  );
}

/* -------------------------------------------------------------------------- */
/*                                Small parts                                 */
/* -------------------------------------------------------------------------- */

/** Section heading: mono eyebrow + hairline. Replaces the nested box-in-box. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          {title}
        </h3>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>
      {children}
    </section>
  );
}

/** Row label with the current value echoed on the right, in the mono layer. */
function FieldLabel({
  children,
  value,
}: {
  children: ReactNode;
  value?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-medium">{children}</span>
      {value && (
        <span className="font-mono text-[11px] text-muted-foreground capitalize">
          {value}
        </span>
      )}
    </div>
  );
}

/** One row of the grouped switch list. */
function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  /** Iconify Tailwind class, e.g. "icon-[solar--filters-line-duotone]" */
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  // The switch is the sole accessible control; the absolute overlay button
  // only widens the pointer target to the whole row. Keeping it a *sibling*
  // of the switch avoids nesting button-in-button (invalid HTML, hydration
  // error), and the switch stacks above it so direct hits don't double-toggle.
  return (
    <div className="relative flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => onCheckedChange(!checked)}
        className="absolute inset-0 cursor-pointer"
      />
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
          checked
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
        aria-hidden
      >
        <span className={cn(icon, "size-4.5")} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="relative"
      />
    </div>
  );
}

/** Tri-state theme mode picker (light / system / dark), next-themes backed. */
function ModePicker() {
  const { theme, setTheme } = useTheme();
  const value = theme ?? "system";
  const options = [
    {
      value: "light",
      icon: "icon-[solar--sun-2-line-duotone]",
      label: "Light",
    },
    {
      value: "system",
      icon: "icon-[solar--monitor-line-duotone]",
      label: "System",
    },
    { value: "dark", icon: "icon-[solar--moon-line-duotone]", label: "Dark" },
  ];
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors",
            value === option.value
              ? "bg-card text-primary shadow-(--shadow-card)"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className={cn(option.icon, "size-4")} aria-hidden />
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Schematic of the app shell. It renders the *current* nav color, so the
 * layout tiles double as a preview of the nav-color setting (and the nav-color
 * tiles double as a preview of the layout) — nothing here is decoration.
 */
function ShellGlyph({
  layout,
  navColor,
}: {
  layout: NavLayout;
  navColor: NavColor;
}) {
  const nav =
    navColor === "apparent"
      ? "bg-foreground/85 text-background dark:bg-foreground/15 dark:text-foreground"
      : "border border-border bg-muted text-muted-foreground";
  const bar = "h-1 rounded-full bg-current opacity-40";

  if (layout === "horizontal") {
    return (
      <div className="flex aspect-[5/3] w-full flex-col gap-1">
        <div className={cn("flex items-center gap-1 rounded px-1.5 py-1", nav)}>
          <span className="size-1.5 rounded-full bg-primary" />
          <span className={cn(bar, "w-3")} />
          <span className={cn(bar, "w-2")} />
        </div>
        <div className="flex-1 rounded bg-muted/70" />
      </div>
    );
  }
  return (
    <div className="flex aspect-[5/3] w-full gap-1">
      <div
        className={cn(
          "flex flex-col gap-1 rounded p-1",
          layout === "mini" ? "w-3 items-center" : "w-6",
          nav,
        )}
      >
        <span
          className={cn(
            "rounded-full bg-primary",
            layout === "mini" ? "size-1.5" : "h-1 w-full",
          )}
        />
        {layout === "vertical" && (
          <>
            <span className={cn(bar, "w-3/4")} />
            <span className={cn(bar, "w-1/2")} />
          </>
        )}
        {layout === "mini" && (
          <span className="size-1.5 rounded-full bg-current opacity-40" />
        )}
      </div>
      <div className="flex-1 rounded bg-muted/70" />
    </div>
  );
}

/** Mini sidebar schematic tinted with a preset color. */
function PresetGlyph({ color }: { color: string }) {
  return (
    <span
      className="flex h-7 w-8 gap-1 rounded-lg p-1.5"
      style={{
        backgroundColor: `color-mix(in oklab, ${color} 24%, transparent)`,
      }}
      aria-hidden
    >
      <span
        className="h-full w-1.5 rounded-[3px]"
        style={{ backgroundColor: color }}
      />
      <span className="flex flex-1 flex-col justify-center gap-1">
        <span
          className="h-0.5 w-full rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="h-0.5 w-2/3 rounded-full opacity-60"
          style={{ backgroundColor: color }}
        />
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Drawer                                    */
/* -------------------------------------------------------------------------- */

const NAV_LAYOUTS: { value: NavLayout; label: string }[] = [
  { value: "vertical", label: "Sidebar" },
  { value: "horizontal", label: "Topbar" },
  { value: "mini", label: "Mini" },
];

const NAV_COLORS: { value: NavColor; label: string }[] = [
  { value: "integrate", label: "Integrate" },
  { value: "apparent", label: "Apparent" },
];

/**
 * Palette button that lives in the header; only toggles the store flag. The
 * glyph is a palette rather than a gear because this drawer is a theming
 * surface — it matches the spectrum control in the sibling yStage header.
 */
export function SettingsTrigger() {
  const toggleSettings = useUiStore((s) => s.toggleSettings);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open settings"
      onClick={toggleSettings}
      className="rounded-full text-muted-foreground hover:text-foreground"
    >
      <span
        className="icon-[solar--palette-bold-duotone] size-4.5"
        aria-hidden
      />
    </Button>
  );
}

export function SettingsDrawer() {
  const settingsOpen = useUiStore((s) => s.settingsOpen);
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);

  const {
    contrast,
    compact,
    maxWidth,
    navLayout,
    navColor,
    preset,
    neutral,
    radius,
    customHex,
    setContrast,
    setCompact,
    setMaxWidth,
    setNavLayout,
    setNavColor,
    setPreset,
    setNeutral,
    setRadius,
    setCustomPrimary,
    fontFamily,
    fontSize,
    setFontFamily,
    setFontSize,
    reset,
  } = useSettingsStore();

  // Drives the footer summary and the reset button (theme mode is left out: a
  // dark OS preference would otherwise read as "modified" on a fresh visit).
  const dirtyCount = [
    contrast !== DEFAULT_SETTINGS.contrast,
    compact !== DEFAULT_SETTINGS.compact,
    maxWidth !== DEFAULT_SETTINGS.maxWidth,
    navLayout !== DEFAULT_SETTINGS.navLayout,
    navColor !== DEFAULT_SETTINGS.navColor,
    preset !== DEFAULT_SETTINGS.preset,
    neutral !== DEFAULT_SETTINGS.neutral,
    radius !== DEFAULT_SETTINGS.radius,
    fontFamily !== DEFAULT_SETTINGS.fontFamily,
    fontSize !== DEFAULT_SETTINGS.fontSize,
  ].filter(Boolean).length;

  const radiusLabel =
    RADIUS_OPTIONS.find((o) => o.value === radius)?.label ?? "Custom";
  const fontLabel = FONT_OPTIONS.find((o) => o.value === fontFamily)?.label;

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen} modal={false}>
      <SheetContent
        overlay={false}
        // Built-in close overlaps our header tool row; we render our own.
        showCloseButton={false}
        // Non-modal: keep the drawer open while the user interacts with the
        // page (live-previewing settings). Close only via the X or Escape.
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="flex-row items-center justify-between border-b px-5 py-3.5">
          <div className="flex flex-col gap-0.5">
            <SheetTitle className="text-base">Settings</SheetTitle>
            <SheetDescription className="text-xs">
              Applies instantly and is saved to this browser.
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
            className="-mr-1 rounded-full text-muted-foreground hover:text-foreground"
          >
            <span
              className="icon-[solar--close-circle-linear] size-5"
              aria-hidden
            />
          </Button>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 py-6">
          {/* Appearance */}
          <Section title="Appearance">
            <ModePicker />
            <div className="divide-y overflow-hidden rounded-xl border">
              <ToggleRow
                icon="icon-[solar--filters-line-duotone]"
                label="Contrast"
                description="Stronger separation between surfaces"
                checked={contrast}
                onCheckedChange={setContrast}
              />
              <ToggleRow
                icon="icon-[solar--align-vertical-spacing-line-duotone]"
                label="Compact"
                description="Tighter spacing across the app"
                checked={compact}
                onCheckedChange={setCompact}
              />
              <ToggleRow
                icon="icon-[solar--align-horizonta-spacing-line-duotone]"
                label="Max width"
                description="Cap page content at 1280px"
                checked={maxWidth}
                onCheckedChange={setMaxWidth}
              />
            </div>
          </Section>

          {/* Navigation */}
          <Section title="Navigation">
            <div className="flex flex-col gap-2">
              <FieldLabel
                value={NAV_LAYOUTS.find((l) => l.value === navLayout)?.label}
              >
                Layout
              </FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {NAV_LAYOUTS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} layout`}
                    aria-pressed={navLayout === value}
                    onClick={() => setNavLayout(value)}
                    className={tile(navLayout === value)}
                  >
                    <ShellGlyph layout={value} navColor={navColor} />
                    <span className={tileLabel(navLayout === value)}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel
                value={NAV_COLORS.find((c) => c.value === navColor)?.label}
              >
                Nav surface
              </FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {/* Blended into the page vs. a distinct dark panel — each tile
                    draws the current layout in its own surface treatment. */}
                {NAV_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} nav surface`}
                    aria-pressed={navColor === value}
                    onClick={() => setNavColor(value)}
                    className={tile(navColor === value)}
                  >
                    {/* Same glyph width as the layout tiles, so the two rows
                        of previews stay on one visual scale */}
                    <span className="block w-24">
                      <ShellGlyph layout={navLayout} navColor={value} />
                    </span>
                    <span className={tileLabel(navColor === value)}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Color */}
          <Section title="Color">
            <div className="flex flex-col gap-2">
              <FieldLabel value={customHex ? "Custom" : preset}>
                Theme color
              </FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_OPTIONS.map(({ value, swatch }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} preset`}
                    aria-pressed={preset === value}
                    onClick={() => setPreset(value)}
                    className={cn(tile(preset === value), "py-2.5")}
                  >
                    <PresetGlyph color={swatch} />
                    <span
                      className={cn(tileLabel(preset === value), "capitalize")}
                    >
                      {value}
                    </span>
                  </button>
                ))}
              </div>
              {/* Custom brand color — native picker; the chart ladder is
                  derived from the pick in @/lib/settings/color */}
              <label
                className={cn(
                  "relative flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 transition-colors",
                  preset === "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent",
                )}
              >
                <input
                  type="color"
                  value={customHex ?? "#2b7eff"}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  aria-label="Pick a custom theme color"
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
                <span
                  className="size-6 shrink-0 rounded-full border"
                  style={{
                    background:
                      customHex ??
                      "conic-gradient(in oklch longer hue, oklch(0.7 0.18 0), oklch(0.7 0.18 360))",
                  }}
                  aria-hidden
                />
                <span className="flex-1 text-left text-sm font-medium">
                  Custom color
                </span>
                {customHex && (
                  <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    {customHex}
                  </span>
                )}
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel
                value={NEUTRAL_OPTIONS.find((n) => n.value === neutral)?.label}
              >
                Base color
              </FieldLabel>
              <div className="grid grid-cols-5 gap-1.5">
                {NEUTRAL_OPTIONS.map(({ value, label, swatch }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} base color`}
                    aria-pressed={neutral === value}
                    onClick={() => setNeutral(value)}
                    className={cn(tile(neutral === value), "py-2")}
                  >
                    <span
                      className="size-5 rounded-full"
                      style={{ backgroundColor: swatch }}
                      aria-hidden
                    />
                    <span className={tileLabel(neutral === value)}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel value={radiusLabel}>Radius</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {RADIUS_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} radius`}
                    aria-pressed={radius === value}
                    onClick={() => setRadius(value)}
                    className={cn(tile(radius === value), "py-2.5")}
                  >
                    {/* Corner preview: top-left edge drawn at this step */}
                    <span
                      className={cn(
                        "size-5 border-t-2 border-l-2",
                        radius === value
                          ? "border-primary"
                          : "border-muted-foreground/50",
                      )}
                      style={{ borderTopLeftRadius: `${value * 16}px` }}
                      aria-hidden
                    />
                    <span className={tileLabel(radius === value)}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div className="flex flex-col gap-2">
              <FieldLabel value={fontLabel}>Family</FieldLabel>
              <div className="divide-y overflow-hidden rounded-xl border">
                {FONT_OPTIONS.map(({ value, label }) => {
                  const active = fontFamily === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFontFamily(value)}
                      // Each row previews its own typeface
                      style={{ fontFamily: FONT_VAR_MAP[value] }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                        active ? "bg-primary/5" : "hover:bg-accent/50",
                      )}
                    >
                      <span
                        className={cn(
                          "w-7 shrink-0 text-lg leading-none font-bold",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden
                      >
                        Aa
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          active ? "font-medium" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                      {active && (
                        <span
                          className="icon-[solar--check-circle-bold] size-4 text-primary"
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel value={`${fontSize}px`}>Size</FieldLabel>
              <div className="px-1">
                <div className="relative">
                  {/* Step ticks ride the track, one per integer step */}
                  <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 flex -translate-y-1/2 justify-between">
                    {Array.from(
                      { length: FONT_SIZE_MAX - FONT_SIZE_MIN + 1 },
                      (_, i) => FONT_SIZE_MIN + i,
                    ).map((size) => (
                      <span
                        key={size}
                        className="h-1.5 w-px rounded-full bg-muted-foreground/30"
                      />
                    ))}
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={FONT_SIZE_MIN}
                    max={FONT_SIZE_MAX}
                    step={1}
                    onValueChange={([v]) => setFontSize(v)}
                    aria-label="Base font size"
                    className="[&_[data-slot=slider-range]]:bg-linear-to-r [&_[data-slot=slider-range]]:from-primary/35 [&_[data-slot=slider-range]]:to-primary [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:shadow-md [&_[data-slot=slider-track]]:h-2"
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>{FONT_SIZE_MIN}px</span>
                  <span>{FONT_SIZE_MAX}px</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t px-5 py-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            {dirtyCount === 0
              ? "Default theme"
              : `${dirtyCount} change${dirtyCount > 1 ? "s" : ""}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={dirtyCount === 0}
          >
            <span className="icon-[solar--restart-linear] size-4" aria-hidden />
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
