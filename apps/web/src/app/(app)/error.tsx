"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

/**
 * Error boundary for pages inside the (app) group — the shell (sidebar,
 * header) stays interactive while the crashed page shows a recovery UI.
 */
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    logger.error({ err: error, digest: error.digest }, "page crashed");
  }, [error]);

  return (
    <PageContainer className="flex flex-col">
      <StatusPage
        icon="icon-[solar--danger-triangle-line-duotone]"
        title="页面发生错误"
        description="渲染页面时发生了意外错误。请重新尝试；如果问题持续出现，请检查运行日志。"
        className="min-h-[60svh]"
      >
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            错误摘要：{error.digest}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button onClick={() => unstable_retry()}>重新尝试</Button>
          <Button variant="outline" asChild>
            <Link href="/labs">返回实验总览</Link>
          </Button>
        </div>
      </StatusPage>
    </PageContainer>
  );
}
