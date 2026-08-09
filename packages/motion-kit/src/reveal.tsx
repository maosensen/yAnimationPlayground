"use client";

import { choreography, distance } from "@yanimation/motion-tokens";
import {
  type HTMLMotionProps,
  motion,
  type TargetAndTransition,
} from "motion/react";
import { useMotionPolicy } from "./motion-policy";
import { motionTransition } from "./transitions";

export type RevealPreset = "fade" | "rise" | "scale";

const hiddenState = {
  fade: { opacity: 0 },
  rise: {
    opacity: 0,
    y: distance[choreography.enter.distance],
  },
  scale: { opacity: 0, scale: 0.96 },
} as const satisfies Record<RevealPreset, TargetAndTransition>;

export type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "transition"
> & {
  preset?: RevealPreset;
};

export function Reveal({ preset = "rise", ...props }: RevealProps) {
  const { shouldReduce } = useMotionPolicy();

  return (
    <motion.div
      {...props}
      initial={shouldReduce ? { opacity: 0 } : hiddenState[preset]}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={shouldReduce ? motionTransition.exit : motionTransition.enter}
    />
  );
}
