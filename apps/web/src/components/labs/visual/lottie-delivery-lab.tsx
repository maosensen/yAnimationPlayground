"use client";

import type { AnimationItem } from "lottie-web";
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const segments = [
  { label: "采集", frames: [0, 60] as [number, number] },
  { label: "解析", frames: [60, 120] as [number, number] },
  { label: "交付", frames: [120, 179] as [number, number] },
];

export function LottieDeliveryLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const lastProgressUpdate = useRef(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSegment, setActiveSegment] = useState("完整动画");
  const [reduceMotion, setReduceMotion] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const staticMode = reduceMotion || prefersReducedMotion;
  const assetBytes = useMemo(
    () => new TextEncoder().encode(JSON.stringify(signalPulse)).byteLength,
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function mountAnimation() {
      const lottie = (await import("lottie-web/build/player/lottie_light"))
        .default;
      if (cancelled || !containerRef.current) return;

      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: structuredClone(signalPulse),
        rendererSettings: {
          title: "Signal Pulse 数据处理状态",
          description: "三个脉冲阶段依次表示采集、解析与交付。",
          preserveAspectRatio: "xMidYMid meet",
        },
      });
      animationRef.current = animation;
      animation.addEventListener("DOMLoaded", () => setReady(true));
      animation.addEventListener("enterFrame", (event) => {
        const now = performance.now();
        if (now - lastProgressUpdate.current < 100) return;
        lastProgressUpdate.current = now;
        setProgress(Math.round((Number(event.currentTime) / 179) * 100));
      });
    }

    void mountAnimation();
    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation || !ready) return;
    if (staticMode) {
      animation.goToAndStop(179, true);
      setProgress(100);
      setPlaying(false);
    } else {
      animation.play();
      setPlaying(true);
    }
  }, [ready, staticMode]);

  function togglePlayback() {
    const animation = animationRef.current;
    if (!animation) return;
    if (playing) animation.pause();
    else animation.play();
    setPlaying(!playing);
  }

  function restart() {
    animationRef.current?.goToAndPlay(0, true);
    setActiveSegment("完整动画");
    setPlaying(true);
  }

  function playSegment(label: string, frames: [number, number]) {
    animationRef.current?.playSegments(frames, true);
    setActiveSegment(label);
    setPlaying(true);
  }

  function seek(next: number[]) {
    const value = next[0] ?? 0;
    animationRef.current?.goToAndStop((value / 100) * 179, true);
    setProgress(value);
    setPlaying(false);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Lottie 资产运行时</Badge>
              <Badge variant="outline">SVG renderer</Badge>
              <Badge variant="secondary">按需加载</Badge>
            </div>
            <CardTitle className="mt-3">设计工具导出的时间轴资产</CardTitle>
            <CardDescription className="mt-1">
              同一份 JSON 负责完整播放、分段播放、暂停与进度定位。
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="lottie-reduce">
              静态模式{prefersReducedMotion ? "（系统偏好）" : ""}
            </Label>
            <Switch
              id="lottie-reduce"
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={togglePlayback}
            disabled={!ready || staticMode}
          >
            <span
              className={
                playing ? "icon-[solar--pause-bold]" : "icon-[solar--play-bold]"
              }
              aria-hidden
            />
            {playing ? "暂停" : "播放"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={restart}
            disabled={!ready || staticMode}
          >
            <span className="icon-[solar--restart-bold-duotone]" aria-hidden />
            从头播放
          </Button>
          {segments.map((segment) => (
            <Button
              key={segment.label}
              type="button"
              size="sm"
              variant={activeSegment === segment.label ? "secondary" : "ghost"}
              onClick={() => playSegment(segment.label, segment.frames)}
              disabled={!ready || staticMode}
            >
              {segment.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:p-6">
        <div className="flex min-h-80 items-center justify-center rounded-xl bg-card p-4 ring-1 ring-border">
          <div
            ref={containerRef}
            className="aspect-square w-full max-w-96"
            role="img"
            aria-label="Lottie 数据处理状态动画"
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">播放进度</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>
            <Slider
              className="mt-4"
              value={[progress]}
              onValueChange={seek}
              disabled={!ready || staticMode}
              aria-label="Lottie 播放进度"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              当前：{activeSegment}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="帧率" value="60 fps" />
            <Metric label="总帧数" value="180" />
            <Metric
              label="JSON 体积"
              value={`${(assetBytes / 1024).toFixed(1)} KB`}
            />
            <Metric label="矢量图层" value={`${signalPulse.layers.length}`} />
          </dl>
          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <p className="text-sm font-medium">交付边界</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              JSON
              中的颜色和图层结构由导出资产固定。产品主题、文案与复杂业务状态仍应由应用层负责。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-3 ring-1 ring-border">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono font-medium tabular-nums">{value}</dd>
    </div>
  );
}
