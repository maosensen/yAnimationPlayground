import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const labels = [
  { time: "0.00s", name: "collect", detail: "叙事内容揭示" },
  { time: "2.70s", name: "resolve", detail: "SVG 信号绘制" },
  { time: "4.75s", name: "decide", detail: "决策信息交接" },
];

export function GsapTimelineProbe() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>时间轴地图</CardTitle>
        <CardDescription>
          语义化标签让每个编排阶段都能被精确定位，同时交错细节继续依附于主时间轴。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3 sm:grid-cols-3">
          {labels.map((label, index) => (
            <li
              key={label.name}
              className="relative rounded-lg bg-muted/40 p-4 ring-1 ring-border"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-primary">
                  {label.time}
                </span>
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-3 font-medium">{label.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {label.detail}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
