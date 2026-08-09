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

const runtimeRows = [
  [
    "CSS + SVG",
    "原生视觉基线",
    "少量状态、装饰、图标与路径",
    "代码 / DOM",
    "低",
  ],
  [
    "Motion",
    "React 交互运行时",
    "组件状态、手势、布局与进入退出",
    "代码 / DOM",
    "低至中",
  ],
  [
    "GSAP",
    "时间轴编排器",
    "复杂序列、滚动叙事、命令式舞台",
    "代码 / DOM",
    "中",
  ],
  [
    "D3",
    "数据与几何工具箱",
    "比例尺、聚合、路径、布局输入",
    "代码 / SVG 或 Canvas",
    "按渲染层决定",
  ],
  [
    "Lottie",
    "线性矢量资产运行时",
    "品牌短片、图标、空状态、反馈",
    "设计资产 / JSON",
    "中",
  ],
  [
    "Rive",
    "交互矢量状态机",
    "角色、控件、多状态品牌交互",
    "设计资产 / .riv",
    "中至高",
  ],
  [
    "Canvas",
    "即时绘制表面",
    "粒子、轨迹、高密度实时图元",
    "代码 / 位图表面",
    "中至高",
  ],
  [
    "Remotion / HyperFrames",
    "视频输出工程",
    "批量视频、模板化内容与离线渲染",
    "独立视频工程",
    "与网页运行时分离",
  ],
];

const decisions = [
  {
    question: "元素是否需要语义、焦点或文本选择？",
    answer: "需要时优先 DOM / SVG；不要先选 Canvas。",
    icon: "icon-[solar--accessibility-bold-duotone]",
  },
  {
    question: "运动由应用状态还是设计资产定义？",
    answer: "应用状态选 Motion；线性资产选 Lottie；资产内多状态选 Rive。",
    icon: "icon-[solar--branching-paths-down-bold-duotone]",
  },
  {
    question: "真正困难的是数据几何还是播放过程？",
    answer: "几何交给 D3，过渡再交给 Motion、GSAP 或 Canvas。",
    icon: "icon-[solar--chart-square-bold-duotone]",
  },
  {
    question: "是否有数百个以上逐帧变化的图元？",
    answer: "有明确吞吐需求时再进入 Canvas，并先定义帧预算。",
    icon: "icon-[solar--stopwatch-play-bold-duotone]",
  },
];

export default function VisualGuidePage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--map-arrow-square-bold-duotone]" />
        }
        title="视觉运行时选型指南"
        titleSuffix={<Badge>v0.4 结论</Badge>}
        description="先判断谁拥有状态、资产和渲染表面，再决定动画技术。"
        actions={
          <Button asChild>
            <Link href="/labs/living-data-story">打开旗舰作品</Link>
          </Button>
        }
      />
      <PageContainer className="space-y-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <Badge className="w-fit bg-primary-foreground/14 text-primary-foreground ring-1 ring-primary-foreground/20">
              推荐默认策略
            </Badge>
            <CardTitle className="mt-2 text-2xl">
              从 CSS / SVG + Motion 开始，按缺失能力加层。
            </CardTitle>
            <CardDescription className="max-w-3xl leading-6 text-primary-foreground/75">
              数据几何加 D3，精密序列加 GSAP，线性设计资产加 Lottie，交互资产加
              Rive，高密度即时绘制才加 Canvas。Remotion 与 HyperFrames
              属于视频生产工程，不与网页交互运行时争夺同一个位置。
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-2" aria-label="选型问题">
          {decisions.map((decision) => (
            <Card key={decision.question}>
              <CardHeader className="grid grid-cols-[auto_1fr] gap-x-3">
                <span
                  className={`${decision.icon} mt-0.5 size-5 text-primary`}
                  aria-hidden
                />
                <div>
                  <CardTitle className="text-base">
                    {decision.question}
                  </CardTitle>
                  <CardDescription className="mt-2 leading-5">
                    {decision.answer}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>技术在体系中的位置</CardTitle>
            <CardDescription>
              “产品适配”比抽象的性能排名更重要；渲染成本需要用真实作品测量。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>技术</TableHead>
                  <TableHead>系统位置</TableHead>
                  <TableHead>最佳任务</TableHead>
                  <TableHead>所有权</TableHead>
                  <TableHead>工程负担</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runtimeRows.map(
                  ([runtime, position, fit, ownership, burden]) => (
                    <TableRow key={runtime}>
                      <TableCell className="font-medium">{runtime}</TableCell>
                      <TableCell>{position}</TableCell>
                      <TableCell className="min-w-56 whitespace-normal leading-5">
                        {fit}
                      </TableCell>
                      <TableCell className="min-w-44 whitespace-normal leading-5">
                        {ownership}
                      </TableCell>
                      <TableCell>{burden}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="上线门禁">
          <GateCard
            title="可访问性"
            items={[
              "所有操作有原生按钮、标签和键盘路径。",
              "图形之外提供文字洞察或结构化数据后备。",
              "prefers-reduced-motion 下保留信息而非只关闭页面。",
            ]}
          />
          <GateCard
            title="性能与生命周期"
            items={[
              "记录资产体积、帧时间、DPR 与测试设备。",
              "重型运行时按路由或功能动态加载。",
              "销毁实例、取消 rAF、断开 Observer 与事件监听。",
            ]}
          />
          <GateCard
            title="资产与团队流程"
            items={[
              "明确源文件、导出文件和运行时版本的负责人。",
              "把 Rive input、Lottie marker 当作版本化接口。",
              "关键资产自托管并为网络或解析失败准备海报。",
            ]}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>最终规则</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-3">
            <Rule number="01" title="先定所有权">
              React 拥有业务状态；运行时只拥有视觉执行。
            </Rule>
            <Rule number="02" title="先分图层">
              同一作品可以组合技术，但每层只有一个明确负责人。
            </Rule>
            <Rule number="03" title="测量后升级">
              没有真实瓶颈时，不因“更专业”而换成更重的运行时。
            </Rule>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}

function GateCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-5">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span
                className="icon-[solar--check-circle-bold] mt-0.5 size-4 shrink-0 text-primary"
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

function Rule({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-4 ring-1 ring-border">
      <p className="font-mono text-xs text-primary">{number}</p>
      <p className="mt-2 font-medium">{title}</p>
      <p className="mt-1 leading-5 text-muted-foreground">{children}</p>
    </div>
  );
}
