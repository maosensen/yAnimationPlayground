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

type InteractionLabPageProps = {
  lab: LabDefinition;
  benchmark: ReactNode;
  recommendation: string;
  useWhen: string[];
  avoidWhen: string[];
  capabilities: Array<{ title: string; detail: string; icon: string }>;
  probe?: ReactNode;
};

export function InteractionLabPage({
  lab,
  benchmark,
  recommendation,
  useWhen,
  avoidWhen,
  capabilities,
  probe,
}: InteractionLabPageProps) {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon={lab.icon} />}
        title={lab.name}
        titleSuffix={<Badge>v0.3 参考实现</Badge>}
        description={lab.description}
        actions={
          <Button asChild variant="outline">
            <Link href="/labs/compare">
              对比运行时
              <span
                className="icon-[solar--arrow-right-up-bold-duotone]"
                data-icon="inline-end"
                aria-hidden
              />
            </Link>
          </Button>
        }
      />
      <PageContainer className="space-y-6">
        {benchmark}

        <section className="grid gap-4 md:grid-cols-3" aria-label="能力说明">
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

        {probe}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>实验结论</CardTitle>
              <CardDescription>
                结论来自实际实现，而不是对 API 熟悉程度的主观判断。
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6">
              {recommendation}
            </CardContent>
          </Card>
          <DecisionList title="适合使用" items={useWhen} positive />
          <DecisionList title="不适合使用" items={avoidWhen} />
        </section>
      </PageContainer>
    </>
  );
}

function DecisionList({
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
