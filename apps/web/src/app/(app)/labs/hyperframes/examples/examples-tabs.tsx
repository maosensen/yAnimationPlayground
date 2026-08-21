"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparisonPlayer } from "./comparison-player";

const examples = [
  {
    id: "remotion-comparison",
    label: "HyperFrames vs Remotion",
    status: "可运行",
  },
];

export function ExamplesTabs() {
  return (
    <Tabs defaultValue={examples[0]?.id} className="gap-5">
      <TabsList
        variant="line"
        className="h-auto max-w-full justify-start overflow-x-auto"
      >
        {examples.map((example) => (
          <TabsTrigger
            key={example.id}
            value={example.id}
            className="gap-2 px-3 py-2"
          >
            {example.label}
            <Badge variant="secondary" className="pointer-events-none">
              {example.status}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="remotion-comparison" className="space-y-6">
        <ComparisonPlayer />

        <div className="grid gap-8 border-t pt-6 lg:grid-cols-2">
          <ExampleNotes
            title="这个示例验证什么"
            items={[
              "一个标准 HyperFrames HTML 合成可以直接嵌入 Playground 观看。",
              "Remotion 的 frame 模型与 HyperFrames 的 time + seek 模型可以用同一条叙事直观比较。",
              "播放、暂停、逐帧拖动和章节跳转都由页面控制，但最终画面仍来自同一条可 seek 时间线。",
            ]}
          />
          <ExampleNotes
            title="这次刻意不做什么"
            items={[
              "不使用图片、录屏、视频或品牌素材，只验证 HTML 动画本身。",
              "不添加旁白、音乐和音效，避免声音掩盖运动与信息结构问题。",
              "不提供渲染和导出入口；本阶段只把可观看、可调试的动画做完整。",
            ]}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ExampleNotes({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-muted-foreground"
          >
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
