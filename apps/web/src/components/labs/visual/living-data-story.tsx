"use client";

import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import type { AnimationItem } from "lottie-web";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import signalPulse from "@/assets/animations/signal-pulse.json";
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

type Emphasis = "growth" | "retention" | "latency";

const emphasisLabels: Record<Emphasis, string> = {
  growth: "增长",
  retention: "留存",
  latency: "延迟",
};
const width = 900;
const height = 360;
const plot = { left: 52, right: 24, top: 28, bottom: 42 };

export function LivingDataStory() {
  const [range, setRange] = useState<DataRange>("30d");
  const [segment, setSegment] = useState<DataSegment>("all");
  const [emphasis, setEmphasis] = useState<Emphasis>("growth");
  const reduceMotion = useReducedMotion();
  const cueRef = useRef<AnimationItem | null>(null);

  const story = useMemo(() => {
    const data = signalData.slice(-rangePointCounts[range]);
    const values = data.map((datum) => datum[segment]);
    const x = scaleLinear()
      .domain([0, data.length - 1])
      .range([plot.left, width - plot.right]);
    const y = scaleLinear()
      .domain([0, (max(values) ?? 100) + 12])
      .nice()
      .range([height - plot.bottom, plot.top]);
    const linePath =
      line<(typeof data)[number]>()
        .x((_, index) => x(index))
        .y((datum) => y(datum[segment]))
        .curve(curveMonotoneX)(data) ?? "";
    const areaPath =
      area<(typeof data)[number]>()
        .x((_, index) => x(index))
        .y0(height - plot.bottom)
        .y1((datum) => y(datum[segment]))
        .curve(curveMonotoneX)(data) ?? "";
    const first = data[0];
    const latest = data.at(-1);
    const change = first && latest ? latest[segment] - first[segment] : 0;
    const averageRetention = Math.round(
      data.reduce((sum, datum) => sum + datum.retention, 0) / data.length,
    );
    const averageLatency = Math.round(
      data.reduce((sum, datum) => sum + datum.latency, 0) / data.length,
    );

    return {
      data,
      x,
      y,
      linePath,
      areaPath,
      latest,
      change,
      averageRetention,
      averageLatency,
    };
  }, [range, segment]);

  function selectRange(option: DataRange) {
    setRange(option);
    cueRef.current?.goToAndPlay(0, true);
  }

  function selectSegment(option: DataSegment) {
    setSegment(option);
    cueRef.current?.goToAndPlay(0, true);
  }

  function selectEmphasis(option: Emphasis) {
    setEmphasis(option);
    cueRef.current?.goToAndPlay(0, true);
  }

  const insight =
    emphasis === "growth"
      ? `${rangeLabels[range]}内${segmentLabels[segment]}净变化为 ${story.change >= 0 ? "+" : ""}${story.change}。`
      : emphasis === "retention"
        ? `${rangeLabels[range]}内平均留存为 ${story.averageRetention}%。`
        : `${rangeLabels[range]}内平均响应延迟为 ${story.averageLatency}ms。`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative overflow-hidden border-b border-border bg-card">
        <AmbientCanvas staticMode={Boolean(reduceMotion)} />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <Badge>D3 geometry</Badge>
              <Badge variant="outline">Motion transition</Badge>
              <Badge variant="secondary">Canvas atmosphere</Badge>
              <Badge variant="outline">Lottie cue</Badge>
            </div>
            <CardTitle className="mt-4 text-2xl">Living Data Story</CardTitle>
            <CardDescription className="mt-2 max-w-xl leading-6">
              一个可筛选的数据叙事：每个图层只承担自己擅长的职责，应用状态仍由
              React 统一管理。
            </CardDescription>
          </div>
          <LottieCue animationRef={cueRef} staticMode={Boolean(reduceMotion)} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 bg-muted/25 p-4 lg:p-6">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
          <ControlGroup label="时间范围">
            {(Object.keys(rangeLabels) as DataRange[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={range === option ? "default" : "outline"}
                onClick={() => selectRange(option)}
              >
                {rangeLabels[option]}
              </Button>
            ))}
          </ControlGroup>
          <ControlGroup label="用户分群">
            {(Object.keys(segmentLabels) as DataSegment[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={segment === option ? "secondary" : "ghost"}
                onClick={() => selectSegment(option)}
              >
                {segmentLabels[option]}
              </Button>
            ))}
          </ControlGroup>
          <ControlGroup label="叙事重点">
            {(Object.keys(emphasisLabels) as Emphasis[]).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={emphasis === option ? "secondary" : "ghost"}
                onClick={() => selectEmphasis(option)}
              >
                {emphasisLabels[option]}
              </Button>
            ))}
          </ControlGroup>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="overflow-hidden rounded-xl bg-card p-3 ring-1 ring-border">
            <svg
              className="h-auto w-full"
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`${rangeLabels[range]}${segmentLabels[segment]}增长趋势`}
            >
              <defs>
                <linearGradient id="living-area" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0"
                    stopColor="var(--primary)"
                    stopOpacity="0.28"
                  />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {story.y.ticks(4).map((tick) => (
                <g key={tick}>
                  <line
                    x1={plot.left}
                    x2={width - plot.right}
                    y1={story.y(tick)}
                    y2={story.y(tick)}
                    stroke="var(--border)"
                    strokeDasharray="4 7"
                  />
                  <text
                    x={plot.left - 10}
                    y={story.y(tick)}
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
                animate={{ d: story.areaPath }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55 }}
                fill="url(#living-area)"
              />
              <motion.path
                initial={false}
                animate={{ d: story.linePath }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55 }}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {story.data.map((datum, index) => (
                <motion.circle
                  key={datum.id}
                  initial={false}
                  animate={{
                    cx: story.x(index),
                    cy: story.y(datum[segment]),
                    r: index === story.data.length - 1 ? 6 : 3.5,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 260, damping: 26 }
                  }
                  fill="var(--card)"
                  stroke="var(--primary)"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>

          <div className="space-y-3">
            <StoryMetric
              label="最新指数"
              value={`${story.latest?.[segment] ?? 0}`}
              active={emphasis === "growth"}
            />
            <StoryMetric
              label="平均留存"
              value={`${story.averageRetention}%`}
              active={emphasis === "retention"}
            />
            <StoryMetric
              label="平均延迟"
              value={`${story.averageLatency}ms`}
              active={emphasis === "latency"}
            />
            <motion.div
              layout
              className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20"
              aria-live="polite"
            >
              <p className="font-medium">当前洞察</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {insight}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
          {[
            ["D3", "把数据转换为比例尺、路径和刻度。"],
            ["Motion", "对 React 状态变化产生的几何值做过渡。"],
            ["Canvas", "绘制无语义、高密度的环境粒子。"],
            ["Lottie", "播放设计师预先编排的状态提示。"],
          ].map(([runtime, role]) => (
            <div
              key={runtime}
              className="rounded-lg bg-card p-4 ring-1 ring-border"
            >
              <p className="font-mono text-xs text-primary">{runtime}</p>
              <p className="mt-2 leading-5 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex min-w-0 flex-wrap items-center gap-1.5 border-0 p-0">
      <legend className="mr-2 float-left text-xs text-muted-foreground">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function StoryMetric({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={
        active
          ? "rounded-lg bg-primary p-4 text-primary-foreground"
          : "rounded-lg bg-card p-4 ring-1 ring-border"
      }
    >
      <p
        className={
          active
            ? "text-xs text-primary-foreground/70"
            : "text-xs text-muted-foreground"
        }
      >
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function LottieCue({
  animationRef,
  staticMode,
}: {
  animationRef: React.MutableRefObject<AnimationItem | null>;
  staticMode: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function mount() {
      const lottie = (await import("lottie-web/build/player/lottie_light"))
        .default;
      if (cancelled || !containerRef.current) return;
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: !staticMode,
        animationData: signalPulse,
      });
      animationRef.current = animation;
      if (staticMode) animation.goToAndStop(179, true);
    }
    void mount();
    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [animationRef, staticMode]);

  return <div ref={containerRef} className="size-24 shrink-0" aria-hidden />;
}

function AmbientCanvas({ staticMode }: { staticMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const renderingContext = canvasElement?.getContext("2d");
    if (!canvasElement || !renderingContext) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = renderingContext;
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const primary = getComputedStyle(canvas)
      .getPropertyValue("--primary")
      .trim();
    const particles = Array.from({ length: 54 }, (_, index) => ({
      x: ((index * 83) % 997) / 997,
      y: ((index * 47) % 503) / 503,
      speed: 0.03 + (index % 5) * 0.008,
    }));

    function draw(now = 0) {
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = primary;
      for (const particle of particles) {
        const y =
          ((particle.y + now * 0.00001 * particle.speed) % 1) * rect.height;
        context.globalAlpha = 0.08 + particle.speed;
        context.beginPath();
        context.arc(particle.x * rect.width, y, 1.5, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!staticMode) frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [staticMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden
    />
  );
}
