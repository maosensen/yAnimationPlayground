import Link from "next/link";
import type { ReactNode } from "react";
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
import type { LabDefinition } from "@/lib/labs";

type VisualLabPageProps = {
  lab: LabDefinition;
  stage: ReactNode;
  capabilities: Array<{ title: string; detail: string; icon: string }>;
  conclusion: string;
  responsibilities: string[];
  boundaries: string[];
};

export function VisualLabPage({
  lab,
  stage,
  capabilities,
  conclusion,
  responsibilities,
  boundaries,
}: VisualLabPageProps) {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon={lab.icon} />}
        title={lab.name}
        titleSuffix={<Badge>v0.4 参考实现</Badge>}
        description={lab.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/labs/living-data-story">查看旗舰作品</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/labs/visual-guide">查看技术选型</Link>
            </Button>
          </div>
        }
      />
      <PageContainer className="space-y-6">
        {stage}

        <section
          className="grid gap-4 md:grid-cols-3"
          aria-label="运行时能力说明"
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
                结论来自当前参考实现、构建产物与浏览器验证。
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6">
              {conclusion}
            </CardContent>
          </Card>
          <BoundaryList title="应该负责" items={responsibilities} positive />
          <BoundaryList title="不应该负责" items={boundaries} />
        </section>
      </PageContainer>
    </>
  );
}

function BoundaryList({
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
