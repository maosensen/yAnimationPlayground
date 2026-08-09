"use client";

import { GridStack, type GridStackNode, type GridStackWidget } from "gridstack";
import {
  ArrowUpToLine,
  History,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import "gridstack/dist/gridstack.min.css";
import "./gridstack-base.css";
import "./gridstack-demo.css";

/* ---------- widget content (HTML strings, rendered via GridStack.renderCB) ---------- */

const ICON_PATHS: Record<string, string> = {
  dollar:
    '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  trending:
    '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

function svgIcon(name: string, cls = "size-4"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${ICON_PATHS[name]}</svg>`;
}

function removeButton(): string {
  return `<button type="button" data-gs-remove aria-label="Remove widget" class="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/50 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100">${svgIcon("x", "size-3.5")}</button>`;
}

function widgetHeader(icon: string, title: string): string {
  return `<div class="flex items-center justify-between gap-2 border-b px-4 py-2.5">
    <div class="flex items-center gap-2.5">
      <span class="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">${svgIcon(icon, "size-3.5")}</span>
      <span class="text-sm font-medium">${title}</span>
    </div>
    ${removeButton()}
  </div>`;
}

type StatSpec = {
  title: string;
  icon: string;
  value: string;
  delta: string;
  up: boolean;
};

function statContent({ title, icon, value, delta, up }: StatSpec): string {
  const tone = up
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "bg-red-500/10 text-red-600 dark:text-red-400";
  return `<div class="group flex h-full flex-col justify-between p-4">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <span class="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">${svgIcon(icon)}</span>
        <span class="text-sm font-medium text-muted-foreground">${title}</span>
      </div>
      ${removeButton()}
    </div>
    <div class="flex items-end justify-between gap-2">
      <span class="text-2xl font-semibold tracking-tight">${value}</span>
      <span class="rounded-full px-2 py-0.5 text-xs font-medium ${tone}">${delta}</span>
    </div>
  </div>`;
}

function chartContent(): string {
  const bars = [42, 58, 49, 75, 62, 86, 70, 94, 78, 98, 72, 90]
    .map(
      (h) =>
        `<div class="flex-1 rounded-sm bg-primary/70 transition-colors hover:bg-primary" style="height:${h}%"></div>`,
    )
    .join("");
  return `<div class="group flex h-full flex-col">
    ${widgetHeader("activity", "Requests per minute")}
    <div class="flex flex-1 items-end gap-2 p-4">${bars}</div>
  </div>`;
}

function feedContent(): string {
  const rows: Array<[string, string]> = [
    ["Deploy v2.4.1 finished", "2m ago"],
    ["New team member joined", "9m ago"],
    ["Cache invalidated", "24m ago"],
    ["Nightly backup completed", "1h ago"],
    ["SSL certificate renewed", "3h ago"],
  ];
  const items = rows
    .map(
      ([label, time]) =>
        `<li class="flex items-center justify-between gap-2">
          <span class="truncate">${label}</span>
          <span class="shrink-0 text-xs text-muted-foreground">${time}</span>
        </li>`,
    )
    .join("");
  return `<div class="group flex h-full flex-col">
    ${widgetHeader("zap", "Activity")}
    <ul class="flex flex-col gap-3 overflow-hidden p-4 text-sm">${items}</ul>
  </div>`;
}

function lockedContent(): string {
  return `<div data-gs-locked class="flex h-full flex-col items-center justify-center gap-1.5 p-4 text-center">
    <span class="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">${svgIcon("lock")}</span>
    <span class="text-sm font-medium">Locked widget</span>
    <span class="text-xs text-muted-foreground">noMove · noResize — others flow around it</span>
  </div>`;
}

const INITIAL_LAYOUT: GridStackWidget[] = [
  {
    id: "revenue",
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    content: statContent({
      title: "Revenue",
      icon: "dollar",
      value: "$128,420",
      delta: "+12.3%",
      up: true,
    }),
  },
  {
    id: "users",
    x: 3,
    y: 0,
    w: 3,
    h: 2,
    content: statContent({
      title: "Active users",
      icon: "users",
      value: "8,549",
      delta: "+4.1%",
      up: true,
    }),
  },
  {
    id: "conversion",
    x: 6,
    y: 0,
    w: 3,
    h: 2,
    content: statContent({
      title: "Conversion",
      icon: "trending",
      value: "3.42%",
      delta: "-0.8%",
      up: false,
    }),
  },
  {
    id: "locked",
    x: 9,
    y: 0,
    w: 3,
    h: 2,
    locked: true,
    noMove: true,
    noResize: true,
    content: lockedContent(),
  },
  { id: "chart", x: 0, y: 2, w: 6, h: 4, content: chartContent() },
  { id: "feed", x: 6, y: 2, w: 3, h: 4, content: feedContent() },
  {
    id: "latency",
    x: 9,
    y: 2,
    w: 3,
    h: 2,
    content: statContent({
      title: "Latency p95",
      icon: "gauge",
      value: "182 ms",
      delta: "-6.2%",
      up: true,
    }),
  },
  {
    id: "cpu",
    x: 9,
    y: 4,
    w: 3,
    h: 2,
    content: statContent({
      title: "CPU load",
      icon: "cpu",
      value: "61%",
      delta: "+3.4%",
      up: false,
    }),
  },
];

const ADD_POOL: StatSpec[] = [
  {
    title: "Throughput",
    icon: "activity",
    value: "12.4k rps",
    delta: "+8.9%",
    up: true,
  },
  {
    title: "Error rate",
    icon: "zap",
    value: "0.42%",
    delta: "+0.1%",
    up: false,
  },
  { title: "Memory", icon: "cpu", value: "72%", delta: "+1.8%", up: false },
  {
    title: "Sign-ups",
    icon: "users",
    value: "324",
    delta: "+15.7%",
    up: true,
  },
];

/* ---------- component ---------- */

export default function GridstackAdvancedDemo() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInst = useRef<GridStack | null>(null);
  const savedLayout = useRef<GridStackWidget[] | null>(null);
  const addCount = useRef(0);

  const [count, setCount] = useState(0);
  const [floatOn, setFloatOn] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState("Loaded default layout");

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    GridStack.renderCB = (contentEl, w) => {
      contentEl.innerHTML = w.content ?? "";
    };

    const grid = GridStack.init(
      { cellHeight: 72, margin: 8, float: false, animate: true },
      el,
    );
    gridInst.current = grid;
    grid.load(INITIAL_LAYOUT);

    const sync = () => setCount(grid.engine.nodes.length);
    sync();

    grid.on("added", (_ev: Event, items: GridStackNode[]) => {
      sync();
      setLastAction(
        items.length === 1
          ? `Added "${items[0].id ?? "widget"}"`
          : `Added ${items.length} widgets`,
      );
    });
    grid.on("removed", (_ev: Event, items: GridStackNode[]) => {
      sync();
      setLastAction(
        items.length === 1
          ? `Removed "${items[0].id ?? "widget"}"`
          : `Removed ${items.length} widgets`,
      );
    });
    grid.on("dragstop", (_ev: Event, target: HTMLElement) => {
      const node = (target as HTMLElement & { gridstackNode?: GridStackNode })
        .gridstackNode;
      if (node)
        setLastAction(`Moved "${node.id}" to column ${node.x}, row ${node.y}`);
    });
    grid.on("resizestop", (_ev: Event, target: HTMLElement) => {
      const node = (target as HTMLElement & { gridstackNode?: GridStackNode })
        .gridstackNode;
      if (node) setLastAction(`Resized "${node.id}" to ${node.w} × ${node.h}`);
    });

    // Remove buttons live inside HTML injected by GridStack.renderCB, so a
    // single delegated listener on the container covers every widget.
    const onRemoveClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("[data-gs-remove]");
      if (!btn) return;
      const item = btn.closest<HTMLElement>(".grid-stack-item");
      if (item) grid.removeWidget(item);
    };
    el.addEventListener("click", onRemoveClick);

    return () => {
      el.removeEventListener("click", onRemoveClick);
      gridInst.current = null;
      grid.removeAll();
      grid.destroy(false);
    };
  }, []);

  const addWidget = () => {
    const grid = gridInst.current;
    if (!grid) return;
    const n = addCount.current++;
    const spec = ADD_POOL[n % ADD_POOL.length];
    grid.addWidget({
      id: `${spec.title.toLowerCase().replace(/[^a-z]+/g, "-")}-${n + 1}`,
      w: 3,
      h: 2,
      content: statContent(spec),
    });
  };

  const compact = () => {
    gridInst.current?.compact();
    setLastAction("Layout compacted");
  };

  const toggleFloat = (checked: boolean) => {
    gridInst.current?.float(checked);
    setFloatOn(checked);
    setLastAction(checked ? "Float mode enabled" : "Float mode disabled");
  };

  const saveLayout = () => {
    const grid = gridInst.current;
    if (!grid) return;
    const layout = grid.save() as GridStackWidget[];
    savedLayout.current = layout;
    setHasSaved(true);
    setSavedJson(
      JSON.stringify(
        layout.map(({ content: _content, ...rest }) => rest),
        null,
        2,
      ),
    );
    setLastAction("Layout saved");
  };

  const restoreLayout = () => {
    const grid = gridInst.current;
    if (!grid || !savedLayout.current) return;
    grid.load(savedLayout.current);
    setLastAction("Layout restored");
  };

  const resetLayout = () => {
    gridInst.current?.load(INITIAL_LAYOUT);
    setFloatOn(false);
    gridInst.current?.float(false);
    setLastAction("Reset to default layout");
  };

  const clearAll = () => {
    gridInst.current?.removeAll();
    setLastAction("All widgets removed");
  };

  return (
    <div className="gs-demo flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
        <Button size="sm" onClick={addWidget}>
          <Plus data-icon="inline-start" />
          Add widget
        </Button>
        <Button size="sm" variant="outline" onClick={compact}>
          <ArrowUpToLine data-icon="inline-start" />
          Compact
        </Button>
        <Separator orientation="vertical" className="h-5!" />
        <div className="flex items-center gap-2 px-1 text-sm">
          <Switch
            size="sm"
            checked={floatOn}
            onCheckedChange={toggleFloat}
            aria-label="Toggle float mode"
          />
          <span>Float</span>
        </div>
        <Separator orientation="vertical" className="h-5!" />
        <Button size="sm" variant="outline" onClick={saveLayout}>
          <Save data-icon="inline-start" />
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!hasSaved}
          onClick={restoreLayout}
        >
          <History data-icon="inline-start" />
          Restore
        </Button>
        <Button size="sm" variant="ghost" onClick={resetLayout}>
          <RotateCcw data-icon="inline-start" />
          Reset
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="font-mono tabular-nums">
            {count} widgets
          </Badge>
          <Button size="sm" variant="destructive" onClick={clearAll}>
            <Trash2 data-icon="inline-start" />
            Clear
          </Button>
        </div>
      </div>

      {/* GridStack owns everything inside this container */}
      <div className="grid-stack -m-2 min-h-32" ref={gridRef} />

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Last action: <span className="text-foreground">{lastAction}</span>
        </span>
        <span>Drag to rearrange · Drag the corner to resize</span>
      </div>

      {savedJson && (
        <details className="rounded-lg border bg-card">
          <summary className="cursor-pointer select-none px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Saved layout JSON
          </summary>
          <pre className="overflow-auto border-t p-4 font-mono text-xs leading-relaxed">
            {savedJson}
          </pre>
        </details>
      )}
    </div>
  );
}
