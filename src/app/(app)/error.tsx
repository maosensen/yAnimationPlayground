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
        title="Something went wrong"
        description="An unexpected error occurred while rendering this page. Try again — if it keeps happening, check the logs."
        className="min-h-[60svh]"
      >
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            Digest: {error.digest}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button onClick={() => unstable_retry()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </StatusPage>
    </PageContainer>
  );
}
