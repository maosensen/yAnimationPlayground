"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ThreejsSpatialLab = dynamic(
  () =>
    import("./threejs-spatial-lab").then((module) => module.ThreejsSpatialLab),
  {
    ssr: false,
    loading: () => (
      <Card className="overflow-hidden" aria-label="Three.js 场景正在加载">
        <CardHeader className="space-y-3 border-b">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="grid gap-5 bg-muted/25 p-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-6">
          <Skeleton className="h-[32rem] w-full" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    ),
  },
);

export function ThreejsLabLoader() {
  return <ThreejsSpatialLab />;
}
