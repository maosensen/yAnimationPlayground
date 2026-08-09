"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

type Telemetry = {
  fps: number;
  frameMs: number;
  dpr: number;
};

const densityOptions = [120, 360, 720];

export function CanvasFrameBudgetLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const [density, setDensity] = useState(360);
  const [staticMode, setStaticMode] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const effectiveStaticMode = staticMode || prefersReducedMotion;
  const [telemetry, setTelemetry] = useState<Telemetry>({
    fps: 0,
    frameMs: 0,
    dpr: 1,
  });

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const renderingContext = canvasElement?.getContext("2d");
    if (!canvasElement || !renderingContext) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = renderingContext;

    let animationFrame = 0;
    let width = 1;
    let height = 1;
    let lastFrame = performance.now();
    let telemetryStarted = lastFrame;
    let telemetryFrames = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const styles = getComputedStyle(canvas);
    const primary = styles.getPropertyValue("--primary").trim();
    const border = styles.getPropertyValue("--border").trim();

    function random(index: number, salt: number) {
      const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
      return value - Math.floor(value);
    }

    function buildParticles() {
      particles = Array.from({ length: density }, (_, index) => ({
        x: random(index, 1) * width,
        y: random(index, 2) * height,
        vx: (random(index, 3) - 0.5) * 0.34,
        vy: (random(index, 4) - 0.5) * 0.34,
        size: 0.7 + random(index, 5) * 1.8,
        alpha: 0.18 + random(index, 6) * 0.62,
      }));
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
      draw(false);
    }

    function draw(advance: boolean) {
      context.clearRect(0, 0, width, height);
      context.fillStyle = border;
      context.globalAlpha = 0.18;
      for (let x = 24; x < width; x += 48) context.fillRect(x, 0, 1, height);
      for (let y = 24; y < height; y += 48) context.fillRect(0, y, width, 1);

      for (const particle of particles) {
        if (advance) {
          const pointer = pointerRef.current;
          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared > 1 && distanceSquared < 9000) {
              const force = (1 - distanceSquared / 9000) * 0.08;
              particle.vx += (dx / Math.sqrt(distanceSquared)) * force;
              particle.vy += (dy / Math.sqrt(distanceSquared)) * force;
            }
          }
          particle.vx *= 0.985;
          particle.vy *= 0.985;
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0) particle.x += width;
          if (particle.x > width) particle.x -= width;
          if (particle.y < 0) particle.y += height;
          if (particle.y > height) particle.y -= height;
        }
        context.beginPath();
        context.fillStyle = primary;
        context.globalAlpha = particle.alpha;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    }

    function loop(now: number) {
      const frameMs = now - lastFrame;
      lastFrame = now;
      telemetryFrames += 1;
      draw(true);
      if (now - telemetryStarted >= 500) {
        const elapsed = now - telemetryStarted;
        setTelemetry({
          fps: Math.round((telemetryFrames * 1000) / elapsed),
          frameMs: Number(frameMs.toFixed(1)),
          dpr,
        });
        telemetryStarted = now;
        telemetryFrames = 0;
      }
      animationFrame = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (!effectiveStaticMode) animationFrame = requestAnimationFrame(loop);
    else setTelemetry({ fps: 0, frameMs: 0, dpr });

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [density, effectiveStaticMode]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Canvas 即时绘制</Badge>
              <Badge variant="outline">rAF + refs</Badge>
              <Badge variant="secondary">DPR 最大 2×</Badge>
            </div>
            <CardTitle className="mt-3">高密度图元与帧预算</CardTitle>
            <CardDescription className="mt-1">
              粒子位置留在可变引用中，每 500ms 才把性能遥测同步到 React。
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="canvas-static">
              静态模式{prefersReducedMotion ? "（系统偏好）" : ""}
            </Label>
            <Switch
              id="canvas-static"
              checked={staticMode}
              onCheckedChange={setStaticMode}
            />
          </div>
        </div>
        <fieldset className="flex min-w-0 flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">粒子密度</legend>
          {densityOptions.map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={density === option ? "default" : "outline"}
              onClick={() => setDensity(option)}
            >
              {option} 粒子
            </Button>
          ))}
        </fieldset>
      </CardHeader>

      <CardContent className="grid gap-5 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:p-6">
        <canvas
          ref={canvasRef}
          className="h-96 w-full touch-none rounded-xl bg-card ring-1 ring-border"
          aria-label={`${density} 个粒子的交互式 Canvas 场景`}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            pointerRef.current = {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              active: true,
            };
          }}
          onPointerLeave={() => {
            pointerRef.current.active = false;
          }}
        />
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <CanvasMetric
              label="估算 FPS"
              value={effectiveStaticMode ? "静态" : `${telemetry.fps}`}
            />
            <CanvasMetric
              label="最近一帧"
              value={effectiveStaticMode ? "—" : `${telemetry.frameMs} ms`}
            />
            <CanvasMetric label="图元数量" value={`${density}`} />
            <CanvasMetric label="实际 DPR" value={`${telemetry.dpr}×`} />
          </dl>
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <p className="text-sm font-medium">交互方式</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              在画布上移动指针可排斥附近粒子。切换密度后会重新建立确定性的粒子集合，避免
              React 逐帧重渲染。
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <p className="text-sm font-medium">预算规则</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              60fps 的单帧预算约
              16.7ms。真实产品还需要在低端设备测量长任务、输入延迟和电量，而不是只看桌面开发机的
              FPS。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CanvasMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-3 ring-1 ring-border">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono font-medium tabular-nums">{value}</dd>
    </div>
  );
}
