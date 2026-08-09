"use client";

import { useRive, useStateMachineInput } from "@rive-app/react-canvas-lite";
import { useEffect, useState } from "react";
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

const riveSource = "https://cdn.rive.app/animations/vehicles.riv";
const stateMachine = "bumpy";
const triggerName = "bump";

export function RiveStateMachineLab() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [playing, setPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const staticMode = reduceMotion || prefersReducedMotion;
  const { rive, RiveComponent } = useRive({
    src: riveSource,
    stateMachines: stateMachine,
    autoplay: true,
    automaticallyHandleEvents: false,
    onLoad: () => setStatus("ready"),
    onLoadError: () => setStatus("error"),
  });
  const bumpInput = useStateMachineInput(rive, stateMachine, triggerName);

  useEffect(() => {
    if (!rive) return;
    if (staticMode) {
      rive.pause();
      setPlaying(false);
    } else {
      rive.play();
      setPlaying(true);
    }
  }, [rive, staticMode]);

  function togglePlayback() {
    if (!rive) return;
    if (playing) rive.pause();
    else rive.play();
    setPlaying(!playing);
  }

  function reset() {
    if (!rive) return;
    rive.reset({ stateMachines: stateMachine, autoplay: !staticMode });
    setPlaying(!staticMode);
    setTriggerCount(0);
  }

  function fireTrigger() {
    bumpInput?.fire();
    setTriggerCount((count) => count + 1);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Rive 状态机</Badge>
              <Badge variant="outline">Canvas Lite</Badge>
              <Badge variant={status === "error" ? "destructive" : "secondary"}>
                {status === "loading"
                  ? "资产加载中"
                  : status === "ready"
                    ? "运行时就绪"
                    : "已启用后备"}
              </Badge>
            </div>
            <CardTitle className="mt-3">由输入驱动的交互动画资产</CardTitle>
            <CardDescription className="mt-1">
              React 发送 trigger，Rive 文件内部的状态机决定如何响应和过渡。
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="rive-reduce">
              静态模式{prefersReducedMotion ? "（系统偏好）" : ""}
            </Label>
            <Switch
              id="rive-reduce"
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={fireTrigger}
            disabled={!bumpInput || staticMode}
          >
            <span className="icon-[solar--bolt-bold-duotone]" aria-hidden />
            触发颠簸
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={togglePlayback}
            disabled={!rive || staticMode}
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
            variant="ghost"
            onClick={reset}
            disabled={!rive}
          >
            <span className="icon-[solar--restart-bold-duotone]" aria-hidden />
            重置状态机
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-6">
        <div className="relative min-h-80 overflow-hidden rounded-xl bg-card ring-1 ring-border">
          {status !== "error" ? (
            <RiveComponent
              className="size-full min-h-80"
              aria-label="Rive 车辆状态机动画"
            />
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
              <span
                className="icon-[solar--cloud-cross-bold-duotone] size-10 text-muted-foreground"
                aria-hidden
              />
              <p className="mt-4 font-medium">远程 Rive 资产暂时不可用</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                页面仍保留状态机名称、输入说明和操作语义；生产项目应自托管关键资产并提供静态海报。
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <dl className="space-y-2 text-sm">
            <MachineMetric label="状态机" value={stateMachine} />
            <MachineMetric
              label="输入类型"
              value={`${triggerName} · Trigger`}
            />
            <MachineMetric label="本次触发" value={`${triggerCount} 次`} />
            <MachineMetric label="资产所有权" value="Rive 官方 CDN" />
          </dl>
          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <p className="text-sm font-medium">运行时边界</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              应用只表达“发生了什么”，状态机文件决定“动画如何响应”。这能减少组件中的过渡分支，但需要把资产版本、输入命名和网络失败纳入工程治理。
            </p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Canvas Lite 不包含 Rive Text
            与音频能力，适合当前只需要图形和状态机的实验，避免为未使用功能支付运行时体积。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MachineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-card px-3 py-2.5 ring-1 ring-border">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs text-right">{value}</dd>
    </div>
  );
}
