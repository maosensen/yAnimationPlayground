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

const matrix = [
  ["最适合的角色", "原生能力基线", "React 交互", "精细编排"],
  ["控制模型", "状态 + 关键帧", "组件 + 动画值", "显式时间轴"],
  ["布局 / 挂载状态", "手动处理", "一等能力", "需要手动测量"],
  ["时间轴定位", "需要 WAAPI 桥接", "支持", "一等能力"],
  ["路由独占 gzip", "约 0.9 kB", "约 52 kB", "约 1.3 kB + 27 kB 懒加载"],
  ["中断处理", "适合简单状态", "优秀", "单一时钟下优秀"],
  ["调试方式", "DevTools 样式面板", "React + 动画作用域", "时间轴 + 标签"],
  ["创作能力上限", "短小编排", "产品交互", "高密度序列"],
];

const choices = [
  {
    step: "01",
    title: "CSS 能否清楚表达效果？",
    detail:
      "优先使用 transition、关键帧和 SVG；当播放控制或阶段协调开始成为主要难点时停止继续堆叠。",
    href: "/labs/css-svg",
    cta: "测试原生方案",
  },
  {
    step: "02",
    title: "动画是否源自 React 状态？",
    detail:
      "需要挂载状态、布局、手势、弹簧和理解中断的组件行为时，选择 Motion。",
    href: "/labs/motion",
    cta: "测试 Motion",
  },
  {
    step: "03",
    title: "时间轴本身是否就是作品？",
    detail:
      "当命名提示点、高密度重叠、拖动定位和反复编辑足以证明显式时钟的价值时，选择 GSAP。",
    href: "/labs/gsap",
    cta: "测试 GSAP",
  },
];

export default function RuntimeDecisionGuidePage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--branching-paths-up-bold-duotone]" />
        }
        title="交互动效运行时选型指南"
        titleSuffix={<Badge>v0.3 结论</Badge>}
        description="基于同一个真实产品叙事实验得到的升级路径。"
      />
      <PageContainer className="space-y-6">
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardHeader>
            <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-70">
              默认策略
            </p>
            <CardTitle className="max-w-3xl text-2xl sm:text-3xl">
              原生 CSS/SVG 优先，React 交互使用 Motion，精细编排升级到 GSAP。
            </CardTitle>
            <CardDescription className="max-w-2xl text-primary-foreground/75">
              这些工具并不是同一层级的竞争者，而是根据控制复杂度和职责归属逐级升级的技术阶梯。
            </CardDescription>
          </CardHeader>
        </Card>

        <section
          className="grid gap-4 lg:grid-cols-3"
          aria-label="运行时选型路径"
        >
          {choices.map((choice) => (
            <Card key={choice.step} className="flex flex-col">
              <CardHeader>
                <span className="font-mono text-xs text-primary">
                  {choice.step}
                </span>
                <CardTitle>{choice.title}</CardTitle>
                <CardDescription>{choice.detail}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href={choice.href}>{choice.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>能力对比矩阵</CardTitle>
            <CardDescription>
              数据来自本地 v0.3 生产构建。路由独占体积在排除共享应用外壳 chunk
              后测得，具体数值会随打包结果变化。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>对比维度</TableHead>
                  <TableHead>CSS + SVG</TableHead>
                  <TableHead>Motion</TableHead>
                  <TableHead>GSAP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.map(([criterion, native, motion, gsap]) => (
                  <TableRow key={criterion}>
                    <TableCell className="font-medium">{criterion}</TableCell>
                    <TableCell>{native}</TableCell>
                    <TableCell>{motion}</TableCell>
                    <TableCell>{gsap}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>组合使用规则</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                保持职责局部化：CSS 负责持久的状态反馈，Motion 负责 React
                交互，GSAP 负责经过明确设计的主时间轴。
              </p>
              <p>
                只有每个图层都明确服从一个时钟时，混合使用才是安全的。不要让
                CSS、Motion 和 GSAP 同时写入同一个 transform 属性。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>可访问性规则</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                三套参考实现启用“减弱动态效果”后都会立即显示完成状态；信息获取不依赖观看完整动画。
              </p>
              <p>
                播放控制必须支持键盘操作，每个舞台还要在视觉 SVG
                图层之外保留语义化文本。
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </>
  );
}
