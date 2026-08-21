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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeToFrameDemo } from "./time-to-frame-demo";

const capabilities = [
  {
    title: "把 Web 技术变成视频画面",
    description:
      "直接使用 HTML、CSS、SVG、Canvas、WebGL 与本地媒体构建镜头，不需要先转换成另一套视觉描述语言。",
    icon: "icon-[solar--code-square-bold-duotone]",
  },
  {
    title: "用秒组织可寻址时间线",
    description:
      "每个片段声明开始时间、持续时间与轨道；暂停的 GSAP timeline 负责把任意时刻映射到确定的视觉状态。",
    icon: "icon-[solar--stopwatch-play-bold-duotone]",
  },
  {
    title: "组合多个独立镜头",
    description:
      "主合成通过 data-composition-src 挂载子合成，让场景、音轨和转场可以分别检查、替换与复用。",
    icon: "icon-[solar--layers-bold-duotone]",
  },
  {
    title: "在 Studio 中预览与审查",
    description:
      "可视化时间轴支持播放、seek、分层查看与元素检查，适合在渲染前完成镜头和声音的人工门禁。",
    icon: "icon-[solar--clapperboard-edit-bold-duotone]",
  },
  {
    title: "执行面向视频的自动检查",
    description:
      "CLI 可以检查合成契约、运行时错误、布局溢出、文字遮挡、对比度与指定时间点的关键帧。",
    icon: "icon-[solar--shield-check-bold-duotone]",
  },
  {
    title: "从浏览器状态渲染成片",
    description:
      "渲染器逐帧驱动浏览器、捕获画面、混合音频，再交给编码器输出 MP4、WebM、MOV 或图片序列。",
    icon: "icon-[solar--video-frame-play-horizontal-bold-duotone]",
  },
];

const productionSteps = [
  {
    index: "01",
    title: "事实与脚本",
    description: "确定产品事实、受众、叙事主张、时长和不可虚构的边界。",
    owner: "人工门禁",
  },
  {
    index: "02",
    title: "素材清单",
    description:
      "收集官网画面、录屏、图片、字体、旁白、音乐和音效，并记录来源。",
    owner: "人工门禁",
  },
  {
    index: "03",
    title: "镜头合成",
    description:
      "把叙事拆成独立 HTML 子合成，明确每个镜头的进入、动作、退出与交接载体。",
    owner: "HyperFrames",
  },
  {
    index: "04",
    title: "时间线",
    description:
      "使用 paused GSAP timeline 描述每个时刻的状态，避免随机数、定时器和不可 seek 动画。",
    owner: "HyperFrames",
  },
  {
    index: "05",
    title: "声音编排",
    description:
      "把旁白作为节奏主轴，音乐提供能量曲线，音效只强化有因果关系的操作。",
    owner: "人工门禁",
  },
  {
    index: "06",
    title: "检查与审片",
    description:
      "运行 lint、check、snapshot，并在 Studio 中完整播放、逐段 seek、检查接缝。",
    owner: "HyperFrames",
  },
  {
    index: "07",
    title: "逐帧渲染",
    description:
      "按 FPS 计算时间、驱动浏览器绘制每一帧、编码视频并验证最终媒体参数。",
    owner: "HyperFrames",
  },
];

const qualityRisks = [
  [
    "信息正确",
    "从页面和仓库提取文字、图片、录屏与数据",
    "判断哪些事实值得进入叙事，以及怎样避免内容堆砌",
  ],
  [
    "镜头设计",
    "快速生成布局、图层和时间线初稿",
    "控制视觉重心、空间层级、镜头目的与观看路径",
  ],
  [
    "运动品质",
    "精确执行缓动、stagger、遮罩、相机和路径动画",
    "统一速度语言，处理重量感、停顿、预备动作与余韵",
  ],
  [
    "场景接缝",
    "提供可复用的转场技术和逐帧时间控制",
    "选择连续载体，匹配速度、方向、构图和声音的相位",
  ],
  [
    "声音设计",
    "挂载多轨音频、自动 duck、淡入淡出并参与渲染",
    "旁白表演、音乐选择、混音层次和情绪推进仍需听觉判断",
  ],
  [
    "最终完成度",
    "批量快照、布局检查和确定性渲染能消灭技术性错误",
    "字体、裁切、对比、密度与每一帧是否“高级”无法只靠规则证明",
  ],
];

