"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modes = [
  { id: "signal", label: "信号", value: "92% 置信度" },
  { id: "cohort", label: "分群", value: "激活率 +18%" },
  { id: "action", label: "行动", value: "扩大引导路径" },
] as const;

export function MotionInteractionProbe() {
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]>(
    modes[0],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>React 交互探针</CardTitle>
        <CardDescription>
          切换状态以验证手势反馈、共享布局，以及可中断的进入/退出动画。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
        <div
          className="grid gap-2 sm:grid-cols-3"
          role="tablist"
          aria-label="洞察模式"
        >
          {modes.map((mode) => {
            const active = activeMode.id === mode.id;
            return (
              <motion.button
                key={mode.id}
                layout
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveMode(mode)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-lg bg-muted/40 p-4 text-left ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {active ? (
                  <motion.span
                    layoutId="active-mode"
                    className="absolute inset-x-0 top-0 h-1 bg-primary"
                  />
                ) : null}
                <span className="text-sm font-medium">{mode.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {mode.value}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="min-h-24 overflow-hidden rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMode.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
            >
              <p className="font-mono text-[0.68rem] tracking-wider text-primary uppercase">
                {activeMode.label}已解析
              </p>
              <p className="mt-2 text-lg font-semibold">{activeMode.value}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
