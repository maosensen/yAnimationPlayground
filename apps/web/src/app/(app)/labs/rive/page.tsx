import { RiveStateMachineLab } from "@/components/labs/visual/rive-state-machine-lab";
import { VisualLabPage } from "@/components/labs/visual/visual-lab-page";
import { labs } from "@/lib/labs";

export default function RiveLabPage() {
  return (
    <VisualLabPage
      lab={labs.rive}
      stage={<RiveStateMachineLab />}
      capabilities={[
        {
          title: "资产内状态机",
          detail:
            "过渡规则随 .riv 文件交付，应用通过 Boolean、Number 或 Trigger 输入驱动。",
          icon: "icon-[solar--branching-paths-down-bold-duotone]",
        },
        {
          title: "连续交互响应",
          detail: "运行时可在多个状态间平滑混合，适合角色、控件与品牌交互。",
          icon: "icon-[solar--cursor-square-bold-duotone]",
        },
        {
          title: "运行时能力裁剪",
          detail:
            "按产品需求选择 Canvas Lite、Canvas、WebGL2，避免默认引入全部能力。",
          icon: "icon-[solar--widget-5-bold-duotone]",
        },
      ]}
      conclusion="Rive 的位置介于设计资产和应用逻辑之间：设计师在资产中定义视觉状态与过渡，前端只绑定有业务意义的输入。它比线性时间轴更适合高互动组件，但资产输入就是一套需要版本治理的接口；关键产品路径还必须考虑自托管和静态后备。"
      responsibilities={[
        "封装角色、控件和品牌资产内部的视觉状态与过渡。",
        "用明确输入响应应用状态、指针或手势。",
      ]}
      boundaries={[
        "不替代 React 的业务状态与可访问语义。",
        "不应让关键产品流程依赖没有后备的远程二进制资产。",
      ]}
    />
  );
}
