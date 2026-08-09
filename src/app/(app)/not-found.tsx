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
        title="Page not found"
        description="The page you are looking for doesn't exist or may have moved."
        className="min-h-[60svh]"
      >
        <Button asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      </StatusPage>
    </PageContainer>
  );
}
