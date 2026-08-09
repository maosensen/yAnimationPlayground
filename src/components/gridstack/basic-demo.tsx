"use client";

import { GridStack } from "gridstack";
import {
  Activity,
  DollarSign,
  ListChecks,
  Server,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";

import "gridstack/dist/gridstack.min.css";
import "./gridstack-base.css";
import "./gridstack-demo.css";

const SPARK_BARS = [38, 52, 44, 70, 58, 82, 64, 90, 76, 96, 68, 88];

const TASKS = [
  { label: "Ship onboarding flow", done: true },
  { label: "Review Q2 metrics", done: true },
  { label: "Refresh pricing page", done: false },
  { label: "Audit API rate limits", done: false },
];

const SERVICES = [
  { name: "api-gateway", status: "Operational", ok: true },
  { name: "auth-service", status: "Operational", ok: true },
  { name: "worker-queue", status: "Degraded", ok: false },
];

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  delta: string;
  up?: boolean;
};

function StatCard({ icon, title, value, delta, up }: StatCardProps) {
  return (
    <div className="group flex h-full flex-col justify-between p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-4">
            {icon}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        <Badge
          variant="secondary"
          className={
            up
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }
        >
          {delta}
        </Badge>
      </div>
    </div>
  );
}

function PanelHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="group flex items-center justify-between border-b px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-3.5">
          {icon}
        </span>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
}

export default function GridstackBasicDemo() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const grid = GridStack.init(
      {
        cellHeight: 72,
        margin: 8,
        float: false,
        animate: true,
      },
      gridRef.current,
    );
    return () => {
      grid.destroy(false);
    };
  }, []);

  return (
    <div className="gs-demo flex flex-col gap-4">
      <div className="grid-stack -m-2" ref={gridRef}>
        <div className="grid-stack-item" gs-x="0" gs-y="0" gs-w="4" gs-h="2">
          <div className="grid-stack-item-content">
            <StatCard
              icon={<DollarSign />}
              title="Revenue"
              value="$128,420"
              delta="+12.3%"
              up
            />
          </div>
        </div>

        <div className="grid-stack-item" gs-x="4" gs-y="0" gs-w="4" gs-h="2">
          <div className="grid-stack-item-content">
            <StatCard
              icon={<Users />}
              title="Active users"
              value="8,549"
              delta="+4.1%"
              up
            />
          </div>
        </div>

        <div className="grid-stack-item" gs-x="8" gs-y="0" gs-w="4" gs-h="2">
          <div className="grid-stack-item-content">
            <StatCard
              icon={<TrendingUp />}
              title="Conversion"
              value="3.42%"
              delta="-0.8%"
            />
          </div>
        </div>

        <div className="grid-stack-item" gs-x="0" gs-y="2" gs-w="6" gs-h="4">
          <div className="grid-stack-item-content">
            <PanelHeader icon={<Activity />} title="Weekly traffic" />
            <div className="flex flex-1 items-end gap-2 p-4">
              {SPARK_BARS.map((h, i) => (
                <div
                  key={`bar-${i.toString()}`}
                  className="flex-1 rounded-sm bg-primary/70 transition-colors hover:bg-primary"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid-stack-item" gs-x="6" gs-y="2" gs-w="3" gs-h="4">
          <div className="grid-stack-item-content">
            <PanelHeader icon={<ListChecks />} title="Tasks" />
            <ul className="flex flex-col gap-2.5 p-4 text-sm">
              {TASKS.map((task) => (
                <li key={task.label} className="flex items-center gap-2.5">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      task.done ? "bg-emerald-500" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={
                      task.done ? "text-muted-foreground line-through" : ""
                    }
                  >
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid-stack-item" gs-x="9" gs-y="2" gs-w="3" gs-h="4">
          <div className="grid-stack-item-content">
            <PanelHeader icon={<Server />} title="Services" />
            <ul className="flex flex-col gap-3 p-4 text-sm">
              {SERVICES.map((svc) => (
                <li
                  key={svc.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="font-mono text-xs">{svc.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={`size-1.5 rounded-full ${
                        svc.ok ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {svc.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Drag a card to rearrange · Drag the bottom-right corner to resize
      </p>
    </div>
  );
}