const qualityLevels = [
  {
    score: "30–40",
    title: "概念样片",
    description:
      "叙事方向可理解，功能都出现了，时间线也能完整播放；但镜头语言、细节密度和声音仍暴露明显的生成痕迹。",
    state: "本项目当前三支生成式产品片所处区间",
  },
  {
    score: "60",
    title: "合格成片",
    description:
      "信息准确、节奏连贯、视觉统一、接缝无明显破绽，普通观众不会首先注意到制作缺陷。",
    state: "需要至少一轮结构修订与一轮逐段精修",
  },
  {
    score: "90",
    title: "超出预期",
    description:
      "镜头本身有作者判断，素材与动效互相成就，声音推动叙事，关键瞬间具有可记忆的设计。",
    state: "需要导演式分镜、专门资产和逐帧审美验收",
  },
];

const experimentEvidence = [
  {
    title: "TanStarter 初版",
    project: "tanstarter-promo",
    findings:
      "产品事实源选错，同名项目混淆；即使画面可播放，叙事基线已经失效。",
    dimension: "事实正确性",
  },
  {
    title: "TanStarter 参考片重制",
    project: "tanstarter-reference-promo",
    findings:
      "视觉方向明显改善，但接缝、局部运动和信息层级仍没有达到参考片的流畅度。",
    dimension: "运动与接缝",
  },
  {
    title: "Eagle 产品演示",
    project: "eagle-product-demo",
    findings:
      "能够表达功能与大致思路，但官方素材、代码动效和声音之间缺少逐镜头精修。",
    dimension: "镜头完成度",
  },
];

const reliableWorkflow = [
  {
    title: "结构样片",
    output: "只验证事实、脚本、旁白和镜头顺序",
    gate: "关闭精细视觉制作，先确认这条故事值得做",
  },
  {
    title: "动态预演",
    output: "用低成本素材验证节奏、机位、转场和时长",
    gate: "所有接缝都能在灰盒阶段说清因果关系",
  },
  {
    title: "英雄镜头",
    output: "先把最关键的 2–3 个镜头做到目标品质",
    gate: "以真实关键帧锁定字体、材质、运动和细节标准",
  },
  {
    title: "全片精修",
    output: "按已经证明的标准扩展到全部镜头并完成混音",
    gate: "检查器消灭技术问题，人逐帧决定是否足够好",
  },
];

