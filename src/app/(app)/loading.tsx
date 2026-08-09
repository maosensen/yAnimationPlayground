import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading state for the (app) group: a generic page skeleton
 * (heading + stat row + two content panels) shown while a page's server
 * payload streams in. Pages with a bespoke shape can add their own
 * `loading.tsx` next to their `page.tsx` to override this one.
 */
export default function Loading() {
  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </PageContainer>
  );
}
