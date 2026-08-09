import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DashboardMetric = {
  label: string;
  value: string;
  percentage: string;
  isPositive?: boolean;
};

type MainDashboardData = {
  title: string;
  description: string;
  metrics: DashboardMetric[];
};

export type StatItem = {
  title: string;
  value: string;
  percentage: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--calendar-bold-duotone]" */
  icon: string;
  isPositive?: boolean;
};

export const mainDashboardData: MainDashboardData = {
  title: "Analytics Dashboard",
  description: "Check all the statistics",
  metrics: [
    {
      label: "Earnings",
      value: "$27,850",
      percentage: "+18%",
      isPositive: true,
    },
    {
      label: "Expense",
      value: "$18,453",
      percentage: "-5%",
      isPositive: false,
    },
  ],
};

export const secondaryStatsData: StatItem[] = [
  {
    title: "Weekly Sales",
    value: "$4,587",
    percentage: "+18%",
    icon: "icon-[solar--calendar-bold-duotone]",
    isPositive: true,
  },
  {
    title: "Purchase Orders",
    value: "230",
    percentage: "+18%",
    icon: "icon-[solar--bag-4-bold-duotone]",
    isPositive: true,
  },
];

/**
 * Hero metric card (Analytics Dashboard). A standalone Card so it can be its
 * own draggable dashboard tile; the background art bleeds to the edges
 * (`p-0` + `overflow-hidden`) and the metrics sit at the bottom.
 */
export function StatRevenueCard({
  data = mainDashboardData,
}: {
  data?: MainDashboardData;
}) {
  return (
    <Card className="relative h-full overflow-hidden p-0">
      <CardContent className="flex h-full flex-col justify-between gap-6 p-0 py-5 ps-6 pe-6">
        <div>
          <p className="text-lg font-medium text-card-foreground">
            {data.title}
          </p>
          <p className="text-xs font-normal text-muted-foreground">
            {data.description}
          </p>
        </div>
        <div className="flex items-center gap-6">
          {data.metrics.map((metric, index) => (
            <div key={metric.label} className="flex items-center gap-6">
              <div>
                <p className="text-xs font-normal text-muted-foreground">
                  {metric.label}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-medium text-card-foreground">
                    {metric.value}
                  </p>
                  <Badge
                    className={cn(
                      "font-normal text-muted-foreground",
                      metric.isPositive ? "bg-teal-400/10" : "bg-red-500/10",
                    )}
                  >
                    {metric.percentage}
                  </Badge>
                </div>
              </div>
              {index < data.metrics.length - 1 && (
                <Separator orientation="vertical" className="h-12" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <Image
        src="https://images.shadcnspace.com/assets/backgrounds/stats-01.webp"
        alt=""
        // Match the source's intrinsic 105x84 (1.25) ratio so h-auto doesn't
        // trip Next's aspect-ratio warning.
        width={210}
        height={168}
        priority
        className="pointer-events-none absolute right-0 bottom-0 hidden h-auto sm:block"
      />
    </Card>
  );
}

/**
 * Secondary stat card (Weekly Sales / Purchase Orders) with a "See Report"
 * action. Fills its tile height (`h-full`) and distributes content so the
 * button hugs the bottom.
 */
export function StatSecondaryCard({ stat }: { stat: StatItem }) {
  return (
    <Card className="h-full py-6">
      <CardContent className="flex h-full items-start justify-between px-6">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium text-card-foreground">
              {stat.title}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium text-card-foreground">
                {stat.value}
              </p>
              <Badge
                className={cn(
                  "font-normal text-muted-foreground",
                  stat.isPositive !== false
                    ? "bg-teal-400/10"
                    : "bg-red-500/10",
                )}
              >
                {stat.percentage}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-xl shadow-xs"
          >
            <span>See Report</span>
            <span
              className="icon-[solar--arrow-right-linear] size-4"
              aria-hidden
            />
          </Button>
        </div>
        <span
          className={cn(stat.icon, "block size-10 shrink-0 text-primary")}
          aria-hidden
        />
      </CardContent>
    </Card>
  );
}