export default function HyperframesGuidePage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--video-frame-play-horizontal-bold-duotone]" />
        }
        title="HyperFrames 功能与制作原理"
        titleSuffix={<Badge>当前研究结论</Badge>}
        description="理解它在视频生产链中的真实位置、时间如何变成帧，以及为什么可渲染不等于专业成片。"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/labs/hyperframes/examples">查看实际示例</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/labs/code-video">查看 Remotion 对比</Link>
            </Button>
          </div>
        }
      />

      <PageContainer className="space-y-8">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
            <CardHeader className="justify-center gap-5 p-6 lg:p-10">
              <CardTitle className="max-w-3xl text-3xl leading-tight sm:text-4xl">
                它不是 AI 视频模型，而是一套可寻址的浏览器视频工程。
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                HyperFrames 把 Web
                页面当作画面，把秒当作时间坐标，把浏览器当作渲染舞台。 Agent
                可以生成工程，Studio 可以审查时间线，CLI
                可以逐帧捕获并编码；但脚本、导演、设计和审美判断不会因此自动完成。
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {[
                  "HTML / CSS / SVG",
                  "Seek-safe GSAP",
                  "Studio timeline",
                  "Browser renderer",
                ].map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <div className="bg-muted/45 p-6 ring-1 ring-border lg:p-8">
              <div className="flex h-full flex-col justify-center gap-3">
                <SystemLayer
                  icon="icon-[solar--document-add-bold-duotone]"
                  title="输入"
                  detail="事实 · 脚本 · 素材 · 音轨"
                />
                <Connector label="创作" />
                <SystemLayer
                  icon="icon-[solar--code-circle-bold-duotone]"
                  title="合成"
                  detail="HTML 场景 · GSAP 时间线"
                />
                <Connector label="seek" />
                <SystemLayer
                  icon="icon-[solar--monitor-camera-bold-duotone]"
                  title="浏览器"
                  detail="在时间 t 绘制确定画面"
                />
                <Connector label="逐帧" />
                <SystemLayer
                  icon="icon-[solar--clapperboard-play-bold-duotone]"
                  title="输出"
                  detail="视频帧 · 混合音频 · 编码文件"
                />
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-semibold">它具体提供什么</h2>
            <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">
              它提供的是一组从“可编辑 Web
              画面”到“确定性视频文件”的工程能力，而不是一个替你完成所有创意判断的黑箱。
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              {capabilities.map((capability, index) => (
                <div key={capability.title}>
                  <div className="grid gap-3 p-5 sm:grid-cols-[2.5rem_13rem_minmax(0,1fr)] sm:items-start">
                    <span
                      className={`${capability.icon} size-5 text-primary sm:mt-0.5`}
                      aria-hidden
                    />
                    <p className="font-medium">{capability.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                  {index < capabilities.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>一条视频如何从时间变成帧</CardTitle>
            <CardDescription>
              核心不是“让网页自己播放”，而是渲染器主动询问每一个时间点应该长什么样。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimeToFrameDemo />
            <div className="rounded-lg bg-muted/45 p-4 font-mono text-sm leading-7 ring-1 ring-border">
              frame n → t = n / fps → timeline.seek(t) → browser paint → capture
              → encode
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Principle
                title="HTML 决定有什么"
                description="DOM、样式、图片、视频、SVG 与 Canvas 组成某个镜头可被浏览器绘制的视觉树。"
              />
              <Principle
                title="时间线决定此刻是什么状态"
                description="paused GSAP timeline 接受任意秒数，计算位置、透明度、裁切、滤镜和其他属性。"
              />
              <Principle
                title="渲染器决定如何成为文件"
                description="每一帧都从明确的 t 重新求值、捕获，再与音轨一起交给编码器，不依赖实时播放速度。"
              />
            </div>
          </CardContent>
        </Card>

        <section>
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">完整生产链</h2>
              <div className="flex gap-2">
                <Badge>HyperFrames</Badge>
                <Badge variant="outline">人工门禁</Badge>
              </div>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              工具主要承担镜头合成、时间线、检查和渲染；事实、素材与声音判断即使可以由
              Agent 辅助，也不能取消独立验收。
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productionSteps.map((step) => (
              <li
                key={step.index}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg bg-card p-5 ring-1 ring-border"
              >
                <span className="font-medium tabular-nums text-primary">
                  {step.index}
                </span>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-medium">{step.title}</h3>
                    <Badge
                      variant={
                        step.owner === "HyperFrames" ? "secondary" : "outline"
                      }
                    >
                      {step.owner}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>为什么“一次生成”很难稳定成为专业方法</CardTitle>
            <CardDescription>
              工程规则擅长消灭确定性错误；专业完成度来自大量无法仅靠规则证明的连续判断。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>质量维度</TableHead>
                    <TableHead>HyperFrames / Agent 擅长</TableHead>
                    <TableHead>仍需人工主导</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityRisks.map(([dimension, automation, judgment]) => (
                    <TableRow key={dimension}>
                      <TableCell className="font-medium">{dimension}</TableCell>
                      <TableCell className="min-w-72 whitespace-normal leading-6 text-muted-foreground">
                        {automation}
                      </TableCell>
                      <TableCell className="min-w-72 whitespace-normal leading-6">
                        {judgment}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="divide-y md:hidden">
              {qualityRisks.map(([dimension, automation, judgment]) => (
                <section key={dimension} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-medium">{dimension}</h3>
                  <dl className="mt-4 space-y-4 text-sm leading-6">
                    <div>
                      <dt className="text-xs font-medium text-primary">
                        HyperFrames / Agent 擅长
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {automation}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium">仍需人工主导</dt>
                      <dd className="mt-1">{judgment}</dd>
                    </div>
                  </dl>
                </section>
              ))}
            </div>
          </CardContent>
        </Card>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              30 分、60 分与 90 分的分界
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              这是本项目基于三次产品视频实验建立的内部评价标尺，不是 HyperFrames
              官方评分。
            </p>
          </div>
          <div className="grid overflow-hidden rounded-xl bg-card ring-1 ring-border lg:grid-cols-3">
            {qualityLevels.map((level, index) => (
              <div
                key={level.score}
                className="p-6 lg:min-h-64 lg:p-8 [&:not(:first-child)]:border-t lg:[&:not(:first-child)]:border-t-0 lg:[&:not(:first-child)]:border-l"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={index === 2 ? "default" : "secondary"}>
                    {level.score} 分
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {level.title}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-6">{level.description}</p>
                <p className="mt-5 border-t pt-4 text-sm leading-6 text-muted-foreground">
                  {level.state}
                </p>
              </div>
            ))}
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">三次实验的判断依据</CardTitle>
              <CardDescription>
                评分不是由“是否渲染成功”决定，而是把每支片暴露出的主要缺陷映射到质量维度。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-3">
              {experimentEvidence.map((experiment) => (
                <article key={experiment.project}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{experiment.title}</h3>
                    <Badge variant="outline">{experiment.dimension}</Badge>
                  </div>
                  <code className="mt-2 block text-xs text-muted-foreground">
                    {experiment.project}
                  </code>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {experiment.findings}
                  </p>
                </article>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>更可靠的下一版工作方式</CardTitle>
            <CardDescription>
              不再要求一次提示交付全片，而是把最贵的审美判断提前暴露、逐层锁定。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-4">
            {reliableWorkflow.map((phase, index) => (
              <div key={phase.title} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <h3 className="font-medium">{phase.title}</h3>
                </div>
                <p className="text-sm leading-6">{phase.output}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  门禁：{phase.gate}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          <BoundaryCard
            title="适合继续使用 HyperFrames"
            icon="icon-[solar--check-circle-bold-duotone]"
            items={[
              "视觉材料天然来自网页、SVG、数据或产品界面。",
              "需要 Agent 直接读写、可检查、可重复的代码工程。",
              "团队愿意把分镜、关键镜头和最终审片作为独立人工步骤。",
              "目标是中短产品演示、动态图形、版本介绍或数据叙事。",
            ]}
          />
          <BoundaryCard
            title="不应该只靠 HyperFrames 插件"
            icon="icon-[solar--danger-triangle-bold-duotone]"
            items={[
              "期待一句提示稳定生成 90 分品牌宣传片。",
              "主要价值来自真人表演、复杂摄影、写实特效或情绪化剪辑。",
              "没有人负责素材导演、节奏判断、混音和逐帧完成度。",
              "把自动检查通过误认为审美质量已经通过。",
            ]}
          />
        </section>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <CardTitle className="text-2xl">
                当前结论：保留 HyperFrames
                作为渲染与编排层，不再把插件本身当作完整制作方法论。
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl leading-6 text-primary-foreground/75">
                下一轮真正值得验证的不是“能否再生成一支”，而是结构样片、英雄镜头定标、分段精修和最终审片这套多阶段流程，能否稳定把作品从
                30–40 分推到 60 分以上。
              </CardDescription>
            </div>
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/labs/ai-pipeline">查看 AI 动画生产管线</Link>
            </Button>
          </CardHeader>
        </Card>
      </PageContainer>
    </>
  );
}

function SystemLayer({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 rounded-lg bg-card p-4 ring-1 ring-border">
      <span
        className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
        aria-hidden
      >
        <span className={`${icon} size-5`} />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 text-xs text-muted-foreground">
      <span className="h-5 w-px bg-border" />
      <span>{label}</span>
    </div>
  );
}

function Principle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function BoundaryCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className={`${icon} size-5 text-primary`} aria-hidden />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6">
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
