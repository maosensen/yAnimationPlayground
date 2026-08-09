import { CanvasFrameBudgetLab } from "@/components/labs/visual/canvas-frame-budget-lab";
import { VisualLabPage } from "@/components/labs/visual/visual-lab-page";
import { labs } from "@/lib/labs";

export default function CanvasLabPage() {
  return (
    <VisualLabPage
      lab={labs.canvas}
      stage={<CanvasFrameBudgetLab />}
      capabilities={[
        {
          title: "高密度即时绘制",
          detail: "单个 canvas 承载大量图元，避免为每个粒子创建 DOM 节点。",
          icon: "icon-[solar--stars-minimalistic-bold-duotone]",
        },
        {
          title: "逐帧状态隔离",
          detail: "位置、速度和指针留在 refs 中，只把低频遥测交给 React。",
          icon: "icon-[solar--stopwatch-play-bold-duotone]",
        },
        {
          title: "显示密度治理",
          detail:
            "ResizeObserver 与 DPR 上限共同维持清晰度、显存和绘制成本的平衡。",
          icon: "icon-[solar--monitor-smartphone-bold-duotone]",
        },
      ]}
      conclusion="Canvas 适合图元很多、每帧都变化、DOM 语义价值很低的视觉层。它用一个绘制表面换来吞吐量，也同时放弃了元素级布局、可访问性和原生事件模型；因此应该被当成受预算约束的视觉运行时，而不是常规 UI 的默认选择。"
      responsibilities={[
        "高密度粒子、轨迹、场景背景与实时绘制。",
        "在明确帧预算下处理逐帧状态和指针反馈。",
      ]}
      boundaries={[
        "不绘制需要原生语义、键盘焦点或文本选择的界面。",
        "不把逐帧数据同步进 React state 触发组件树重渲染。",
      ]}
    />
  );
}
