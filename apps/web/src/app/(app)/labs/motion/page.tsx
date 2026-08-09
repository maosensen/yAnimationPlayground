import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { MotionBenchmark } from "@/components/labs/interaction/motion-benchmark";
import { MotionInteractionProbe } from "@/components/labs/interaction/motion-interaction-probe";
import { labs } from "@/lib/labs";

export default function MotionLabPage() {
  return (
    <InteractionLabPage
      lab={labs.motion}
      benchmark={<MotionBenchmark />}
      capabilities={[
        {
          title: "React 原生状态协作",
          detail: "挂载状态、布局和手势可以直接与组件状态组合。",
          icon: "icon-[solar--code-circle-bold-duotone]",
        },
        {
          title: "可中断动画",
          detail: "弹簧和值动画可以重新指向目标，无需重建时间轴。",
          icon: "icon-[solar--cursor-square-bold-duotone]",
        },
        {
          title: "作用域序列",
          detail: "useAnimate 可以添加局部编排，同时避免选择器泄漏到全局。",
          icon: "icon-[solar--layers-minimalistic-bold-duotone]",
        },
      ]}
      probe={<MotionInteractionProbe />}
      recommendation="当动画是 React 状态变化的结果时，优先把 Motion 作为默认升级方案。它对手势、挂载状态、布局和中断的表达比时间轴中心代码更直接，同时仍能处理短序列编排。"
      useWhen={[
        "交互由 React 状态、布局、手势或组件挂载状态负责。",
        "用户仍在交互时，动画需要平滑地重新指向新目标。",
      ]}
      avoidWhen={[
        "一个简单的 CSS transition 已经能清楚表达状态变化。",
        "作品是包含大量精确跨图层提示点的编辑型序列。",
      ]}
    />
  );
}
