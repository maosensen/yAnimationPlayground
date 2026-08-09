export type LabDefinition = {
  slug: string;
  name: string;
  description: string;
  focus: string[];
  icon: string;
  status: "reference" | "planned";
};

export const labs = {
  "css-svg": {
    slug: "css-svg",
    name: "CSS + SVG",
    description: "建立浏览器原生矢量动效与视觉节奏的能力基线。",
    focus: ["CSS 关键帧", "SVG 路径", "遮罩与渐变"],
    icon: "icon-[solar--pen-new-square-bold-duotone]",
    status: "reference",
  },
  gsap: {
    slug: "gsap",
    name: "GSAP",
    description: "研究时间轴编排、精确定位、缓动与 SVG 动效。",
    focus: ["时间轴", "交错与缓动", "运动路径"],
    icon: "icon-[solar--clapperboard-play-bold-duotone]",
    status: "reference",
  },
  motion: {
    slug: "motion",
    name: "Motion",
    description: "探索以 React 为中心的交互、手势、布局过渡与弹簧动画。",
    focus: ["布局动画", "手势", "弹簧动力学"],
    icon: "icon-[solar--cursor-square-bold-duotone]",
    status: "reference",
  },
  d3: {
    slug: "d3",
    name: "D3",
    description: "先把数据转换为定制几何，再交给合适的运行时驱动动画。",
    focus: ["比例尺", "形状与布局", "数据过渡"],
    icon: "icon-[solar--chart-square-bold-duotone]",
    status: "reference",
  },
  lottie: {
    slug: "lottie",
    name: "Lottie",
    description: "评估矢量动画交付、播放控制与运行时边界。",
    focus: ["JSON 播放", "片段控制", "资源性能"],
    icon: "icon-[solar--video-frame-play-horizontal-bold-duotone]",
    status: "reference",
  },
  rive: {
    slug: "rive",
    name: "Rive",
    description: "构建由状态机和运行时数据驱动的交互式矢量图形。",
    focus: ["状态机", "数据绑定", "Canvas 与 WebGL 运行时"],
    icon: "icon-[solar--gamepad-bold-duotone]",
    status: "reference",
  },
  canvas: {
    slug: "canvas",
    name: "Canvas",
    description: "研究即时模式绘制、高密度场景、粒子与帧预算。",
    focus: ["渲染循环", "粒子", "性能分析"],
    icon: "icon-[solar--layers-bold-duotone]",
    status: "reference",
  },
} satisfies Record<string, LabDefinition>;

export const labList = Object.values(labs);
