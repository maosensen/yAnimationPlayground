import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamplesTabs } from "./examples-tabs";

export default function HyperframesExamplesPage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--clapperboard-play-bold-duotone]" />
        }
        title="HyperFrames 实际示例"
        titleSuffix={<Badge>HTML 动画</Badge>}
        description="每个可运行示例占用一个 Tab；先把动画、时间线和调试体验做完整，再逐步增加素材、声音与输出能力。"
        actions={
          <Button asChild variant="outline">
            <Link href="/labs/hyperframes">查看功能与原理</Link>
          </Button>
        }
      />

      <PageContainer className="space-y-6">
        <ExamplesTabs />
      </PageContainer>
    </>
  );
}
