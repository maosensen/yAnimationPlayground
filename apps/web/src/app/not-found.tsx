import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

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
        title="Page not found"
        description="The page you are looking for doesn't exist or may have moved."
      >
        <Button asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      </StatusPage>
    </main>
  );
}
