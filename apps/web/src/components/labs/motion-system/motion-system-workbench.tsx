"use client";

import {
  MotionPolicyProvider,
  type MotionPreference,
  useMotionPolicy,
} from "@yanimation/motion-kit/policy";
import { MotionPressable } from "@yanimation/motion-kit/pressable";
import { Reveal } from "@yanimation/motion-kit/reveal";
import { Stagger } from "@yanimation/motion-kit/stagger";
import { motionTransition } from "@yanimation/motion-kit/transitions";
import {
  choreography,
  distance,
  duration,
  easing,
  millisecondsToSeconds,
  reducedMotionPolicy,
  spring,
  stagger,
} from "@yanimation/motion-tokens";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const preferenceOptions: Array<{
  value: MotionPreference;
  label: string;
  description: string;
}> = [
  { value: "system", label: "跟随系统", description: "读取设备偏好" },
  { value: "full", label: "完整动效", description: "用于调试全量行为" },
  { value: "reduced", label: "减少动效", description: "模拟无障碍降级" },
];

const signals = [
  { id: "discover", label: "发现", value: "12 个新模式" },
  { id: "focus", label: "聚焦", value: "3 个高价值信号" },
  { id: "act", label: "行动", value: "建议进入验证" },
] as const;

const durationRows = Object.entries(duration) as Array<
  [keyof typeof duration, number]
>;

const springRows = Object.entries(spring) as Array<
  [keyof typeof spring, (typeof spring)[keyof typeof spring]]
>;

const decisionRules = [
  {
    title: "先表达意图，再选择数值",
    detail:
      "业务组件引用 enter、feedback、layout 等语义，不复制 280ms 或 stiffness 340。",
  },
  {
    title: "中断是默认能力",
    detail:
      "交互动画必须允许用户在上一段尚未结束时改变目标，弹簧会继承当前速度。",
  },
  {
    title: "减少位移，不删除信息",
    detail:
      "减少动效时把 transform 替换为短透明度变化，状态、层级与操作结果仍完整保留。",
  },
  {
    title: "跨运行时只共享事实",
    detail:
      "token 共享毫秒、曲线与物理参数；Motion 和 Remotion 分别负责自己的 API 适配。",
  },
];

const reducedMotionRows = [
  {
    id: reducedMotionPolicy.transform,
    title: "位移与缩放",
    detail: "改为短透明度过渡，避免大幅视觉旅行。",
  },
  {
    id: reducedMotionPolicy.layout,
    title: "布局变化",
    detail: "直接到达新位置，不播放共享布局弹簧。",
  },
  {
    id: reducedMotionPolicy.autoplay,
    title: "自动播放",
    detail: "默认暂停，等待用户明确请求播放。",
  },
  {
    id: reducedMotionPolicy.decorativeLoop,
    title: "装饰循环",
    detail: "移除不承载信息的持续运动。",
  },
  {
    id: reducedMotionPolicy.essentialState,
    title: "关键状态",
    detail: "保留完整结果与层级，只去除非必要位移。",
  },
];

function PreferenceStatus() {
  const { preference, shouldReduce } = useMotionPolicy();

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge variant={shouldReduce ? "secondary" : "default"}>
        {shouldReduce ? "位移已降级" : "完整运动"}
      </Badge>
      <span>
        当前策略：
        {preferenceOptions.find((option) => option.value === preference)?.label}
      </span>
    </div>
  );
}

