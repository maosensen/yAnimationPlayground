"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import { useMotionPolicy } from "./motion-policy";
import { motionTransition } from "./transitions";

export type PressFeedback = "lift" | "compress" | "quiet";

const feedbackMotion = {
  lift: {
    hover: { y: -2 },
    tap: { scale: 0.98 },
  },
  compress: {
    hover: { scale: 1.01 },
    tap: { scale: 0.96 },
  },
  quiet: {
    hover: {},
    tap: { opacity: 0.72 },
  },
} as const;

export type MotionPressableProps = Omit<
  HTMLMotionProps<"button">,
  "transition" | "whileHover" | "whileTap"
> & {
  feedback?: PressFeedback;
};

export function MotionPressable({
  feedback = "lift",
  ...props
}: MotionPressableProps) {
  const { shouldReduce } = useMotionPolicy();
  const selectedFeedback = shouldReduce
    ? feedbackMotion.quiet
    : feedbackMotion[feedback];

  return (
    <motion.button
      {...props}
      whileHover={selectedFeedback.hover}
      whileTap={selectedFeedback.tap}
      transition={motionTransition.feedback}
    />
  );
}
