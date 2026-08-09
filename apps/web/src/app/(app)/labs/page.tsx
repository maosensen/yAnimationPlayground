import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
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
        title="Animation labs"
        description="Controlled browser experiments with isolated runtime boundaries."
      />
      <PageContainer className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {labList.map((lab) => (
          <Card key={lab.slug} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className={`${lab.icon} size-5`} aria-hidden />
              </div>
              <CardTitle>{lab.name}</CardTitle>
              <CardDescription>{lab.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/labs/${lab.slug}`}>Open lab</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </PageContainer>
    </>
  );
}
