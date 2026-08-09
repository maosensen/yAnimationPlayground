import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const contractMetrics = [
  ["时长", "36 秒"],
  ["帧率", "30 FPS"],
  ["横版", "1920 × 1080"],
  ["竖版", "1080 × 1920"],
  ["音频", "48 kHz / 单声道"],
  ["场景", "5 个连续章节"],
];

const comparisonRows = [
  ["创作模型", "React 组件 + 帧", "HTML + data attributes + 秒"],
  ["动画驱动", "useCurrentFrame / interpolate", "可 seek 的 GSAP 时间轴"],
  ["类型边界", "TypeScript props 天然完整", "数据契约在生成阶段校验"],
  ["本地预览", "Remotion Studio", "HyperFrames Studio + 可视时间轴"],
  [
    "复用优势",
    "复用 React 组件与前端工程能力",
    "复用 HTML、CSS、GSAP 与 Agent 产出",
  ],
  [
    "当前成熟度",
    "生态成熟、渲染与云端路径清晰",
    "迭代活跃、HTML 与 Agent 工作流突出",
  ],
  [
    "本项目默认结论",
    "生产型 React 视频的默认方案",
    "HTML/Agent 视频管线的重点观察方案",
  ],
];

const workflow = [
  ["1", "修改契约", "先改共享 brief、场景时间、安全区与资产清单。"],
  ["2", "同步输入", "生成确定性音轨，并把同一输入送入两个独立工程。"],
  ["3", "分别预览", "在各自 Studio 中检查时间轴、横竖构图与关键帧。"],
  ["4", "执行渲染", "四条命令输出两种运行时的横版与竖版成片。"],
  ["5", "媒体验收", "用 ffprobe 校验尺寸、时长、帧率、视频与音频编码。"],
];

export default function CodeVideoPage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--video-frame-play-horizontal-bold-duotone]" />
        }
        title="代码视频生产"
        titleSuffix={<Badge>v0.5 参考实现</Badge>}
        description="用同一份生产契约驱动 Remotion 与 HyperFrames，比较从预览到成片验收的完整路径。"
        actions={
          <Button variant="outline" asChild>
            <Link href="/labs/visual-guide">返回视觉运行时指南</Link>
          </Button>
        }
      />
      <PageContainer className="space-y-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <Badge className="w-fit bg-primary-foreground/14 text-primary-foreground ring-1 ring-primary-foreground/20">
              当前结论
            </Badge>
            <CardTitle className="mt-2 text-2xl">
              默认选择 Remotion；需要 HTML 原生交付或 Agent 主导创作时重点评估
              HyperFrames。
            </CardTitle>
            <CardDescription className="max-w-4xl leading-6 text-primary-foreground/75">
              两者不是网页动画库，而是独立的视频生产工程。共享 brief、设计 token
              与源素材即可；渲染实现、依赖和运维生命周期应继续隔离。
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2" aria-label="视频运行时">
          <RuntimeCard
            title="Remotion"
            badge="帧驱动 React"
            command="pnpm --filter @yanimation/remotion dev"
            points={[
              "Composition 直接声明宽高、FPS、帧数与 typed props。",
              "适合复用 React 组件、数据层和既有 TypeScript 工程能力。",
              "本地 Studio 运行于 4405，横竖版都由同一个组件响应画布。",
            ]}
          />
          <RuntimeCard
            title="HyperFrames"
            badge="可 seek HTML"
            command="pnpm --filter @yanimation/hyperframes dev"
            points={[
              "HTML data attributes 描述片段，GSAP paused timeline 描述运动。",
              "适合 HTML/CSS 资产、Agent 直接生成与可视化时间轴检查。",
              "横竖版保持两个合法单根工程，避免运行时入口与音轨互相污染。",
            ]}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>共享生产契约</CardTitle>
            <CardDescription>
              两套实现必须消费同一份输入，才能把比较重点放在渲染模型而不是内容差异。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {contractMetrics.map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg bg-muted/45 p-4 ring-1 ring-border"
              >
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium tabular-nums">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>从 brief 到成片</CardTitle>
            <CardDescription>
              生产过程保持显式、可审查、可重复；不依赖手动拖拽才能恢复结果。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 lg:grid-cols-5">
              {workflow.map(([index, title, description]) => (
                <li
                  key={index}
                  className="rounded-lg bg-muted/45 p-4 ring-1 ring-border"
                >
                  <Badge variant="secondary">{index}</Badge>
                  <p className="mt-3 font-medium">{title}</p>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>运行时比较</CardTitle>
            <CardDescription>
              结论来自同一份 36 秒横竖双版参考作品，而不是孤立的 Hello World。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>维度</TableHead>
                  <TableHead>Remotion</TableHead>
                  <TableHead>HyperFrames</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map(([dimension, remotion, hyperframes]) => (
                  <TableRow key={dimension}>
                    <TableCell className="font-medium">{dimension}</TableCell>
                    <TableCell className="min-w-64 whitespace-normal leading-5">
                      {remotion}
                    </TableCell>
                    <TableCell className="min-w-64 whitespace-normal leading-5">
                      {hyperframes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>常用命令</CardTitle>
            <CardDescription>
              输出目录不进入 Git；契约、生成器和验收报告进入版本控制。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Command
              value="pnpm video:prepare"
              description="校验契约并同步两套工程输入"
            />
            <Command
              value="pnpm video:check"
              description="枚举 Composition 并检查 HTML 时间轴"
            />
            <Command
              value="pnpm video:render"
              description="渲染四条横竖版 MP4"
            />
            <Command
              value="pnpm video:inspect"
              description="核对尺寸、时长、帧率与音轨"
            />
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}

function RuntimeCard({
  title,
  badge,
  command,
  points,
}: {
  title: string;
  badge: string;
  command: string;
  points: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">{badge}</Badge>
        </div>
        <CardDescription>
          <code>{command}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-5">
              <span
                className="icon-[solar--check-circle-bold] mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function Command({
  value,
  description,
}: {
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-muted/45 p-4 ring-1 ring-border">
      <code className="text-sm font-medium">{value}</code>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
