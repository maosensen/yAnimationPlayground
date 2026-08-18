import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

/** 404 for `notFound()` thrown inside the (app) group — keeps the shell. */
export default function NotFound() {
  return (
    <PageContainer className="flex flex-col">
      <StatusPage
        code="404"
        title="页面未找到"
        description="你访问的页面不存在、已被移除，或地址已经发生变化。"
        className="min-h-[60svh]"
      >
        <Button asChild>
          <Link href="/labs">返回实验总览</Link>
        </Button>
      </StatusPage>
    </PageContainer>
  );
}
