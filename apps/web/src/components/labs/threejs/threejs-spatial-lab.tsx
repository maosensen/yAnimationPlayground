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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  getQualityPreset,
  type QualityPresetId,
  qualityPresets,
  type SignalId,
  type SpatialMode,
  signals,
  spatialModes,
} from "./threejs-model";
import { SpatialSignalScene, type ThreeTelemetry } from "./threejs-scene";

const initialTelemetry: ThreeTelemetry = {
  fps: 0,
  frameMs: 0,
  dpr: 1,
  drawCalls: 0,
  geometries: 0,
  triangles: 0,
  points: 0,
};

export function ThreejsSpatialLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SpatialSignalScene | null>(null);
  const [quality, setQuality] = useState<QualityPresetId>("balanced");
  const [mode, setMode] = useState<SpatialMode>("constellation");
  const [selectedSignal, setSelectedSignal] = useState<SignalId>("core");
  const [paused, setPaused] = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [telemetry, setTelemetry] = useState<ThreeTelemetry>(initialTelemetry);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const effectiveReducedMotion = systemReducedMotion || simulateReducedMotion;
  const motionEnabled = !paused && !effectiveReducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    try {
      const scene = new SpatialSignalScene({
        canvas,
        container: stage,
        quality: "balanced",
        mode: "constellation",
        selectedSignal: "core",
        motionEnabled: true,
        autoOrbit: true,
        onTelemetry: setTelemetry,
        onSelect: setSelectedSignal,
      });
      sceneRef.current = scene;
      setRuntimeError(null);
      return () => {
        sceneRef.current = null;
        scene.dispose();
      };
    } catch {
      setRuntimeError(
        "当前浏览器无法建立 WebGL 2 场景，已切换到语义化信息后备。",
      );
    }
  }, []);

  useEffect(() => sceneRef.current?.setQuality(quality), [quality]);
  useEffect(() => sceneRef.current?.setMode(mode), [mode]);
  useEffect(
    () => sceneRef.current?.selectSignal(selectedSignal),
    [selectedSignal],
  );
  useEffect(
    () => sceneRef.current?.setMotionEnabled(motionEnabled),
    [motionEnabled],
  );
  useEffect(() => sceneRef.current?.setAutoOrbit(autoOrbit), [autoOrbit]);

  const selected =
    signals.find((signal) => signal.id === selectedSignal) ?? signals[0];
  const activeMode =
    spatialModes.find((item) => item.id === mode) ?? spatialModes[0];
  const activeQuality = getQualityPreset(quality);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Three.js WebGL</Badge>
              <Badge variant="outline">按路由动态加载</Badge>
              <Badge variant="secondary">显式 GPU 清理</Badge>
            </div>
            <CardTitle className="mt-3">Spatial Signal Field</CardTitle>
            <CardDescription className="mt-1 max-w-3xl leading-5">
              用场景图、相机、点云和射线检测表达空间关系；React
              只接收每半秒一次的低频遥测。
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={paused ? "default" : "outline"}
              onClick={() => setPaused((value) => !value)}
            >
              <span
                className={
                  paused
                    ? "icon-[solar--play-bold-duotone]"
                    : "icon-[solar--pause-bold-duotone]"
                }
                aria-hidden
              />
              {paused ? "继续" : "暂停"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => sceneRef.current?.resetCamera()}
            >
              <span
                className="icon-[solar--restart-bold-duotone]"
                aria-hidden
              />
              重置相机
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="space-y-2">
            <Label>空间叙事模式</Label>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => {
                if (value) setMode(value as SpatialMode);
              }}
              variant="outline"
              className="flex-wrap justify-start"
            >
              {spatialModes.map((item) => (
                <ToggleGroupItem key={item.id} value={item.id}>
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <fieldset className="space-y-2 border-0 p-0">
            <legend className="text-sm font-medium">渲染质量</legend>
            <div className="flex flex-wrap gap-2">
              {qualityPresets.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant={quality === preset.id ? "default" : "outline"}
                  onClick={() => setQuality(preset.id)}
                >
                  {preset.label} · {preset.points}
                </Button>
              ))}
            </div>
          </fieldset>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 bg-muted/25 p-4 xl:grid-cols-[minmax(0,1fr)_19rem] xl:p-6">
        <div className="space-y-3">
          <div
            ref={stageRef}
            className="relative h-[32rem] min-h-80 overflow-hidden rounded-xl bg-background ring-1 ring-border"
          >
            <canvas
              ref={canvasRef}
              className="block size-full touch-none"
              aria-label="Spatial Signal Field 三维交互场景"
              onClick={(event) => {
                sceneRef.current?.pick(
                  event.clientX,
                  event.clientY,
                  event.currentTarget.getBoundingClientRect(),
                );
              }}
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap justify-between gap-2">
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur"
              >
                {activeMode.label}
              </Badge>
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur"
              >
                拖动旋转 · 滚轮缩放 · 点击节点
              </Badge>
            </div>
            {runtimeError ? (
              <div className="absolute inset-0 grid place-items-center bg-background/95 p-6 text-center">
                <div className="max-w-sm">
                  <span
                    className="icon-[solar--danger-triangle-bold-duotone] mx-auto size-8 text-primary"
                    aria-hidden
                  />
                  <p className="mt-3 font-medium">WebGL 后备模式</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {runtimeError}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            {activeMode.description} {activeQuality.description}
          </p>
        </div>

        <aside className="space-y-4" aria-label="Three.js 场景控制与诊断">
          <div className="grid grid-cols-2 gap-2">
            <Metric
              label="估算 FPS"
              value={motionEnabled ? `${telemetry.fps}` : "静态"}
            />
            <Metric
              label="平均帧时"
              value={motionEnabled ? `${telemetry.frameMs} ms` : "—"}
            />
            <Metric label="Draw calls" value={`${telemetry.drawCalls}`} />
            <Metric label="实际 DPR" value={`${telemetry.dpr}×`} />
            <Metric label="点图元" value={`${telemetry.points}`} />
            <Metric label="几何体" value={`${telemetry.geometries}`} />
          </div>

          <div className="space-y-3 rounded-lg bg-card p-4 ring-1 ring-border">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="three-auto-orbit">自动环绕相机</Label>
              <Switch
                id="three-auto-orbit"
                checked={autoOrbit}
                onCheckedChange={setAutoOrbit}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="three-reduced-motion">
                模拟减少动效
                {systemReducedMotion ? "（系统已开启）" : ""}
              </Label>
              <Switch
                id="three-reduced-motion"
                checked={simulateReducedMotion}
                onCheckedChange={setSimulateReducedMotion}
              />
            </div>
          </div>

          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <p className="text-sm font-medium">可访问的节点选择</p>
            <div className="mt-3 grid gap-2">
              {signals.map((signal) => (
                <Button
                  key={signal.id}
                  type="button"
                  size="sm"
                  variant={selectedSignal === signal.id ? "default" : "outline"}
                  className="justify-between"
                  onClick={() => setSelectedSignal(signal.id)}
                >
                  {signal.label}
                  <span className="font-mono tabular-nums">{signal.value}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">{selected.label}</p>
              <span className="font-mono text-lg font-semibold text-primary tabular-nums">
                {selected.value}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {selected.insight}
            </p>
          </div>
        </aside>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <dl className="rounded-lg bg-card p-3 ring-1 ring-border">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono font-medium tabular-nums">{value}</dd>
    </dl>
  );
}
