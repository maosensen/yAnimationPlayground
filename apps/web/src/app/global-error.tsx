"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import "./globals.css";

/**
 * Last-resort error boundary: replaces the root layout when it crashes, so it
 * must render its own <html>/<body> and stay dependency-light (no providers,
 * no shell — the app around it is already gone).
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    logger.error({ err: error, digest: error.digest }, "root layout crashed");
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight">应用发生错误</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          应用遇到了无法自动恢复的错误。
          {error.digest ? `（错误摘要：${error.digest}）` : ""}
        </p>
        <Button onClick={() => unstable_retry()}>重新尝试</Button>
      </body>
    </html>
  );
}