function PrimitivePreview({ replayKey }: { replayKey: number }) {
  return (
    <Stagger.Root
      key={replayKey}
      tempo="standard"
      className="grid gap-3 sm:grid-cols-3"
    >
      {[
        ["层级出现", "Reveal / rise", "内容进入时建立阅读顺序"],
        ["操作反馈", "Pressable / compress", "按下反馈快速且可中断"],
        ["集合编排", "Stagger / standard", "子项按统一节奏依次出现"],
      ].map(([title, token, detail], index) => (
        <Stagger.Item key={title}>
          <MotionPressable
            type="button"
            feedback={index === 1 ? "compress" : "lift"}
            className="h-full w-full rounded-lg bg-muted/40 p-4 text-left ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="font-mono text-[0.68rem] tracking-wider text-primary uppercase">
              {token}
            </span>
            <span className="mt-3 block font-medium">{title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {detail}
            </span>
          </MotionPressable>
        </Stagger.Item>
      ))}
    </Stagger.Root>
  );
}

function InterruptionProbe() {
  const [activeSignal, setActiveSignal] = useState<(typeof signals)[number]>(
    signals[0],
  );

  return (
    <div className="space-y-4">
      <div
        className="grid gap-2 sm:grid-cols-3"
        role="tablist"
        aria-label="可中断状态"
      >
        {signals.map((signal) => {
          const active = signal.id === activeSignal.id;
          return (
            <MotionPressable
              key={signal.id}
              type="button"
              role="tab"
              aria-selected={active}
              feedback="quiet"
              onClick={() => setActiveSignal(signal)}
              className="relative overflow-hidden rounded-lg bg-muted/40 px-3 py-3 text-left ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {active ? (
                <motion.span
                  layoutId="motion-system-active-signal"
                  className="absolute inset-0 bg-primary/10"
                  transition={motionTransition.layout}
                />
              ) : null}
              <span className="relative text-sm font-medium">
                {signal.label}
              </span>
            </MotionPressable>
          );
        })}
      </div>
      <div className="min-h-28 overflow-hidden rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSignal.id}
            initial={{ opacity: 0, x: distance.standard }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -distance.compact }}
            transition={motionTransition.layout}
          >
            <p className="font-mono text-[0.68rem] tracking-wider text-primary uppercase">
              可中断目标
            </p>
            <p className="mt-2 text-xl font-semibold">{activeSignal.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              快速连续点击三个状态，观察动画从当前位置重新定向，而不是排队播放。
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TokenScale() {
  return (
    <div className="space-y-3">
      {durationRows.map(([name, milliseconds]) => (
        <div
          key={name}
          className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs"
        >
          <code className="font-mono text-foreground">{name}</code>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(2, (milliseconds / 900) * 100)}%` }}
            />
          </div>
          <span className="text-right tabular-nums text-muted-foreground">
            {milliseconds}ms
          </span>
        </div>
      ))}
    </div>
  );
}

function WorkbenchContent({
  replayKey,
  onReplay,
}: {
  replayKey: number;
  onReplay: () => void;
}) {
  return (
    <div className="space-y-6">
      <Stagger.Root
        tempo="compact"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          [Object.keys(duration).length, "时间档位", "0–900ms"],
          [Object.keys(easing).length, "缓动曲线", "进入 / 退出分离"],
          [Object.keys(spring).length, "弹簧角色", "反馈 / 空间 / 表达"],
          [2, "真实运行时", "Web + Remotion"],
        ].map(([value, label, detail]) => (
          <Stagger.Item key={label}>
            <Card className="h-full">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl">{value}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {detail}
              </CardContent>
            </Card>
          </Stagger.Item>
        ))}
      </Stagger.Root>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>组合原语预览</CardTitle>
              <CardDescription>
                同一套 token 驱动进入、操作反馈与集合编排；点击卡片可感受反馈。
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onReplay}>
              <span
                className="icon-[solar--restart-bold-duotone]"
                data-icon="inline-start"
                aria-hidden
              />
              重播进入
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <PreferenceStatus />
            <PrimitivePreview replayKey={replayKey} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>可中断交互</CardTitle>
            <CardDescription>
              layout 弹簧继承当前状态，新的用户输入不必等待旧动画结束。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InterruptionProbe />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>时间尺度</CardTitle>
            <CardDescription>
              毫秒是跨 CSS、Motion 与视频帧的源单位，运行时只做确定性换算。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenScale />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>弹簧角色</CardTitle>
            <CardDescription>
              物理值按用途命名；业务代码无需自行猜测 stiffness 与 damping。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {springRows.map(([name, values]) => (
              <div
                key={name}
                className="rounded-lg bg-muted/40 p-4 ring-1 ring-border"
              >
                <code className="font-mono text-xs text-primary">{name}</code>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">刚度</dt>
                    <dd className="mt-1 font-medium">{values.stiffness}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">阻尼</dt>
                    <dd className="mt-1 font-medium">{values.damping}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">质量</dt>
                    <dd className="mt-1 font-medium">{values.mass}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>系统规则</CardTitle>
          <CardDescription>
            原语只稳定已经出现第二消费者的能力，复杂时间轴与运行时特有逻辑仍留在实验内部。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {decisionRules.map((rule, index) => (
            <Reveal key={rule.title} preset={index % 2 === 0 ? "rise" : "fade"}>
              <div className="flex gap-3 rounded-lg bg-muted/40 p-4 ring-1 ring-border">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{rule.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {rule.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>减少动效策略</CardTitle>
          <CardDescription>
            策略控制运动表现，不改变内容可见性、焦点顺序或最终状态。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {reducedMotionRows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg bg-muted/40 p-3 ring-1 ring-border"
            >
              <p className="text-sm font-medium">{row.title}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {row.detail}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs leading-5 text-muted-foreground">
        当前编排基线：进入 {duration[choreography.enter.duration]}ms、交错
        {stagger[choreography.enter.stagger]}ms、位移
        {distance[choreography.enter.distance]}px；Motion 适配后为
        {millisecondsToSeconds(duration[choreography.enter.duration])} 秒。
      </p>
    </div>
  );
}

export function MotionSystemWorkbench() {
  const [preference, setPreference] = useState<MotionPreference>("system");
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge className="bg-primary-foreground/14 text-primary-foreground ring-1 ring-primary-foreground/20">
              实时策略控制
            </Badge>
            <CardTitle className="mt-3 text-2xl">
              一套动作语言，分别适配浏览器交互与确定性视频渲染。
            </CardTitle>
            <CardDescription className="mt-2 text-primary-foreground/75">
              切换策略会立即重算下方原语；“减少动效”保留透明度与最终状态，移除大幅位移和布局运动。
            </CardDescription>
          </div>
          <fieldset className="grid gap-2 sm:grid-cols-3">
            <legend className="sr-only">动效偏好</legend>
            {preferenceOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={preference === option.value ? "secondary" : "outline"}
                onClick={() => setPreference(option.value)}
                className={
                  preference === option.value
                    ? undefined
                    : "border-primary-foreground/25 bg-primary-foreground/8 text-primary-foreground hover:bg-primary-foreground/14 hover:text-primary-foreground"
                }
                title={option.description}
              >
                {option.label}
              </Button>
            ))}
          </fieldset>
        </CardHeader>
      </Card>

      <MotionPolicyProvider preference={preference}>
        <WorkbenchContent
          replayKey={replayKey}
          onReplay={() => setReplayKey((value) => value + 1)}
        />
      </MotionPolicyProvider>
    </div>
  );
}
