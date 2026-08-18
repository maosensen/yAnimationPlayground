import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "页面未找到" };

/**
 * Global 404 for URLs that match no route at all. Renders in the root layout
 * (no dashboard shell); `notFound()` calls inside the (app) group use the
 * in-shell `(app)/not-found.tsx` instead.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <StatusPage
        code="404"
        title="页面未找到"
        description="你访问的页面不存在、已被移除，或地址已经发生变化。"
      >
        <Button asChild>
          <Link href="/labs">返回实验总览</Link>
        </Button>
      </StatusPage>
    </main>
  );
}
