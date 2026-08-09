import { GsapBenchmark } from "@/components/labs/interaction/gsap-benchmark";
import { GsapTimelineProbe } from "@/components/labs/interaction/gsap-timeline-probe";
import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { labs } from "@/lib/labs";

export default function GsapLabPage() {
  return (
    <InteractionLabPage
      lab={labs.gsap}
      benchmark={<GsapBenchmark />}
      capabilities={[
        {
          title: "主时间轴",
          detail: "标签、偏移与嵌套时序让整套编排保持可见、可定位。",
          icon: "icon-[solar--clapperboard-play-bold-duotone]",
        },
        {
          title: "精确播放控制",
          detail: "定位、暂停、反向、重播和速度都是一等控制能力。",
          icon: "icon-[solar--rewind-back-bold-duotone]",
        },
        {
          title: "DOM + SVG 协同编排",
          detail: "一条时间轴协调文本、卡片与矢量信号几何。",
          icon: "icon-[solar--routing-bold-duotone]",
        },
      ]}
      probe={<GsapTimelineProbe />}
      recommendation="当动画是精心创作的编排，而且时间轴本身就是作品核心时，再升级到 GSAP。标签和确定性的播放控制让高密度、反复修改的编排更容易理解；对应依赖仍然隔离在当前路由。"
      useWhen={[
        "大量重叠阶段需要命名提示点、拖动定位、反向播放或反复编辑。",
        "DOM、SVG 以及未来的 Canvas 图层必须服从同一个明确时钟。",
      ]}
      avoidWhen={[
        "动画主要是对 React 布局或组件挂载状态的直接响应。",
        "少量浏览器原生过渡已经能表达相同关系。",
      ]}
    />
  );
}
