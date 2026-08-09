import Link from "next/link";
import { LivingDataStory } from "@/components/labs/visual/living-data-story";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LivingDataStoryPage() {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon="icon-[solar--graph-new-up-bold-duotone]" />}
        title="Living Data Story"
        titleSuffix={<Badge>v0.4 旗舰作品</Badge>}
        description="用一个 React 状态模型协调数据几何、交互过渡、即时绘制与设计资产。"
        actions={
          <Button asChild variant="outline">
            <Link href="/labs/visual-guide">查看分层选型指南</Link>
          </Button>
        }
      />
      <PageContainer>
        <LivingDataStory />
      </PageContainer>
    </>
  );
}
