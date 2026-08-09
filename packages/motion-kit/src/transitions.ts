import {
  choreography,
  duration,
  easing,
  millisecondsToSeconds,
  spring,
} from "@yanimation/motion-tokens";
import type { Transition } from "motion/react";

const cubicBezier = (
  value: readonly [number, number, number, number],
): [number, number, number, number] => [...value];

export const motionTransition = {
  feedback: {
    type: "spring",
    ...spring[choreography.feedback.spring],
  },
  enter: {
    type: "tween",
    duration: millisecondsToSeconds(duration[choreography.enter.duration]),
    ease: cubicBezier(easing[choreography.enter.easing]),
  },
  exit: {
    type: "tween",
    duration: millisecondsToSeconds(duration[choreography.exit.duration]),
    ease: cubicBezier(easing[choreography.exit.easing]),
  },
  layout: {
    type: "spring",
    ...spring[choreography.layout.spring],
  },
  emphasis: {
    type: "tween",
    duration: millisecondsToSeconds(duration[choreography.emphasis.duration]),
    ease: cubicBezier(easing[choreography.emphasis.easing]),
  },
} as const satisfies Record<string, Transition>;

export type MotionTransitionIntent = keyof typeof motionTransition;
