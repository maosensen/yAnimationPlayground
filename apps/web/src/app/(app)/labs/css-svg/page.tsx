import { CssSvgBenchmark } from "@/components/labs/interaction/css-svg-benchmark";
import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { NativeInteractionProbe } from "@/components/labs/interaction/native-interaction-probe";
import { labs } from "@/lib/labs";

export default function CssSvgLabPage() {
  return (
    <InteractionLabPage
      lab={labs["css-svg"]}
      benchmark={<CssSvgBenchmark />}
      capabilities={[
        {
          title: "零运行时基线",
          detail: "过渡与关键帧直接运行在浏览器原生动画栈中。",
          icon: "icon-[solar--leaf-bold-duotone]",
        },
        {
          title: "原生矢量能力",
          detail: "路径绘制、渐变、遮罩和变换共用同一个 SVG 场景。",
          icon: "icon-[solar--pen-bold-duotone]",
        },
        {
          title: "属性驱动状态",
          detail: "DOM 状态和媒体偏好可以驱动小型动画编排。",
          icon: "icon-[solar--settings-minimalistic-bold-duotone]",
        },
      ]}
      probe={<NativeInteractionProbe />}
      recommendation="持久的 UI 状态反馈和短小的状态驱动序列应优先从这里开始。这个旗舰案例本身仍然紧凑，但一旦需要命令式播放控制，就必须借助 Web Animations API；这也清楚标出了单靠 CSS 不再是最简单控制模型的临界点。"
      useWhen={[
        "动画状态数量较少，而且最终状态明确。",
        "包体成本、渐进增强和长期稳定性是首要考虑。",
      ]}
      avoidWhen={[
        "大量重叠阶段需要频繁调整编排节奏。",
        "React 组件需要理解中断的布局动画或挂载/卸载语义。",
      ]}
    />
  );
}
