import { MotionSystemWorkbench } from "@/components/labs/motion-system/motion-system-workbench";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export default function MotionSystemPage() {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon="icon-[solar--widget-add-bold-duotone]" />}
        title="Motion Design System"
        titleSuffix={<Badge variant="secondary">v0.6 稳定契约</Badge>}
        description="把时间、缓动、弹簧、交错、编排与减少动效策略组织为跨运行时语言。"
      />
      <PageContainer>
        <MotionSystemWorkbench />
      </PageContainer>
    </>
  );
}
