"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BenchmarkScene } from "./benchmark-scene";
import { InteractionHarness } from "./interaction-harness";
import type { PlaybackState } from "./interaction-types";
import { usePlaybackPoll } from "./use-playback-poll";
import { useReducedMotionControl } from "./use-reduced-motion-control";

type Timeline = {
  play: () => Timeline;
  pause: () => Timeline;
  restart: () => Timeline;
  reverse: () => Timeline;
  progress: (value?: number) => number | Timeline;
  reversed: (value: boolean) => Timeline;
  kill: () => void;
};

const duration = 7.2;

export function GsapBenchmark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<PlaybackState>("preparing");
  const [reducedMotion, setReducedMotion] = useReducedMotionControl();

  const readProgress = useCallback(() => {
    const value = timelineRef.current?.progress();
    return typeof value === "number" ? value : 0;
  }, []);

  const syncProgress = useCallback((nextProgress: number) => {
    setProgress(nextProgress);
    if (nextProgress >= 0.999) {
      setState("complete");
    }
  }, []);

  usePlaybackPoll(state === "playing", readProgress, syncProgress);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    async function prepareTimeline() {
      const { gsap } = await import("gsap");
      if (cancelled || !stageRef.current) return;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            setProgress(1);
            setState("complete");
          },
        });

        timeline
          .addLabel("collect", 0)
          .from(
            "[data-anim='eyebrow']",
            { opacity: 0, y: 12, duration: 0.6 },
            0.35,
          )
          .from(
            "[data-anim='title']",
            { opacity: 0, y: 18, duration: 0.8 },
            0.7,
          )
          .from(
            "[data-anim='summary']",
            { opacity: 0, y: 12, duration: 0.7 },
            1.2,
          )
          .from(
            "[data-anim='signal-card']",
            { opacity: 0, y: 18, scale: 0.96, duration: 0.8, stagger: 0.18 },
            1.75,
          )
          .from(
            "[data-anim='phase']",
            { opacity: 0.35, duration: 0.4, stagger: 0.55 },
            1.4,
          )
          .addLabel("resolve", 2.7)
          .fromTo(
            "[data-anim='signal-path']",
            { strokeDashoffset: 1, opacity: 0.3 },
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 1.9,
              ease: "power2.inOut",
            },
            2.7,
          )
          .from(
            "[data-anim='signal-dot']",
            { opacity: 0, scale: 0, transformOrigin: "center", duration: 0.45 },
            4.25,
          )
          .addLabel("decide", 4.75)
          .from(
            "[data-anim='decision']",
            { opacity: 0, y: 18, scale: 0.98, duration: 0.85 },
            4.75,
          )
          .fromTo(
            "[data-anim='orb']",
            { opacity: 0.35, xPercent: -12, yPercent: 10, scale: 0.88 },
            {
              opacity: 0.5,
              xPercent: 18,
              yPercent: 6,
              scale: 1,
              duration,
              ease: "sine.inOut",
            },
            0,
          );

        timelineRef.current = timeline as unknown as Timeline;
      }, stageRef);

      setReady(true);
      setState("playing");
      cleanup = () => {
        timelineRef.current?.kill();
        context.revert();
      };
    }

    void prepareTimeline();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !ready) return;

    if (reducedMotion) {
      timeline.progress(1);
      timeline.pause();
      setProgress(1);
      setState("complete");
    } else {
      timeline.reversed(false);
      timeline.restart();
      setProgress(0);
      setState("playing");
    }
  }, [ready, reducedMotion]);

  const play = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (readProgress() >= 0.999) timeline.progress(0);
    timeline.reversed(false).play();
    setState("playing");
  }, [readProgress]);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
    setProgress(readProgress());
    setState("paused");
  }, [readProgress]);

  const restart = useCallback(() => {
    timelineRef.current?.reversed(false).restart();
    setProgress(0);
    setState("playing");
  }, []);

  const reverse = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (readProgress() <= 0) timeline.progress(1);
    timeline.reverse();
    setState("playing");
  }, [readProgress]);

  const seek = useCallback((nextProgress: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    timeline.progress(nextProgress);
    timeline.pause();
    setProgress(nextProgress);
    setState(nextProgress >= 0.999 ? "complete" : "paused");
  }, []);

  return (
    <InteractionHarness
      runtime={{
        name: "GSAP",
        model: "标签化时间轴",
        payload: "懒加载约 27 kB gzip",
        accent: "编排升级方案",
      }}
      controller={{
        duration,
        progress,
        state,
        ready,
        play,
        pause,
        restart,
        reverse,
        seek,
      }}
      reducedMotion={reducedMotion}
      onReducedMotionChange={setReducedMotion}
    >
      <div ref={stageRef}>
        <BenchmarkScene />
      </div>
    </InteractionHarness>
  );
}
