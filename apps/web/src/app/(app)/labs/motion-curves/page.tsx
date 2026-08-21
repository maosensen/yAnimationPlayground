import Link from "next/link";
import { MotionCurveStudio } from "@/components/labs/motion-curves/motion-curve-studio";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MotionCurvesPage() {
  return (
    <>
      <PageHeader
        icon={<PageHeaderIcon icon="icon-[solar--chart-square-bold-duotone]" />}
        title="动画曲线 Studio"
        titleSuffix={<Badge variant="secondary">Spring vs Bezier</Badge>}
        description="把临界阻尼弹簧、速度继承和连续 zoom / pan 变成可操作、可测量的动画实验。"
        actions={
          <Button asChild variant="outline">
            <Link href="/labs/motion-system">查看 Motion System</Link>
          </Button>
        }
      />
      <PageContainer>
        <MotionCurveStudio />
      </PageContainer>
    </>
  );
}
