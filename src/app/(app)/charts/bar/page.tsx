"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { DisplayCard } from "@/components/display-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 312, mobile: 220 },
  { month: "August", desktop: 268, mobile: 170 },
  { month: "September", desktop: 195, mobile: 110 },
  { month: "October", desktop: 289, mobile: 240 },
  { month: "November", desktop: 224, mobile: 160 },
  { month: "December", desktop: 341, mobile: 250 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function BarChartPage() {
  return (
    <>
      <PageHeader
        title="Bar Chart"
        description="Monthly visitors by device for the last 12 months"
      />
      <PageContainer>
        <DisplayCard title="Visitors" subtitle="Desktop vs. mobile by month">
          <ChartContainer config={chartConfig} className="h-96 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </DisplayCard>
      </PageContainer>
    </>
  );
}
