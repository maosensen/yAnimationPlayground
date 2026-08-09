import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NativeInteractionProbe() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>原生交互探针</CardTitle>
        <CardDescription>
          悬停或聚焦卡片即可观察效果。CSS 负责状态反馈，SVG
          提供矢量几何和遮罩，全程不需要客户端动画运行时。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {["过渡", "路径", "遮罩"].map((label, index) => (
          <button
            type="button"
            key={label}
            className="group relative min-h-32 overflow-hidden rounded-lg bg-muted/40 p-4 text-left ring-1 ring-border transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-primary/10 focus-visible:-translate-y-1 focus-visible:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              className="absolute right-0 bottom-0 h-24 w-24 text-primary opacity-20 transition-[transform,opacity] duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:opacity-40 group-focus-visible:scale-125 group-focus-visible:rotate-12 group-focus-visible:opacity-40"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <title>装饰性遮罩圆形</title>
              <defs>
                <mask id={`native-probe-mask-${index}`}>
                  <rect width="100" height="100" fill="white" />
                  <circle cx="50" cy="50" r="18" fill="black" />
                </mask>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="currentColor"
                mask={`url(#native-probe-mask-${index})`}
              />
            </svg>
            <span className="font-medium">{label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              浏览器原生反馈
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
