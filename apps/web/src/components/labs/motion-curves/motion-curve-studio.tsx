"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  criticalSpringPosition,
  criticalSpringVelocity,
  cubicBezierProgress,
  cubicBezierSlope,
  isSpringSettled,
  responseDuration,
  type ScalarSegment,
} from "./critical-spring";

type Channel = "x" | "y" | "scale";
type MotionValue = Record<Channel, number>;

type TargetPreset = MotionValue & {
  id: "overview" | "detail-a" | "detail-b" | "cursor";
  label: string;
};

type RuntimeState = {
  active: boolean;
  durationSeconds: number;
  omega: number;
  segments: Record<Channel, ScalarSegment>;
  startedAt: number;
  target: MotionValue;
  value: MotionValue;
  velocity: MotionValue;
};

type RuntimeSnapshot = {
  speed: number;
  value: MotionValue;
  velocity: MotionValue;
};

type Telemetry = {
  bezier: RuntimeSnapshot;
  spring: RuntimeSnapshot;
};

const channels: Channel[] = ["x", "y", "scale"];
const initialValue: MotionValue = { x: 0, y: 0, scale: 1 };
const initialSnapshot: RuntimeSnapshot = {
  speed: 0,
  value: initialValue,
  velocity: { x: 0, y: 0, scale: 0 },
};

const decisionRows = [
  {
    dimension: "中途改目标",
    bezier: "从当前值重新计时",
    spring: "从 position + velocity 重新求解",
  },
  {
    dimension: "速度连续性",
    bezier: "重置为新曲线的起始速度，通常与当前速度不连续",
    spring: "继承瞬时速度，方向变化仍连续",
  },
  {
    dimension: "逐帧渲染",
    bezier: "按固定时间函数采样",
    spring: "闭式解直接求任意时刻状态",
  },
  {
    dimension: "适合场景",
    bezier: "已知起止点的短 UI 过渡",
    spring: "镜头跟随、拖拽、连续 zoom / pan",
  },
];

