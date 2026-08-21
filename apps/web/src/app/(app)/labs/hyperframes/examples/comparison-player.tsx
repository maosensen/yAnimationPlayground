"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PLAYER_SOURCE = "yanimation-hf-player";

const beats = [
  { time: 0, label: "开场问题" },
  { time: 4.5, label: "时间模型" },
  { time: 10, label: "选型差异" },
  { time: 15, label: "共同结论" },
];

type PreviewMessage = {
  source: "yanimation-hf-preview";
  type: "time";
  currentTime: number;
  duration: number;
  playing: boolean;
};

export function ComparisonPlayer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const connectionTimeoutRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [playing, setPlaying] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "ready" | "error"
  >("connecting");
  const ready = connectionState === "ready";

  useEffect(() => {
    const receiveMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.source !== "yanimation-hf-preview") return;

      setCurrentTime(event.data.currentTime);
      setDuration(event.data.duration);
      setPlaying(event.data.playing);
      setConnectionState("ready");
      if (connectionTimeoutRef.current !== null) {
        window.clearTimeout(connectionTimeoutRef.current);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
      if (connectionTimeoutRef.current !== null) {
        window.clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  const startConnectionTimeout = () => {
    setConnectionState("connecting");
    if (connectionTimeoutRef.current !== null) {
      window.clearTimeout(connectionTimeoutRef.current);
    }
    connectionTimeoutRef.current = window.setTimeout(() => {
      setConnectionState((state) => (state === "ready" ? state : "error"));
    }, 5000);
  };

  const send = (message: Record<string, number | string>) => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: PLAYER_SOURCE, ...message },
      "*",
    );
  };

  const seek = (time: number) => {
    setCurrentTime(time);
    send({ type: "seek", time });
  };

  const retry = () => {
    setCurrentTime(0);
    setConnectionState("connecting");
    setAttempt((value) => value + 1);
  };

  const enterFullscreen = () => {
    void stageRef.current?.requestFullscreen();
  };

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">HTML + CSS + GSAP</Badge>
          <Badge variant="outline">1920 × 1080</Badge>
          <Badge variant="outline">30 FPS</Badge>
        </div>
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span>
            {connectionState === "ready" && "时间线已连接"}
            {connectionState === "connecting" && "正在连接时间线…"}
            {connectionState === "error" && "时间线连接失败"}
          </span>
          {connectionState === "error" && (
            <Button type="button" size="xs" variant="ghost" onClick={retry}>
              重试
            </Button>
          )}
        </div>
      </div>

      <div
        ref={stageRef}
        className="bg-black fullscreen:flex fullscreen:items-center"
      >
        <iframe
          key={attempt}
          ref={iframeRef}
          src="/hyperframes-embed/remotion-comparison"
          title="HyperFrames 与 Remotion 对比动画"
          className="block aspect-video w-full fullscreen:max-h-screen"
          sandbox="allow-scripts"
          allowFullScreen
          onLoad={startConnectionTimeout}
        />
      </div>

      <div className="space-y-4 border-t p-4 sm:p-5">
        <div className="grid items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              disabled={!ready}
              aria-label={playing ? "暂停动画" : "播放动画"}
              onClick={() => send({ type: playing ? "pause" : "play" })}
            >
              <span
                className={
                  playing
                    ? "icon-[solar--pause-bold] size-4"
                    : "icon-[solar--play-bold] size-4"
                }
                aria-hidden
              />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={!ready}
              aria-label="从头播放"
              onClick={() => send({ type: "restart" })}
            >
              <span
                className="icon-[solar--restart-bold-duotone] size-4"
                aria-hidden
              />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={enterFullscreen}
            >
              <span
                className="icon-[solar--maximize-square-3-bold-duotone] size-4"
                aria-hidden
              />
              全屏观看
            </Button>
          </div>

          <Slider
            aria-label="动画时间线"
            disabled={!ready}
            min={0}
            max={duration}
            step={1 / 30}
            value={[currentTime]}
            onValueChange={([time]) => seek(time ?? 0)}
          />

          <span className="justify-self-end font-mono text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          {beats.map((beat) => (
            <Button
              key={beat.time}
              type="button"
              size="sm"
              variant="ghost"
              disabled={!ready}
              className="text-muted-foreground"
              onClick={() => seek(beat.time)}
            >
              <span className="font-mono text-xs tabular-nums">
                {formatTime(beat.time)}
              </span>
              {beat.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.max(0, time - minutes * 60);
  return `${minutes}:${seconds.toFixed(1).padStart(4, "0")}`;
}
