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
import { labList } from "@/lib/labs";

export default function LabsPage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--test-tube-minimalistic-bold-duotone]" />
        }
        title="动画实验"
        description="在隔离的运行时边界内进行可控、可比较的浏览器动画实验。"
      />
      <PageContainer className="space-y-6">
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <Badge className="bg-primary-foreground/14 text-primary-foreground ring-1 ring-primary-foreground/20">
                v0.3 参考实验套件
              </Badge>
              <CardTitle className="mt-3 text-2xl">
                同一个故事，三种动效模型，一套有依据的默认策略。
              </CardTitle>
              <CardDescription className="mt-2 text-primary-foreground/75">
                在相同舞台、播放控制、视口预设和减弱动态效果规范下，对比原生
                CSS/SVG、Motion 与 GSAP。
              </CardDescription>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href="/labs/compare">
                查看技术选型指南
                <span
                  className="icon-[solar--arrow-right-up-bold-duotone]"
                  data-icon="inline-end"
                  aria-hidden
                />
              </Link>
            </Button>
          </CardHeader>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {labList.map((lab) => (
            <Card key={lab.slug} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className={`${lab.icon} size-5`} aria-hidden />
                  </div>
                  <Badge
                    variant={
                      lab.status === "reference" ? "default" : "secondary"
                    }
                  >
                    {lab.status === "reference" ? "参考实现" : "规划中"}
                  </Badge>
                </div>
                <CardTitle>{lab.name}</CardTitle>
                <CardDescription>{lab.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/labs/${lab.slug}`}>
                    {lab.status === "reference" ? "打开实验" : "查看范围"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
