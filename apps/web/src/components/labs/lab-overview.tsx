import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LabDefinition } from "@/lib/labs";

export function LabOverview({ lab }: { lab: LabDefinition }) {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon={lab.icon} />}
        title={lab.name}
        titleSuffix={<Badge variant="secondary">计划于 v0.4</Badge>}
        description={lab.description}
      />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>实验舞台</CardTitle>
            <CardDescription>
              此路由预留给 v0.4
              视觉运行时节点；只有实验正式开始时才会安装对应依赖。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-80 items-center justify-center rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground ring-1 ring-border">
              首个受控实验将在这里实现。
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>研究重点</CardTitle>
            <CardDescription>
              每个实验都应保持小而明确、可测量、可比较。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {lab.focus.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <span
                    className="icon-[solar--check-circle-bold] size-4 text-primary"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
