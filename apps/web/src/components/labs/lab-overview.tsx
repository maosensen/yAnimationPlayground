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
        titleSuffix={<Badge variant="secondary">Scaffolded</Badge>}
        description={lab.description}
      />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Experiment stage</CardTitle>
            <CardDescription>
              The route boundary is ready. Its runtime and examples will be
              installed only when this lab begins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-80 items-center justify-center rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground ring-1 ring-border">
              Add the first controlled experiment here.
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Study focus</CardTitle>
            <CardDescription>
              Keep each exercise small, measurable, and comparable.
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
