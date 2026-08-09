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
  // Animation Labs Section
  { label: "动画实验", isSection: true },
  {
    title: "Web 实验",
    icon: "icon-[solar--test-tube-minimalistic-bold-duotone]",
    children: [
      { title: "实验总览", href: "/labs" },
      { title: "CSS + SVG", href: "/labs/css-svg" },
      { title: "GSAP", href: "/labs/gsap" },
      { title: "Motion", href: "/labs/motion" },
      { title: "交互技术选型", href: "/labs/compare" },
      { title: "D3", href: "/labs/d3" },
      { title: "Lottie", href: "/labs/lottie" },
      { title: "Rive", href: "/labs/rive" },
      { title: "Canvas", href: "/labs/canvas" },
      { title: "Living Data Story", href: "/labs/living-data-story" },
      { title: "视觉运行时选型", href: "/labs/visual-guide" },
    ],
  },
  {
    title: "代码视频",
    icon: "icon-[solar--video-frame-play-horizontal-bold-duotone]",
    children: [{ title: "生产与选型", href: "/labs/code-video" }],
  },

  // Dashboards Section
  { label: "Dashboards", isSection: true },
  {
    title: "Analytics",
    icon: "icon-[solar--chart-2-bold-duotone]",
    href: "/",
  },

  // Widgets Section
  { label: "Widgets", isSection: true },
  {
    title: "Charts",
    icon: "icon-[solar--pie-chart-2-bold-duotone]",
    children: [
      { title: "Line Chart", href: "/charts/line" },
      { title: "Bar Chart", href: "/charts/bar" },
    ],
  },

  // UI Section
  { label: "UI", isSection: true },
  {
    title: "Avatars",
    icon: "icon-[solar--user-circle-bold-duotone]",
    href: "/ui/avatars",
  },
  {
    title: "Display Card",
    icon: "icon-[solar--widget-5-bold-duotone]",
    href: "/ui/display-card",
  },
  {
    title: "Gridstack",
    icon: "icon-[solar--widget-add-bold-duotone]",
    href: "/ui/gridstack",
  },

  // Project Section
  { label: "Project", isSection: true },
  {
    title: "Changelog",
    icon: "icon-[solar--document-text-bold-duotone]",
    href: "/changelog",
  },
];
