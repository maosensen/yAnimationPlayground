"use client";

import {
  choreography,
  distance,
  duration,
  millisecondsToSeconds,
  type StaggerToken,
  stagger as staggerToken,
} from "@yanimation/motion-tokens";
import {
  stagger as createStagger,
  type HTMLMotionProps,
  motion,
  type Variants,
} from "motion/react";
import { useMotionPolicy } from "./motion-policy";
import { motionTransition } from "./transitions";

export type StaggerRootProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "variants"
> & {
  tempo?: StaggerToken;
};

function StaggerRoot({ tempo = "standard", ...props }: StaggerRootProps) {
  const { shouldReduce } = useMotionPolicy();
  const delay = shouldReduce ? 0 : millisecondsToSeconds(staggerToken[tempo]);
  const startDelay = shouldReduce
    ? 0
    : millisecondsToSeconds(duration.feedback);
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: createStagger(delay, { startDelay }),
      },
    },
  };

  return (
    <motion.div
      {...props}
      initial="hidden"
      animate="visible"
      variants={variants}
    />
  );
}

export type StaggerItemProps = Omit<
  HTMLMotionProps<"div">,
  "transition" | "variants"
>;

function StaggerItem(props: StaggerItemProps) {
  const { shouldReduce } = useMotionPolicy();
  const variants: Variants = {
    hidden: shouldReduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: distance[choreography.enter.distance],
          scale: 0.98,
        },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduce ? motionTransition.exit : motionTransition.enter,
    },
  };

  return <motion.div {...props} variants={variants} />;
}

export const Stagger = {
  Root: StaggerRoot,
  Item: StaggerItem,
};
