"use client";

import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type DataRange,
  type DataSegment,
  rangeLabels,
  rangePointCounts,
  segmentLabels,
  signalData,
} from "./data-series";

const width = 760;
const height = 300;
const chart = { left: 46, right: 22, top: 22, bottom: 36 };

export function D3GeometryLab() {
  const [range, setRange] = useState<DataRange>("30d");
  const [segment, setSegment] = useState<DataSegment>("all");
  const reducedMotion = useReducedMotion();

  const geometry = useMemo(() => {
    const data = signalData.slice(-rangePointCounts[range]);
    const values = data.map((datum) => datum[segment]);
    const domain = extent(values) as [number, number];
    const x = scaleLinear()
      .domain([0, data.length - 1])
      .range([chart.left, width - chart.right]);
    const y = scaleLinear()
      .domain([Math.max(0, domain[0] - 8), (max(values) ?? 100) + 6])
      .nice()
      .range([height - chart.bottom, chart.top]);
    const linePath =
      line<(typeof data)[number]>()
        .x((_, index) => x(index))
        .y((datum) => y(datum[segment]))
        .curve(curveMonotoneX)(data) ?? "";
    const areaPath =
      area<(typeof data)[number]>()
        .x((_, index) => x(index))
        .y0(height - chart.bottom)
        .y1((datum) => y(datum[segment]))
        .curve(curveMonotoneX)(data) ?? "";

    return {
      data,
      x,
      y,
      linePath,
      areaPath,
      yTicks: y.ticks(4),
    };
  }, [range, segment]);

  const latest = geometry.data.at(-1);
  const previous = geometry.data.at(-2);
  const delta = latest && previous ? latest[segment] - previous[segment] : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>D3 几何层</Badge>
              <Badge variant="outline">React 持有 DOM</Badge>
              <Badge variant="secondary">Motion 持有过渡</Badge>
            </div>
            <CardTitle className="mt-3">数据变换与渲染职责分离</CardTitle>
            <CardDescription className="mt-1">
              D3 只计算比例尺、路径和 tick；React 负责元素，Motion
              负责状态间过渡。
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-muted-foreground">当前值</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {latest?.[segment] ?? 0}
            </p>
            <p className="text-xs text-primary">
              较上一点 {delta >= 0 ? "+" : ""}
              {delta}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex min-w-0 flex-wrap gap-1.5 border-0 p-0">
            <legend className="sr-only">时间范围</legend>
            {(Object.keys(rangeLabels) as DataRange[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={range === option ? "default" : "outline"}
                onClick={() => setRange(option)}
              >
                {rangeLabels[option]}
              </Button>
            ))}
          </fieldset>
          <fieldset className="flex min-w-0 flex-wrap gap-1.5 border-0 p-0">
            <legend className="sr-only">用户分群</legend>
            {(Object.keys(segmentLabels) as DataSegment[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={segment === option ? "secondary" : "ghost"}
                onClick={() => setSegment(option)}
              >
                {segmentLabels[option]}
              </Button>
            ))}
          </fieldset>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:p-6">
        <div className="overflow-hidden rounded-xl bg-card p-3 ring-1 ring-border">
          <svg
            className="h-auto w-full"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${rangeLabels[range]}${segmentLabels[segment]}趋势图`}
          >
            <defs>
              <linearGradient id="d3-area" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  stopColor="var(--primary)"
                  stopOpacity="0.24"
                />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {geometry.yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={chart.left}
                  x2={width - chart.right}
                  y1={geometry.y(tick)}
                  y2={geometry.y(tick)}
                  stroke="var(--border)"
                  strokeDasharray="4 6"
                />
                <text
                  x={chart.left - 10}
                  y={geometry.y(tick)}
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {tick}
                </text>
              </g>
            ))}
            <motion.path
              initial={false}
              animate={{ d: geometry.areaPath }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.55 }}
              fill="url(#d3-area)"
            />
            <motion.path
              initial={false}
              animate={{ d: geometry.linePath }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.55 }}
              fill="none"
              stroke="var(--primary)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {geometry.data.map((datum, index) => (
              <motion.circle
                key={datum.id}
                initial={false}
                animate={{
                  cx: geometry.x(index),
                  cy: geometry.y(datum[segment]),
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 260, damping: 26 }
                }
                r="4.5"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="3"
              />
            ))}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <p className="font-mono text-[0.68rem] tracking-wider text-muted-foreground uppercase">
              Geometry pipeline
            </p>
            <ol className="mt-3 space-y-3 text-sm">
              {[
                ["01", "d3-array", "范围与汇总"],
                ["02", "d3-scale", "数据到坐标"],
                ["03", "d3-shape", "路径字符串"],
                ["04", "Motion", "状态间插值"],
              ].map(([step, owner, role]) => (
                <li key={step} className="grid grid-cols-[1.5rem_1fr] gap-2">
                  <span className="font-mono text-xs text-primary">{step}</span>
                  <span>
                    <span className="font-medium">{owner}</span>
                    <span className="block text-xs text-muted-foreground">
                      {role}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <p className="text-sm font-medium">语义后备</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              当前筛选为{rangeLabels[range]}、{segmentLabels[segment]}，最新值
              {latest?.[segment] ?? 0}，较上一数据点
              {delta >= 0 ? "上升" : "下降"}
              {Math.abs(delta)}。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
