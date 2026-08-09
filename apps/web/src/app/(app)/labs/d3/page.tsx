import { D3GeometryLab } from "@/components/labs/visual/d3-geometry-lab";
import { VisualLabPage } from "@/components/labs/visual/visual-lab-page";
import { labs } from "@/lib/labs";

export default function D3LabPage() {
  return (
    <VisualLabPage
      lab={labs.d3}
      stage={<D3GeometryLab />}
      capabilities={[
        {
          title: "数据到视觉编码",
          detail: "通过 scale 把抽象数据映射为位置、范围和刻度。",
          icon: "icon-[solar--ruler-cross-pen-bold-duotone]",
        },
        {
          title: "可复用几何生成器",
          detail: "line、area 与 curve 只负责生成 SVG 路径，不接管 React DOM。",
          icon: "icon-[solar--graph-up-bold-duotone]",
        },
        {
          title: "职责可组合",
          detail: "D3 提供几何输入，Motion 或原生动画负责视觉过渡。",
          icon: "icon-[solar--layers-bold-duotone]",
        },
      ]}
      conclusion="D3 在 React 项目中的最佳位置不是“整套图表框架”，而是可靠的数据变换与几何工具箱。让 React 持有元素生命周期，再把生成的数值和路径交给 Motion，可以同时保留声明式状态与 D3 的数学能力。"
      responsibilities={[
        "比例尺、范围、tick、聚合与数据几何。",
        "为 SVG、Canvas 或其他运行时生成稳定输入。",
      ]}
      boundaries={[
        "不接管已经由 React 管理的 DOM 生命周期。",
        "不自动成为所有数据动画的播放运行时。",
      ]}
    />
  );
}
