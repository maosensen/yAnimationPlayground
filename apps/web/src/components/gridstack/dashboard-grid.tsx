"use client";

import { useState } from "react";
import EarningReportChart from "@/components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart";
import SalesOverviewChart from "@/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart";
import SalesByCountryWidget from "@/components/shadcn-space/blocks/dashboard-shell-01/salesbycountrywidget";
import {
  StatRevenueCard,
  StatSecondaryCard,
  secondaryStatsData,
} from "@/components/shadcn-space/blocks/dashboard-shell-01/statistics";
import TopProductTable from "@/components/shadcn-space/blocks/dashboard-shell-01/top-product-table";
import { DashboardToolbar } from "./dashboard-toolbar";
import { GridBoard, type GridBoardWidget } from "./grid-board";

/**
 * The analytics dashboard as a Gridstack board — a widget list handed to the
 * reusable <GridBoard>, plus a toolbar whose Customize panel shows / hides each
 * widget (all shown by default) and resets. Every widget is a <Card>, so the
 * board keeps the cells chrome-less and the cards own their surface. Heights
 * are tuned to each widget's natural content (× cellHeight 80) so nothing clips
 * at the default size; users resize from there.
 */
const WIDGETS: GridBoardWidget[] = [
  {
    id: "stat-revenue",
    label: "Revenue",
    w: 6,
    h: 3,
    minW: 4,
    minH: 2,
    node: <StatRevenueCard />,
  },
  {
    id: "stat-weekly",
    label: "Weekly sales",
    w: 3,
    h: 3,
    minW: 2,
    minH: 2,
    node: <StatSecondaryCard stat={secondaryStatsData[0]} />,
  },
  {
    id: "stat-orders",
    label: "Purchase orders",
    w: 3,
    h: 3,
    minW: 2,
    minH: 2,
    node: <StatSecondaryCard stat={secondaryStatsData[1]} />,
  },
  {
    id: "sales",
    label: "Sales overview",
    w: 8,
    h: 6,
    minW: 4,
    minH: 4,
    node: <SalesOverviewChart />,
  },
  {
    id: "earning",
    label: "Earnings report",
    w: 4,
    h: 6,
    minW: 3,
    minH: 4,
    node: <EarningReportChart />,
  },
  {
    id: "top",
    label: "Top products",
    w: 8,
    h: 8,
    minW: 4,
    minH: 4,
    node: <TopProductTable />,
  },
  {
    id: "country",
    label: "Sales by country",
    w: 4,
    h: 8,
    minW: 3,
    minH: 4,
    node: <SalesByCountryWidget />,
  },
];

const TOOLBAR_ITEMS = WIDGETS.map((w) => ({
  id: w.id,
  label: w.label ?? w.id,
}));

export function DashboardGrid() {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const reset = () => setHidden(new Set());

  const visible = WIDGETS.filter((w) => !hidden.has(w.id));

  return (
    <div className="space-y-4">
      <DashboardToolbar
        widgets={TOOLBAR_ITEMS}
        hidden={hidden}
        onToggle={toggle}
        onReset={reset}
      />
      {/* Key on the visible set so GridStack re-inits cleanly when widgets are
          shown / hidden — it owns the DOM after init, so React can't safely
          remove items from under it. */}
      <GridBoard
        key={visible.map((w) => w.id).join("|") || "empty"}
        widgets={visible}
      />
    </div>
  );
}
