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
