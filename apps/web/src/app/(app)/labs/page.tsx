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
                v0.8 Three.js 空间动画
              </Badge>
              <CardTitle className="mt-3 text-2xl">
                从二维画布进入可测量、可降级的空间舞台。
              </CardTitle>
              <CardDescription className="mt-2 text-primary-foreground/75">
                掌握场景图、相机、光照、射线检测、GPU 资源清理和帧预算，并明确
                Three.js 不应该接管哪些常规界面职责。
              </CardDescription>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href="/labs/threejs">
                打开空间实验
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