export function MotionCurveStudio() {
  const springCanvasRef = useRef<HTMLDivElement>(null);
  const bezierCanvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sequenceTimeoutsRef = useRef<number[]>([]);
  const lastTelemetryRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const [omega, setOmega] = useState(7.5);
  const [zoom, setZoom] = useState(1.85);
  const [pan, setPan] = useState(18);
  const [initialVelocity, setInitialVelocity] = useState(0);
  const [inheritVelocity, setInheritVelocity] = useState(true);
  const [motionBlur, setMotionBlur] = useState(true);
  const [activeTarget, setActiveTarget] =
    useState<TargetPreset["id"]>("overview");
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    bezier: initialSnapshot,
    spring: initialSnapshot,
  });

  const springStateRef = useRef(createRuntimeState());
  const bezierStateRef = useRef(createRuntimeState());
  const settingsRef = useRef({
    inheritVelocity,
    initialVelocity,
    motionBlur,
    omega,
    reducedMotion,
  });

  settingsRef.current = {
    inheritVelocity,
    initialVelocity,
    motionBlur,
    omega,
    reducedMotion,
  };

  const targets = useMemo<TargetPreset[]>(
    () => [
      { id: "overview", label: "全景", x: 0, y: 0, scale: 1 },
      {
        id: "detail-a",
        label: "左上细节",
        x: pan,
        y: pan * 0.58,
        scale: zoom,
      },
      {
        id: "detail-b",
        label: "右侧细节",
        x: -pan * 0.82,
        y: -pan * 0.35,
        scale: Math.max(1.1, zoom * 0.9),
      },
      {
        id: "cursor",
        label: "光标跟随",
        x: pan * 0.2,
        y: -pan * 0.78,
        scale: Math.min(2.6, zoom * 1.08),
      },
    ],
    [pan, zoom],
  );
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  const renderFrame = useCallback((now: number) => {
    const springState = springStateRef.current;
    const bezierState = bezierStateRef.current;
    const currentSettings = settingsRef.current;

    if (springState.active) {
      const elapsedSeconds = Math.max(0, (now - springState.startedAt) / 1000);

      for (const channel of channels) {
        springState.value[channel] = criticalSpringPosition(
          elapsedSeconds,
          springState.segments[channel],
          springState.omega,
        );
        springState.velocity[channel] = criticalSpringVelocity(
          elapsedSeconds,
          springState.segments[channel],
          springState.omega,
        );
      }

      springState.active = !channels.every((channel) =>
        isSpringSettled(
          springState.value[channel],
          springState.target[channel],
          springState.velocity[channel],
          channel === "scale" ? 0.0005 : 0.02,
          channel === "scale" ? 0.002 : 0.08,
        ),
      );

      if (!springState.active) snapRuntimeToTarget(springState);
    }

    if (bezierState.active) {
      const elapsedSeconds = Math.max(0, (now - bezierState.startedAt) / 1000);
      const progress = Math.min(
        1,
        elapsedSeconds / bezierState.durationSeconds,
      );
      const eased = cubicBezierProgress(progress);

      for (const channel of channels) {
        const segment = bezierState.segments[channel];
        bezierState.value[channel] =
          segment.from + (segment.to - segment.from) * eased;
        bezierState.velocity[channel] =
          ((segment.to - segment.from) * cubicBezierSlope(progress)) /
          bezierState.durationSeconds;
      }

      if (progress >= 1) {
        bezierState.active = false;
        snapRuntimeToTarget(bezierState);
      }
    }

    applyCanvasState(
      springCanvasRef.current,
      springState,
      currentSettings.motionBlur && !currentSettings.reducedMotion,
    );
    applyCanvasState(
      bezierCanvasRef.current,
      bezierState,
      currentSettings.motionBlur && !currentSettings.reducedMotion,
    );

    if (now - lastTelemetryRef.current > 50) {
      lastTelemetryRef.current = now;
      setTelemetry({
        bezier: snapshotRuntime(bezierState),
        spring: snapshotRuntime(springState),
      });
    }

    if (springState.active || bezierState.active) {
      animationFrameRef.current = window.requestAnimationFrame(renderFrame);
    } else {
      animationFrameRef.current = null;
      setSequenceRunning(false);
    }
  }, []);

  const startAnimationLoop = useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(renderFrame);
    }
  }, [renderFrame]);

  const retarget = useCallback(
    (target: TargetPreset) => {
      setActiveTarget(target.id);
      const currentSettings = settingsRef.current;

      if (currentSettings.reducedMotion) {
        setRuntimeTarget(springStateRef.current, target, performance.now());
        setRuntimeTarget(bezierStateRef.current, target, performance.now());
        snapRuntimeToTarget(springStateRef.current);
        snapRuntimeToTarget(bezierStateRef.current);
        applyCanvasState(
          springCanvasRef.current,
          springStateRef.current,
          false,
        );
        applyCanvasState(
          bezierCanvasRef.current,
          bezierStateRef.current,
          false,
        );
        setTelemetry({
          bezier: snapshotRuntime(bezierStateRef.current),
          spring: snapshotRuntime(springStateRef.current),
        });
        return;
      }

      const now = performance.now();
      const springState = springStateRef.current;
      const bezierState = bezierStateRef.current;
      const springWasMoving = springState.active;

      springState.target = pickMotionValue(target);
      springState.startedAt = now;
      springState.omega = currentSettings.omega;
      springState.durationSeconds = responseDuration(currentSettings.omega);
      springState.active = true;
      bezierState.target = pickMotionValue(target);
      bezierState.startedAt = now;
      bezierState.durationSeconds = responseDuration(currentSettings.omega);
      bezierState.active = true;

      for (const channel of channels) {
        const springDistance = target[channel] - springState.value[channel];
        const configuredVelocity =
          springDistance * currentSettings.initialVelocity;
        const nextVelocity =
          currentSettings.inheritVelocity && springWasMoving
            ? springState.velocity[channel]
            : configuredVelocity;

        springState.segments[channel] = {
          from: springState.value[channel],
          to: target[channel],
          velocity: nextVelocity,
        };
        bezierState.segments[channel] = {
          from: bezierState.value[channel],
          to: target[channel],
          velocity: 0,
        };
        bezierState.velocity[channel] =
          ((target[channel] - bezierState.value[channel]) *
            cubicBezierSlope(0)) /
          bezierState.durationSeconds;
      }

      startAnimationLoop();
    },
    [startAnimationLoop],
  );

  const cancelSequence = useCallback(() => {
    for (const timeout of sequenceTimeoutsRef.current) {
      window.clearTimeout(timeout);
    }
    sequenceTimeoutsRef.current = [];
    setSequenceRunning(false);
  }, []);

  const chooseTarget = (target: TargetPreset) => {
    cancelSequence();
    retarget(target);
  };

  const runInterruptionSequence = () => {
    cancelSequence();
    setSequenceRunning(true);
    const sequence: Array<[number, TargetPreset["id"]]> = [
      [0, "detail-a"],
      [430, "detail-b"],
      [810, "cursor"],
      [1280, "overview"],
    ];

    sequenceTimeoutsRef.current = sequence.map(([delay, targetId]) =>
      window.setTimeout(() => {
        const target = targetsRef.current.find((item) => item.id === targetId);
        if (target) retarget(target);
      }, delay),
    );
  };

  useEffect(() => {
    applyCanvasState(springCanvasRef.current, springStateRef.current, false);
    applyCanvasState(bezierCanvasRef.current, bezierStateRef.current, false);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      for (const timeout of sequenceTimeoutsRef.current) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>临界阻尼弹簧</Badge>
            <Badge variant="outline">ζ = 1</Badge>
            <Badge variant="outline">闭式解</Badge>
            {reducedMotion ? (
              <Badge variant="secondary">系统减少动效：直接到达目标</Badge>
            ) : null}
          </div>
          <Button
            type="button"
            size="sm"
            variant={sequenceRunning ? "secondary" : "default"}
            onClick={runInterruptionSequence}
            disabled={reducedMotion}
          >
            <span
              className="icon-[solar--play-circle-bold-duotone] size-4"
              aria-hidden
            />
            连续重定向测试
          </Button>
        </div>

        <div className="grid lg:grid-cols-2">
          <RuntimePreview
            title="Spring / 状态机"
            description={
              inheritVelocity
                ? "新目标继承当前 position + velocity"
                : "新目标重置为配置的初速度"
            }
            canvasRef={springCanvasRef}
            snapshot={telemetry.spring}
            accent="primary"
          />
          <RuntimePreview
            title="Bezier / 静态映射"
            description="每次重定向都从新的 0% 重新计时"
            canvasRef={bezierCanvasRef}
            snapshot={telemetry.bezier}
            accent="chart"
            className="border-t lg:border-t-0 lg:border-l"
          />
        </div>

        <div className="border-t p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {targets.map((target) => (
              <Button
                key={target.id}
                type="button"
                size="sm"
                aria-pressed={activeTarget === target.id}
                variant={activeTarget === target.id ? "secondary" : "ghost"}
                onClick={() => chooseTarget(target)}
              >
                {target.label}
              </Button>
            ))}
          </div>

          <div className="mt-5 grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
            <ParameterSlider
              id="omega"
              label="响应速度 ω"
              value={omega}
              valueLabel={`${omega.toFixed(1)} s⁻¹`}
              min={4}
              max={12}
              step={0.1}
              hint="Spring 参数；Bezier 比较时长 = 9 / ω"
              onValueChange={setOmega}
            />
            <ParameterSlider
              id="zoom"
              label="目标缩放"
              value={zoom}
              valueLabel={`${zoom.toFixed(2)}×`}
              min={1.2}
              max={2.4}
              step={0.05}
              hint="与 pan 共享同一个 ω"
              onValueChange={setZoom}
            />
            <ParameterSlider
              id="pan"
              label="平移幅度"
              value={pan}
              valueLabel={`${pan.toFixed(0)}%`}
              min={8}
              max={28}
              step={1}
              hint="x / y 通道独立求解"
              onValueChange={setPan}
            />
            <ParameterSlider
              id="velocity"
              label="初速度 v₀"
              value={initialVelocity}
              valueLabel={`${initialVelocity.toFixed(1)} d/s`}
              min={-1.5}
              max={2}
              step={0.1}
              hint="d/s = 每秒目标距离倍数"
              onValueChange={setInitialVelocity}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t pt-4">
            <SwitchControl
              id="inherit-velocity"
              label="重定向时继承当前速度"
              checked={inheritVelocity}
              onCheckedChange={setInheritVelocity}
            />
            <SwitchControl
              id="motion-blur"
              label="按瞬时速度添加模糊近似"
              checked={motionBlur}
              onCheckedChange={setMotionBlur}
            />
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>同一比较时长下的位置与速度</CardTitle>
          <CardDescription>
            Bezier 不使用 ω；这里只把它的时长设为 9 /
            ω。位移曲线看“到哪里”，速度曲线看“怎样到达”。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <ResponseChart
            mode="position"
            omega={omega}
            initialVelocity={initialVelocity}
          />
          <ResponseChart
            mode="velocity"
            omega={omega}
            initialVelocity={initialVelocity}
          />
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>为什么 Screen Studio 式 zoom 更像弹簧</CardTitle>
            <CardDescription>
              cubic-bezier
              只描述时间到进度；弹簧描述的是随时间演化的位置与速度状态。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y rounded-lg bg-muted/30 ring-1 ring-border">
              {decisionRows.map((row) => (
                <div
                  key={row.dimension}
                  className="grid gap-2 p-4 text-sm md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-5"
                >
                  <strong>{row.dimension}</strong>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Bezier
                    </span>
                    <p className="mt-1">{row.bezier}</p>
                  </div>
                  <div>
                    <span className="text-xs text-primary">Spring</span>
                    <p className="mt-1">{row.spring}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>逐帧渲染公式</CardTitle>
            <CardDescription>
              每一帧直接求值，不依赖前一帧积分，因此适合 Playwright、Remotion
              或自定义渲染管线。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-muted/40 p-4 font-mono text-xs leading-6 ring-1 ring-border">
              <code>
                {
                  "x(t) = target + (x₀ + c₂t)e^(-ωt)\nc₂ = v₀ + ωx₀\n\nv(t) = [c₂ - ω(x₀ + c₂t)]e^(-ωt)"
                }
              </code>
            </pre>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>scale、x、y 各自求解，但必须共享同一个 ω。</li>
              <li>打断时把当前速度作为下一段 v₀，运动才不会重新起步。</li>
              <li>
                页面中的 blur 只是速度大小诊断；正式渲染应把速度向量映射为方向性
                motion blur。
              </li>
              <li>
                必须静态近似时，可使用{" "}
                <code className="font-mono text-foreground">
                  cubic-bezier(0.25, 1, 0.3, 1)
                </code>
                。
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function RuntimePreview({
  accent,
  canvasRef,
  className,
  description,
  snapshot,
  title,
}: {
  accent: "primary" | "chart";
  canvasRef: RefObject<HTMLDivElement | null>;
  className?: string;
  description: string;
  snapshot: RuntimeSnapshot;
  title: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="text-right font-mono text-xs tabular-nums">
          <p
            className={
              accent === "primary" ? "text-primary" : "text-[var(--chart-1)]"
            }
          >
            {snapshot.value.scale.toFixed(3)}×
          </p>
          <p className="mt-1 text-muted-foreground">
            |v| {snapshot.speed.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="relative aspect-video overflow-hidden bg-muted/20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-px w-full bg-border/60" />
          <span className="absolute h-full w-px bg-border/60" />
        </div>
        <div
          ref={canvasRef}
          className="absolute inset-[8%] origin-center will-change-[transform,filter]"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-lg bg-background ring-1 ring-border">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                <span className="size-1.5 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[0.55rem] text-muted-foreground">
                PRODUCT CANVAS
              </span>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-[0.28fr_0.72fr]">
              <div className="border-r p-3">
                <div className="h-2 w-10 rounded-full bg-primary/70" />
                <div className="mt-4 space-y-2">
                  {[72, 48, 64, 38].map((width) => (
                    <div
                      key={width}
                      className="h-1.5 rounded-full bg-muted"
                      style={{ width: `${String(width)}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div className="col-span-2 flex items-end justify-between rounded-md bg-primary/10 p-3 ring-1 ring-primary/20">
                  <div>
                    <div className="h-2 w-14 rounded-full bg-primary" />
                    <div className="mt-2 h-1.5 w-24 rounded-full bg-primary/30" />
                  </div>
                  <div className="size-8 rounded-md bg-primary/20 ring-1 ring-primary/30" />
                </div>
                <div className="rounded-md bg-muted/50 p-3 ring-1 ring-border">
                  <div className="h-1.5 w-10 rounded-full bg-foreground/70" />
                  <div className="mt-4 h-8 rounded-sm bg-background" />
                </div>
                <div className="rounded-md bg-muted/50 p-3 ring-1 ring-border">
                  <div className="h-1.5 w-12 rounded-full bg-foreground/70" />
                  <div className="mt-4 flex h-8 items-end gap-1">
                    {[42, 72, 54, 88, 62].map((height) => (
                      <span
                        key={height}
                        className="flex-1 rounded-t-sm bg-primary/50"
                        style={{ height: `${String(height)}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="pointer-events-none absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-primary/70 after:absolute after:inset-[5px] after:rounded-full after:bg-primary" />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t px-4 py-3 font-mono text-[0.68rem] tabular-nums text-muted-foreground sm:px-5">
        <span>x {snapshot.value.x.toFixed(2)}%</span>
        <span>y {snapshot.value.y.toFixed(2)}%</span>
        <span className="text-right">
          vₛ {snapshot.velocity.scale.toFixed(3)}
        </span>
      </div>
    </div>
  );
}

function ParameterSlider({
  hint,
  id,
  label,
  max,
  min,
  onValueChange,
  step,
  value,
  valueLabel,
}: {
  hint: string;
  id: string;
  label: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  step: number;
  value: number;
  valueLabel: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output className="font-mono tabular-nums text-primary">
          {valueLabel}
        </output>
      </div>
      <Slider
        id={id}
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([nextValue]) => onValueChange(nextValue ?? value)}
      />
      <p className="mt-2 text-[0.68rem] text-muted-foreground">{hint}</p>
    </div>
  );
}

function SwitchControl({
  checked,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 text-sm">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <span>{label}</span>
    </label>
  );
}

function ResponseChart({
  initialVelocity,
  mode,
  omega,
}: {
  initialVelocity: number;
  mode: "position" | "velocity";
  omega: number;
}) {
  const width = 640;
  const height = 220;
  const padding = { bottom: 30, left: 42, right: 18, top: 18 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const durationSeconds = responseDuration(omega);
  const samples = 120;
  const springSegment: ScalarSegment = {
    from: 0,
    to: 1,
    velocity: initialVelocity,
  };

  const springValues = Array.from({ length: samples + 1 }, (_, index) => {
    const time = (index / samples) * durationSeconds;
    return mode === "position"
      ? criticalSpringPosition(time, springSegment, omega)
      : criticalSpringVelocity(time, springSegment, omega);
  });
  const bezierPositions = Array.from({ length: samples + 1 }, (_, index) =>
    cubicBezierProgress(index / samples),
  );
  const bezierValues =
    mode === "position"
      ? bezierPositions
      : bezierPositions.map((value, index) => {
          const previous = bezierPositions[Math.max(0, index - 1)] ?? value;
          const next = bezierPositions[Math.min(samples, index + 1)] ?? value;
          return (
            (next - previous) /
            ((Math.min(samples, index + 1) - Math.max(0, index - 1)) /
              samples) /
            durationSeconds
          );
        });

  const allValues = [...springValues, ...bezierValues];
  const rawMinimum = Math.min(...allValues);
  const rawMaximum = Math.max(...allValues);
  const minimum = mode === "position" ? Math.min(0, rawMinimum) : rawMinimum;
  const maximum = mode === "position" ? Math.max(1, rawMaximum) : rawMaximum;
  const range = Math.max(0.001, maximum - minimum);

  const toPath = (values: number[]) =>
    values
      .map((value, index) => {
        const x = padding.left + (index / samples) * plotWidth;
        const y =
          padding.top + plotHeight - ((value - minimum) / range) * plotHeight;
        return `${(index === 0 ? "M" : "L") + x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  const ninetyIndex = springValues.findIndex((value) => value >= 0.9);
  const ninetyTime =
    mode === "position" && ninetyIndex >= 0
      ? (ninetyIndex / samples) * durationSeconds
      : null;

  return (
    <figure className="min-w-0">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <strong>{mode === "position" ? "位置响应" : "瞬时速度"}</strong>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          0–{durationSeconds.toFixed(2)}s
          {ninetyTime !== null ? ` · 90% @ ${ninetyTime.toFixed(2)}s` : ""}
        </span>
      </figcaption>
      <div className="overflow-hidden rounded-lg bg-muted/20 ring-1 ring-border">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={
            mode === "position"
              ? "临界阻尼弹簧与贝塞尔的位置响应曲线"
              : "临界阻尼弹簧与贝塞尔的瞬时速度曲线"
          }
          className="h-auto w-full"
        >
          <line
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={height - padding.bottom}
            className="stroke-border"
          />
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
            className="stroke-border"
          />
          {mode === "position" ? (
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={
                padding.top + plotHeight - ((1 - minimum) / range) * plotHeight
              }
              y2={
                padding.top + plotHeight - ((1 - minimum) / range) * plotHeight
              }
              className="stroke-border"
              strokeDasharray="5 6"
            />
          ) : null}
          <path
            d={toPath(bezierValues)}
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 7"
          />
          <path
            d={toPath(springValues)}
            fill="none"
            className="stroke-primary"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text
            x={padding.left}
            y={height - 9}
            className="fill-muted-foreground text-[11px]"
          >
            0s
          </text>
          <text
            x={width - padding.right}
            y={height - 9}
            textAnchor="end"
            className="fill-muted-foreground text-[11px]"
          >
            {durationSeconds.toFixed(2)}s
          </text>
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-primary" />
          Spring · ω {omega.toFixed(1)}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 border-[var(--chart-1)] border-t-2 border-dashed" />
          Bezier · 0.25, 1, 0.3, 1
        </span>
      </div>
    </figure>
  );
}

function createRuntimeState(): RuntimeState {
  return {
    active: false,
    durationSeconds: 0,
    omega: 7.5,
    segments: {
      x: { from: 0, to: 0, velocity: 0 },
      y: { from: 0, to: 0, velocity: 0 },
      scale: { from: 1, to: 1, velocity: 0 },
    },
    startedAt: 0,
    target: { ...initialValue },
    value: { ...initialValue },
    velocity: { x: 0, y: 0, scale: 0 },
  };
}

function setRuntimeTarget(
  state: RuntimeState,
  target: MotionValue,
  startedAt: number,
) {
  state.active = false;
  state.startedAt = startedAt;
  state.target = pickMotionValue(target);
}

function snapRuntimeToTarget(state: RuntimeState) {
  state.value = { ...state.target };
  state.velocity = { x: 0, y: 0, scale: 0 };
}

function pickMotionValue(value: MotionValue): MotionValue {
  return { scale: value.scale, x: value.x, y: value.y };
}

function applyCanvasState(
  element: HTMLDivElement | null,
  state: RuntimeState,
  blurEnabled: boolean,
) {
  if (!element) return;
  element.style.transform =
    "translate3d(" +
    state.value.x +
    "%, " +
    state.value.y +
    "%, 0) scale(" +
    state.value.scale +
    ")";
  const speed = calculateSpeed(state.velocity);
  element.style.filter = blurEnabled
    ? `blur(${Math.min(2.4, speed * 0.018).toFixed(2)}px)`
    : "none";
}

function snapshotRuntime(state: RuntimeState): RuntimeSnapshot {
  return {
    speed: calculateSpeed(state.velocity),
    value: { ...state.value },
    velocity: { ...state.velocity },
  };
}

function calculateSpeed(velocity: MotionValue) {
  return Math.hypot(velocity.x, velocity.y, velocity.scale * 48);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
