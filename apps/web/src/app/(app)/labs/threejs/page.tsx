import Link from "next/link";
import { ThreejsLabLoader } from "@/components/labs/threejs/threejs-lab-loader";
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
import { labs } from "@/lib/labs";

const capabilities = [
  {
    title: "空间场景图",
    detail: "用对象层级、透视相机、光照与材质表达真实的前后关系。",
    icon: "icon-[solar--layers-bold-duotone]",
  },
  {
    title: "GPU 帧预算",
    detail: "用点云合批、DPR 上限和 renderer.info 观察真实绘制成本。",
    icon: "icon-[solar--stopwatch-play-bold-duotone]",
  },
  {
    title: "命中与降级",
    detail: "射线检测负责画布命中，原生按钮提供等价键盘与语义路径。",
    icon: "icon-[solar--cursor-square-bold-duotone]",
  },
];

export default function ThreejsLabPage() {
  const lab = labs.threejs;
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon={lab.icon} />}
        title={lab.name}
        titleSuffix={<Badge>v0.8 参考实现</Badge>}
        description={lab.description}
        actions={
          <Button asChild variant="outline">
            <Link href="/labs/visual-guide">查看完整技术地图</Link>
          </Button>
        }
      />
      <PageContainer className="space-y-6">
        <ThreejsLabLoader />

        <section
          className="grid gap-4 md:grid-cols-3"
          aria-label="Three.js 能力说明"
        >
          {capabilities.map((capability) => (
            <Card key={capability.title}>
              <CardHeader>
                <span
                  className={`${capability.icon} size-5 text-primary`}
                  aria-hidden
                />
                <CardTitle className="text-base">{capability.title}</CardTitle>
                <CardDescription>{capability.detail}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>实验结论</CardTitle>
              <CardDescription>
                Three.js 是空间渲染层，不是常规界面动画库。
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6">
              当信息本身需要透视、相机、深度遮挡、三维模型或大量 GPU
              图元时，Three.js
              才带来不可替代的价值。普通按钮、列表、文字和二维数据图仍应留在 DOM
              /
              SVG；否则会用更高的包体、调试与可访问性成本换来并不存在的产品收益。
            </CardContent>
          </Card>
          <BoundaryCard
            title="应该负责"
            items={[
              "真实空间关系、相机叙事、3D 模型与 GPU 特效。",
              "明确帧预算下的大量三维图元与空间命中检测。",
            ]}
            positive
          />
          <BoundaryCard
            title="不应该负责"
            items={[
              "不替代常规 UI、文本、表单、二维图表和页面布局。",
              "不让 React state 承担逐帧对象位置或相机数据。",
            ]}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>从 Canvas 升级到 Three.js 的判断线</CardTitle>
            <CardDescription>
              两者都能做逐帧绘制，但拥有的坐标系统和工程责任不同。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-3">
            <Decision title="继续使用 Canvas">
              二维图元、屏幕坐标、粒子或轨迹已经足够，且不需要相机、光照和深度遮挡。
            </Decision>
            <Decision title="进入 Three.js">
              视觉含义依赖 3D 坐标、透视相机、模型、材质、光照或 GPU
              管线，而不只是“看起来更炫”。
            </Decision>
            <Decision title="保持混合分层">
              Three.js 负责空间舞台；DOM
              继续负责标题、按钮、说明、键盘操作与后备信息。
            </Decision>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}

function BoundaryCard({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-5">
              <span
                className={
                  positive
                    ? "icon-[solar--check-circle-bold] mt-0.5 size-4 shrink-0 text-primary"
                    : "icon-[solar--minus-circle-bold-duotone] mt-0.5 size-4 shrink-0 text-muted-foreground"
                }
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

function Decision({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-lg bg-muted/45 p-4 ring-1 ring-border">
      <p className="font-medium">{title}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}
