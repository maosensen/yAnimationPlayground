import { AiPipelineWorkbench } from "@/components/labs/ai-pipeline/ai-pipeline-workbench";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export default function AiPipelinePage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--magic-stick-3-bold-duotone]" />
        }
        title="AI 动画生产管线"
        titleSuffix={<Badge variant="secondary">v0.7 参考流程</Badge>}
        description="从人工简报到结构化 AI 草案、编译产物、实现证明与可执行 QA；全程不绑定模型供应商。"
      />
      <PageContainer>
        <AiPipelineWorkbench />
      </PageContainer>
    </>
  );
}
