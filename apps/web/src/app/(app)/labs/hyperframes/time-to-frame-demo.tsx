"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const FPS = 30;
const DURATION = 2;
const LAST_FRAME = FPS * DURATION;

export function TimeToFrameDemo() {
  const [frame, setFrame] = useState(18);
  const time = frame / FPS;
  const progress = frame / LAST_FRAME;
  const phase =
    progress < 0.2 ? "进入" : progress < 0.78 ? "保持与移动" : "退出";
  const opacity = Math.min(progress / 0.2, (1 - progress) / 0.22, 1);
  const scale = 0.82 + Math.min(progress / 0.28, 1) * 0.18;

  return (
    <div className="grid gap-5 rounded-lg bg-muted/45 p-5 ring-1 ring-border lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="space-y-5">
        <div className="relative h-44 overflow-hidden rounded-lg bg-background ring-1 ring-border">
          <div className="absolute inset-x-5 top-1/2 h-px bg-border" />
          <div
            className="absolute top-1/2 size-14 rounded-lg bg-primary shadow-sm"
            style={{
              left: `calc(1.25rem + ${progress * 78}%)`,
              opacity: Math.max(opacity, 0.08),
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          />
          <div className="absolute inset-x-5 bottom-4 flex justify-between font-mono text-xs text-muted-foreground">
            <span>0.00s</span>
            <span>1.00s</span>
            <span>2.00s</span>
          </div>
        </div>

        <div className="space-y-3">
          <Slider
            aria-label="选择渲染帧"
            min={0}
            max={LAST_FRAME}
            step={1}
            value={[frame]}
            onValueChange={([nextFrame]) => setFrame(nextFrame ?? 0)}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>拖动时间线</span>
            <span>
              总长 {DURATION.toFixed(2)}s · {FPS} fps
            </span>
          </div>
        </div>
      </div>

      <dl className="grid content-start gap-4">
        <FrameValue label="请求帧" value={`frame ${frame}`} />
        <FrameValue label="换算时间" value={`${time.toFixed(3)}s`} />
        <FrameValue label="时间线状态" value={phase} />
        <div className="rounded-lg bg-background p-4 ring-1 ring-border">
          <dt className="text-xs text-muted-foreground">确定性结果</dt>
          <dd className="mt-2">
            <Badge variant="secondary">相同 frame → 相同画面</Badge>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function FrameValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}
