import { LottieDeliveryLab } from "@/components/labs/visual/lottie-delivery-lab";
import { VisualLabPage } from "@/components/labs/visual/visual-lab-page";
import { labs } from "@/lib/labs";

export default function LottieLabPage() {
  return (
    <VisualLabPage
      lab={labs.lottie}
      stage={<LottieDeliveryLab />}
      capabilities={[
        {
          title: "时间轴资产交付",
          detail: "把设计工具产出的关键帧、形状和节奏作为 JSON 资产交给 Web。",
          icon: "icon-[solar--clapperboard-play-bold-duotone]",
        },
        {
          title: "可编程播放控制",
          detail: "支持播放、暂停、定位和片段播放，适合被产品流程触发。",
          icon: "icon-[solar--slider-vertical-bold-duotone]",
        },
        {
          title: "跨尺寸矢量渲染",
          detail:
            "SVG renderer 能保持清晰度，但复杂图层仍会增加 DOM 与解析成本。",
          icon: "icon-[solar--maximize-square-3-bold-duotone]",
        },
      ]}
      conclusion="Lottie 的核心价值是把设计师已经编排好的线性时间轴稳定带进产品，而不是让前端重新搭建关键帧。它非常适合图标、空状态、成功反馈与品牌短片；若动画需要大量实时状态组合，资产重新导出与主题适配成本会快速上升。"
      responsibilities={[
        "交付预先编排的矢量时间轴与品牌微动画。",
        "通过 segment、progress 与事件接入产品流程。",
      ]}
      boundaries={[
        "不承担复杂业务状态机和任意状态间过渡。",
        "不适合高密度粒子、实时数据几何或完全动态主题。",
      ]}
    />
  );
}
