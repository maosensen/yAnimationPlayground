"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext, useMemo } from "react";

export type MotionPreference = "system" | "full" | "reduced";

export type MotionPolicy = {
  preference: MotionPreference;
  shouldReduce: boolean;
};

const MotionPolicyContext = createContext<MotionPolicy | null>(null);

export function MotionPolicyProvider({
  children,
  preference = "system",
}: {
  children: ReactNode;
  preference?: MotionPreference;
}) {
  const systemShouldReduce = useReducedMotion();
  const shouldReduce =
    preference === "reduced" ||
    (preference === "system" && Boolean(systemShouldReduce));
  const policy = useMemo(
    () => ({ preference, shouldReduce }),
    [preference, shouldReduce],
  );
  const reducedMotion =
    preference === "system"
      ? "user"
      : preference === "reduced"
        ? "always"
        : undefined;

  return (
    <MotionPolicyContext value={policy}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </MotionPolicyContext>
  );
}

export function useMotionPolicy(): MotionPolicy {
  const policy = useContext(MotionPolicyContext);
  const systemShouldReduce = useReducedMotion();

  return (
    policy ?? {
      preference: "system",
      shouldReduce: Boolean(systemShouldReduce),
    }
  );
}
