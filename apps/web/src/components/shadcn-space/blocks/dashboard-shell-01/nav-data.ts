export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--chart-2-bold-duotone]" */
  icon?: string;
  href?: string;
  children?: NavItem[];
};

export const navData: NavItem[] = [
  { label: "动画实验", isSection: true },
  {
    title: "Web 实验",
    icon: "icon-[solar--test-tube-minimalistic-bold-duotone]",
    children: [
      { title: "实验总览", href: "/labs" },
      { title: "CSS + SVG", href: "/labs/css-svg" },
      { title: "GSAP", href: "/labs/gsap" },
      { title: "Motion", href: "/labs/motion" },
      { title: "Motion System", href: "/labs/motion-system" },
      { title: "交互技术选型", href: "/labs/compare" },
      { title: "D3", href: "/labs/d3" },
      { title: "Lottie", href: "/labs/lottie" },
      { title: "Rive", href: "/labs/rive" },
      { title: "Canvas", href: "/labs/canvas" },
      { title: "Three.js", href: "/labs/threejs" },
      { title: "Living Data Story", href: "/labs/living-data-story" },
      { title: "视觉运行时选型", href: "/labs/visual-guide" },
    ],
  },
  {
    title: "代码视频",
    icon: "icon-[solar--video-frame-play-horizontal-bold-duotone]",
    children: [
      { title: "生产与选型", href: "/labs/code-video" },
      { title: "HyperFrames 原理", href: "/labs/hyperframes" },
      { title: "HyperFrames 示例", href: "/labs/hyperframes/examples" },
    ],
  },
  {
    title: "AI 制作",
    icon: "icon-[solar--magic-stick-3-bold-duotone]",
    children: [{ title: "动画生产管线", href: "/labs/ai-pipeline" }],
  },

  { label: "项目", isSection: true },
  {
    title: "版本记录",
    icon: "icon-[solar--document-text-bold-duotone]",
    href: "/changelog",
  },
];
