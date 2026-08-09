"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BenchmarkScene, benchmarkSceneStyles } from "./benchmark-scene";
import { InteractionHarness } from "./interaction-harness";
import type { PlaybackState } from "./interaction-types";
import { usePlaybackPoll } from "./use-playback-poll";
import { useReducedMotionControl } from "./use-reduced-motion-control";

const duration = 7.2;

export function CssSvgBenchmark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<PlaybackState>("preparing");
  const [reducedMotion, setReducedMotion] = useReducedMotionControl();

  const readProgress = useCallback(() => {
    const animation = animationsRef.current[0];
    if (!animation) {
      return 0;
    }

    const currentTime = Number(animation.currentTime ?? 0);
    return Math.min(1, Math.max(0, currentTime / (duration * 1000)));
  }, []);

  const syncProgress = useCallback((nextProgress: number) => {
    setProgress(nextProgress);
    if (nextProgress >= 0.999) {
      setState("complete");
    }
  }, []);

  usePlaybackPoll(state === "playing", readProgress, syncProgress);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      animationsRef.current = (
        stageRef.current?.getAnimations({ subtree: true }) ?? []
      ).filter(
        (animation) =>
          Number(animation.effect?.getTiming().duration) === duration * 1000,
      );
      setReady(true);
      setState("playing");
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (reducedMotion) {
      for (const animation of animationsRef.current) {
        animation.currentTime = duration * 1000;
        animation.pause();
      }
      setProgress(1);
      setState("complete");
    } else {
      for (const animation of animationsRef.current) {
        animation.currentTime = 0;
        animation.playbackRate = 1;
        animation.play();
      }
      setProgress(0);
      setState("playing");
    }
  }, [ready, reducedMotion]);

  const play = useCallback(() => {
    if (progress >= 0.999) {
      for (const animation of animationsRef.current) {
        animation.currentTime = 0;
        animation.playbackRate = 1;
      }
      setProgress(0);
    }
    for (const animation of animationsRef.current) {
      animation.play();
    }
    setState("playing");
  }, [progress]);

  const pause = useCallback(() => {
    for (const animation of animationsRef.current) {
      animation.pause();
    }
    setProgress(readProgress());
    setState("paused");
  }, [readProgress]);

  const restart = useCallback(() => {
    for (const animation of animationsRef.current) {
      animation.currentTime = 0;
      animation.playbackRate = 1;
      animation.play();
    }
    setProgress(0);
    setState("playing");
  }, []);

  const reverse = useCallback(() => {
    for (const animation of animationsRef.current) {
      if (Number(animation.currentTime ?? 0) <= 0) {
        animation.currentTime = duration * 1000;
      }
      animation.reverse();
    }
    setState("playing");
  }, []);

  const seek = useCallback((nextProgress: number) => {
    for (const animation of animationsRef.current) {
      animation.currentTime = nextProgress * duration * 1000;
      animation.pause();
    }
    setProgress(nextProgress);
    setState(nextProgress >= 0.999 ? "complete" : "paused");
  }, []);

  return (
    <InteractionHarness
      runtime={{
        name: "CSS + SVG",
        model: "Declarative keyframes",
        payload: "0 kB runtime",
        accent: "Native baseline",
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
      <div ref={stageRef} className={benchmarkSceneStyles.nativeRuntime}>
        <BenchmarkScene />
      </div>
    </InteractionHarness>
  );
}
