"use client";

import { GridStack, type GridStackOptions } from "gridstack";
import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import "gridstack/dist/gridstack.min.css";
import "./gridstack-base.css";
import "./grid-board.css";

/**
 * Reusable Gridstack dashboard board — the single place the house grid
 * behavior and chrome live, so a page never writes grid CSS or init
 * boilerplate. Render `<GridBoard widgets={...} />` with each widget's `node`
 * a `<Card>` (the board keeps the cell chrome-less, so the Card owns the
 * surface) and you get the same drag / resize behavior and look as everywhere
 * else — whole-card drag, SE corner-grip resize, 1-column below `md`.
 *
 * Need custom markup instead of the widgets array? Use the {@link useGridBoard}
 * tool directly: it runs GridStack.init with the house defaults on a container
 * ref and tears it down on unmount. {@link GRID_BOARD_DEFAULTS} and
 * {@link GRID_DRAG_CANCEL} are exported for one-off tweaks.
 */

/** Interactive descendants that must NOT start a drag (so clicks reach them). */
export const GRID_DRAG_CANCEL = [
  ".no-drag",
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role=button]",
  "[role=menuitem]",
  "[role=combobox]",
  "[data-slot=dropdown-menu-trigger]",
  "[data-slot=checkbox]",
  "[data-slot=card-action]",
  ".recharts-wrapper",
  "[data-no-drag]",
].join(", ");

/** House grid defaults: whole-card drag, SE resize, 12 columns, 1 col below md. */
export const GRID_BOARD_DEFAULTS: GridStackOptions = {
  column: 12,
  cellHeight: 80,
  margin: 12,
  float: false,
  animate: true,
  draggable: { cancel: GRID_DRAG_CANCEL, appendTo: "body", scroll: true },
  resizable: { handles: "se" },
  columnOpts: {
    columnMax: 12,
    breakpointForWindow: true,
    breakpoints: [{ w: 768, c: 1 }],
    layout: "list",
  },
};

/**
 * The tool: initialize GridStack on a container ref with the house defaults
 * (shallow-merged with `options`) and destroy it on unmount. Init runs once —
 * options are read at mount, so pass a stable object.
 */
export function useGridBoard(options?: GridStackOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!ref.current) return;
    const grid = GridStack.init(
      { ...GRID_BOARD_DEFAULTS, ...optionsRef.current },
      ref.current,
    );
    return () => {
      grid.destroy(false);
    };
  }, []);

  return ref;
}

export type GridBoardWidget = {
  id: string;
  /** Human label — used by show/hide controls (e.g. the dashboard toolbar). */
  label?: string;
  /** Column span (out of 12). */
  w: number;
  /** Row span (× cellHeight). */
  h: number;
  /** Explicit column / row origin; omit to let GridStack auto-place. */
  x?: number;
  y?: number;
  /** Minimum column / row span when resized. */
  minW?: number;
  minH?: number;
  /** Cell content — use a `<Card>` for the standard surface. */
  node: ReactNode;
};

export function GridBoard({
  widgets,
  options,
  className,
}: {
  widgets: GridBoardWidget[];
  /** Shallow-merged over GRID_BOARD_DEFAULTS. */
  options?: GridStackOptions;
  /** Extra classes on the grid container (e.g. a different gutter offset). */
  className?: string;
}) {
  const ref = useGridBoard(options);

  return (
    // -m-3 cancels the 12px outer margin so the board aligns with a padded
    // parent (PageContainer). Override via className if you change `margin`.
    <div className={cn("grid-board grid-stack -m-3", className)} ref={ref}>
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="grid-stack-item"
          gs-id={widget.id}
          gs-w={String(widget.w)}
          gs-h={String(widget.h)}
          gs-x={widget.x !== undefined ? String(widget.x) : undefined}
          gs-y={widget.y !== undefined ? String(widget.y) : undefined}
          gs-min-w={widget.minW !== undefined ? String(widget.minW) : undefined}
          gs-min-h={widget.minH !== undefined ? String(widget.minH) : undefined}
        >
          <div className="grid-stack-item-content">{widget.node}</div>
        </div>
      ))}
    </div>
  );
}
