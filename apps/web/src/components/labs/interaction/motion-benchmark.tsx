"use client";

import type {
  AnimationPlaybackControls,
  AnimationSequence,
} from "motion/react";
import { stagger, useAnimate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BenchmarkScene } from "./benchmark-scene";
import { InteractionHarness } from "./interaction-harness";
import type { PlaybackState } from "./interaction-types";
import { usePlaybackPoll } from "./use-playback-poll";
import { useReducedMotionControl } from "./use-reduced-motion-control";

const duration = 7.2;

export function MotionBenchmark() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<PlaybackState>("preparing");
  const [reducedMotion, setReducedMotion] = useReducedMotionControl();

  const readProgress = useCallback(() => {
    const controls = controlsRef.current;
    return controls ? Math.min(1, Math.max(0, controls.time / duration)) : 0;
  }, []);

  const syncProgress = useCallback((nextProgress: number) => {
    setProgress(nextProgress);
    if (nextProgress >= 0.999) {
      setState("complete");
    }
  }, []);

  usePlaybackPoll(state === "playing", readProgress, syncProgress);

  useEffect(() => {
    const sequence: AnimationSequence = [
      [
        "[data-anim='eyebrow']",
        { opacity: [0, 1], y: [12, 0] },
        { duration: 0.6, at: 0.35 },
      ],
      [
        "[data-anim='title']",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 0.8, at: 0.7 },
      ],
      [
        "[data-anim='summary']",
        { opacity: [0, 1], y: [12, 0] },
        { duration: 0.7, at: 1.2 },
      ],
      [
        "[data-anim='signal-card']",
        { opacity: [0, 1], y: [18, 0], scale: [0.96, 1] },
        { duration: 0.8, delay: stagger(0.18), at: 1.75 },
      ],
      [
        "[data-anim='signal-path']",
        { strokeDashoffset: [1, 0], opacity: [0.3, 1] },
        { duration: 1.9, at: 2.7 },
      ],
      [
        "[data-anim='signal-dot']",
        { opacity: [0, 1], scale: [0, 1] },
        { duration: 0.45, at: 4.25 },
      ],
      [
        "[data-anim='decision']",
        { opacity: [0, 1], y: [18, 0], scale: [0.98, 1] },
        { duration: 0.85, at: 4.75 },
      ],
      [
        "[data-anim='phase']",
        { opacity: [0.35, 1] },
        { duration: 0.4, delay: stagger(0.55), at: 1.4 },
      ],
      [
        "[data-anim='orb']",
        {
          opacity: [0.35, 0.8, 0.5],
          x: ["-12%", "8%", "18%"],
          y: ["10%", "-4%", "6%"],
          scale: [0.88, 1.08, 1],
        },
        { duration, at: 0 },
      ],
    ];

    const controls = animate(sequence, {
      duration,
      defaultTransition: { ease: [0.22, 1, 0.36, 1] },
      onComplete: () => {
        setProgress(1);
        setState("complete");
      },
    });
    controlsRef.current = controls;
    setReady(true);
    setState("playing");

    return () => controls.stop();
  }, [animate]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !ready) {
      return;
    }

    if (reducedMotion) {
      controls.time = duration;
      controls.pause();
      setProgress(1);
      setState("complete");
    } else {
      controls.speed = 1;
      controls.time = 0;
      controls.play();
      setProgress(0);
      setState("playing");
    }
  }, [ready, reducedMotion]);

  const play = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (controls.time >= duration) controls.time = 0;
    controls.speed = 1;
    controls.play();
    setState("playing");
  }, []);

  const pause = useCallback(() => {
    controlsRef.current?.pause();
    setProgress(readProgress());
    setState("paused");
  }, [readProgress]);

  const restart = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.speed = 1;
    controls.time = 0;
    controls.play();
    setProgress(0);
    setState("playing");
  }, []);

  const reverse = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (controls.time <= 0) controls.time = duration;
    controls.speed = -1;
    controls.play();
    setState("playing");
  }, []);

  const seek = useCallback((nextProgress: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.time = nextProgress * duration;
    controls.pause();
    setProgress(nextProgress);
    setState(nextProgress >= 0.999 ? "complete" : "paused");
  }, []);

  return (
    <InteractionHarness
      runtime={{
        name: "Motion",
        model: "React 序列",
        payload: "路由约 52 kB gzip",
        accent: "交互默认方案",
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
      <div ref={scope}>
        <BenchmarkScene />
      </div>
    </InteractionHarness>
  );
}
