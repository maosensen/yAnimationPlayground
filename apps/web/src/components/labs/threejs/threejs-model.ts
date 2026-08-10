export type SpatialMode = "constellation" | "layers" | "route";
export type QualityPresetId = "economy" | "balanced" | "stress";
export type SignalId = "core" | "growth" | "retention";

export const spatialModes: Array<{
  id: SpatialMode;
  label: string;
  description: string;
}> = [
  {
    id: "constellation",
    label: "信号星群",
    description: "围绕中心指标观察三组空间信号的距离与方向。",
  },
  {
    id: "layers",
    label: "分层映射",
    description: "按决策层级展开信号，强调前后关系与结构深度。",
  },
  {
    id: "route",
    label: "聚焦路径",
    description: "把信号重排为一条可追踪路径，观察叙事推进顺序。",
  },
];

export const qualityPresets: Array<{
  id: QualityPresetId;
  label: string;
  points: number;
  dprCap: number;
  description: string;
}> = [
  {
    id: "economy",
    label: "节能",
    points: 480,
    dprCap: 1,
    description: "低密度与 1× DPR，适合移动设备或后台辅助视觉。",
  },
  {
    id: "balanced",
    label: "均衡",
    points: 1200,
    dprCap: 1.5,
    description: "默认档位，在清晰度、密度和 GPU 成本之间取平衡。",
  },
  {
    id: "stress",
    label: "压力",
    points: 2600,
    dprCap: 2,
    description: "用于观察高 DPR 与高点密度对帧时间的影响。",
  },
];

export const signals: Array<{
  id: SignalId;
  label: string;
  value: string;
  insight: string;
}> = [
  {
    id: "core",
    label: "核心用户",
    value: "72%",
    insight: "高意图用户构成稳定内核，适合作为空间叙事的观察原点。",
  },
  {
    id: "growth",
    label: "增长信号",
    value: "+18%",
    insight: "新增触点沿外层轨道扩散，距离用来表达不确定性而非装饰。",
  },
  {
    id: "retention",
    label: "留存路径",
    value: "4.6×",
    insight: "连续行为形成可追踪路径，适合用相机与深度强调先后关系。",
  },
];

export function getQualityPreset(id: QualityPresetId) {
  return qualityPresets.find((preset) => preset.id === id) ?? qualityPresets[1];
}
