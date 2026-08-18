/**
 * User-facing changelog — curated, categorized release highlights rendered by
 * the /changelog page, distinct from the developer CHANGELOG.md (which tracks
 * every change for the GitHub release notes).
 *
 * Keep this in sync on release: add one entry per shipped version. Every
 * release needs a headline `title` (plus an optional `summary`); changes
 * usually carry a short row `title` too — and the `text` should not start
 * with that title, or the rendered row reads twice.
 */

/** Change category — drives the colored tag on each row. */
export type ChangeKind = "new" | "improved" | "fixed";

export type ChangelogChange = {
  kind: ChangeKind;
  /** One-sentence description of the change. */
  text: string;
  /** Short feature name shown as the row heading. */
  title?: string;
};

export type ChangelogRelease = {
  version: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Curated, user-facing changes for this release. */
  changes: ChangelogChange[];
  /** Release headline (e.g. "Hello, dashboard"). */
  title: string;
  /** Optional one-paragraph framing shown under the headline. */
  summary?: string;
};

/** Newest first. */
export const changelog: ChangelogRelease[] = [
  {
    version: "0.8.1",
    date: "2026-08-18",
    title: "把仓库真正收拢成动画实验场",
    summary:
      "官方视频 Agent 工作流已经固定进仓库，旧模板 Demo 也完成退役；入口、导航和异常反馈现在都围绕动画研究主线服务。",
    changes: [
      {
        kind: "new",
        title: "38 个官方视频 Skills",
        text: "完整收录 Remotion 12 个与 HyperFrames 26 个官方技能，并锁定上游来源和内容哈希，方便 Agent 稳定复现工作流。",
      },
      {
        kind: "improved",
        title: "动画优先的信息架构",
        text: "首页直接进入实验总览，导航移除分析仪表盘、通用图表与 UI 画廊，只保留动画、代码视频、AI 制作和版本记录。",
      },
      {
        kind: "fixed",
        title: "中文状态反馈",
        text: "已退役地址和异常页面统一使用中文说明，并提供返回实验总览的明确操作。",
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-08-11",
    title: "让空间关系成为信息，而不是装饰",
    summary:
      "Three.js 现在拥有独立实验阶段：从场景图、相机和射线交互，到帧预算、减少动效、语义后备和 GPU 资源清理，都能在同一个空间信号场中实际操作。",
    changes: [
      {
        kind: "new",
        title: "Spatial Signal Field",
        text: "在信号星群、分层映射和聚焦路径之间切换，用相机、点云、光照与空间节点理解真正的三维叙事。",
      },
      {
        kind: "new",
        title: "三档 WebGL 帧预算",
        text: "可比较 480、1,200 和 2,600 点，以及 1×、1.5×、2× DPR，并查看 FPS、帧时、draw calls 与 GPU geometry。",
      },
      {
        kind: "new",
        title: "Three.js 技术定位",
        text: "中文技术地图明确区分 DOM/SVG、Canvas 与 Three.js，只有信息依赖相机、透视、深度、模型或 GPU 管线时才升级。",
      },
      {
        kind: "improved",
        title: "可访问的 3D 生命周期",
        text: "射线点击始终有原生按钮等价路径，减少动效停止循环但保留最终信息，离开路由会完整释放观察器、控制器和 GPU 资源。",
      },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-08-10",
    title: "让 AI 进入一条可以审查的生产线",
    summary:
      "创意简报、结构化 AI 草案、故事板、资产、实现脚手架与 QA 现在形成可重复流程，并由同一份产物驱动 Web 审查和 Remotion 成片。",
    changes: [
      {
        kind: "new",
        title: "AI 动画生产工作台",
        text: "可以逐阶段查看输入、审查责任与编译产物，并用中文理解每一条生产规则。",
      },
      {
        kind: "new",
        title: "确定性编译与溯源",
        text: "同一份已审查输入会生成固定故事板、资产清单、实现脚手架、QA 报告与 bundle hash。",
      },
      {
        kind: "new",
        title: "可执行语义 QA",
        text: "十条门禁覆盖时间线、资产引用、规格覆盖、减少动效与人工批准，并通过缺失资产样例证明错误会被阻断。",
      },
      {
        kind: "new",
        title: "Signal Atlas 实现证明",
        text: "一份 12 秒生产 bundle 同时驱动 Web 工作台和 Remotion 横竖双版 Composition，运行时不携带模型 SDK 或密钥。",
      },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-08-09",
    title: "从动画参数，走向一套动作语言",
    summary:
      "Motion token 与组合原语现在拥有稳定契约，并经过现有 React 交互、Remotion 视频与专用工作台的多消费者验证。",
    changes: [
      {
        kind: "new",
        title: "跨运行时 Motion Tokens",
        text: "统一时间、缓动、弹簧、交错、位移、编排与减少动效策略，并为 CSS、Motion 和视频帧提供明确换算边界。",
      },
      {
        kind: "new",
        title: "组合式 Motion Kit",
        text: "通过独立子路径提供策略、过渡、Reveal、Stagger 与 Pressable，按语义变体组合行为而不堆叠布尔参数。",
      },
      {
        kind: "new",
        title: "Motion System 工作台",
        text: "可以实时切换系统、完整与减少动效策略，重播进入序列，并连续切换状态观察可中断行为。",
      },
      {
        kind: "improved",
        title: "共享契约门禁",
        text: "仓库检查现在包含 token 运行时断言与公共消费者编译测试，防止数值尺度、语义引用和导出接口漂移。",
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-08-09",
    title: "同一份 brief，两套代码视频生产管线",
    summary:
      "Remotion 与 HyperFrames 现在共享一份 36 秒生产契约，并各自产出经过实机、运行时和媒体参数检查的横竖双版参考成片。",
    changes: [
      {
        kind: "new",
        title: "Remotion 确定性渲染",
        text: "用 typed React Composition 建立本地 Studio、横竖响应式构图、帧驱动动画和可重复 MP4 输出。",
      },
      {
        kind: "new",
        title: "HyperFrames HTML 视频工程",
        text: "用静态 HTML、data attributes 与可 seek GSAP 时间轴建立两个合法单根工程，并通过运行时与布局检查。",
      },
      {
        kind: "new",
        title: "Living Signals 参考成片",
        text: "四条 36 秒成片统一为 30 FPS、H.264 与 AAC，并分别验证 1920×1080 和 1080×1920 输出。",
      },
      {
        kind: "new",
        title: "代码视频生产与选型指南",
        text: "用中文解释共享契约、完整命令、渲染模型、工程负担与默认选型结论。",
      },
      {
        kind: "fixed",
        title: "中文字体与 Lottie 播放",
        text: "修正简体中文字体回退，并解决 Lottie 时间轴推进但画面冻结的问题。",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-08-09",
    title: "每个图层都有明确的运行时",
    summary:
      "D3、Lottie、Rive 与 Canvas 现在拥有可操作的参考实验，并在 Living Data Story 中与 Motion 按职责组合，让视觉技术选型不再是一场库名混战。",
    changes: [
      {
        kind: "new",
        title: "四类视觉运行时实验",
        text: "分别验证数据几何、线性矢量资产、交互状态机与高密度即时绘制，并记录各自的资产、性能、可访问性和生命周期边界。",
      },
      {
        kind: "new",
        title: "Living Data Story",
        text: "通过时间范围、用户分群和叙事重点切换，展示 D3、Motion、Canvas 与 Lottie 如何在同一作品中分层协作。",
      },
      {
        kind: "new",
        title: "视觉运行时选型指南",
        text: "用状态所有权、资产流程、语义需求和图元密度定位 CSS、Motion、GSAP、D3、Lottie、Rive、Canvas 与视频工程。",
      },
      {
        kind: "improved",
        title: "中文操作与解释",
        text: "实验控制、功能说明、参数含义、原理解析和结论统一使用简体中文，动画内部叙事仍可保留英文。",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-08-09",
    title: "同一个故事，三种动效模型",
    summary:
      "原生 CSS + SVG、Motion 和 GSAP 现在共用同一个完整参考作品与测试协议，让运行时选择从主观偏好变成有实验依据的工程决策。",
    changes: [
      {
        kind: "new",
        title: "动效对比实验套件",
        text: "在三套隔离实现中，对同一个 7.2 秒叙事进行重播、暂停、反向、定位、视口切换和减弱动态效果测试。",
      },
      {
        kind: "new",
        title: "React 交互探针",
        text: "通过 Motion 验证由组件状态驱动的手势反馈、共享布局、弹簧和可中断进入/退出行为。",
      },
      {
        kind: "new",
        title: "标签化 GSAP 时间轴",
        text: "通过按路由懒加载的运行时，以 Collect、Resolve、Decide 三个命名阶段协调 DOM 与 SVG 的交错提示。",
      },
      {
        kind: "new",
        title: "运行时选型指南",
        text: "通过实际对比矩阵判断何时原生动效已经足够、何时 React 交互需要 Motion，以及何时复杂编排值得引入 GSAP。",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-08-09",
    title: "A playground with room to grow",
    summary:
      "yAnimationPlayground is now a focused monorepo: browser techniques stay easy to compare, while video renderers and reusable motion foundations get clean boundaries of their own.",
    changes: [
      {
        kind: "new",
        title: "Animation lab catalog",
        text: "Seven focused browser labs map out CSS + SVG, GSAP, Motion, D3, Lottie, Rive, and Canvas without loading every runtime up front.",
      },
      {
        kind: "new",
        title: "Purpose-built workspaces",
        text: "Remotion and HyperFrames have isolated application boundaries, alongside shared packages for tokens, motion primitives, and source assets.",
      },
      {
        kind: "improved",
        title: "Project identity",
        text: "The product name, wordmark, package metadata, repository details, and persisted settings namespace now consistently use yAnimationPlayground.",
      },
      {
        kind: "improved",
        title: "Local development",
        text: "Development and production preview servers now use port 4394 by default.",
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-08-06",
    title: "A quick tune-up",
    summary:
      "A housekeeping release — the framework moves to Next.js 16.3, local servers get a port of their own, and design decisions get a ratification checklist.",
    changes: [
      {
        kind: "improved",
        title: "Next.js 16.3",
        text: "The framework is upgraded to 16.3.0 — dev sessions use up to 90% less memory, repeat production builds reuse unchanged artifacts from cache, and server rendering handles up to ~22% more load.",
      },
      {
        kind: "improved",
        title: "Default port 3005",
        text: "Local dev and production servers now start on port 3005 out of the box, clear of other apps parked on port 3000.",
      },
      {
        kind: "new",
        title: "Design-language checklist",
        text: "A section-by-section checklist for reviewing, ratifying, and demoing every design decision before it becomes a house rule.",
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-07-28",
    title: "One chrome across the y-series",
    summary:
      "The header icon row, page headers, and settings drawer are brought in line with the sibling y-series apps — plus a feature ledger that keeps the roadmap honest.",
    changes: [
      {
        kind: "new",
        title: "Header icon row",
        text: "One icon family at one weight across the system header — theming, language, and GitHub / X links — legible on both the light header and the dark nav panel.",
      },
      {
        kind: "improved",
        title: "Page headers",
        text: "Every page band now runs on a slotted PageHeader with icon, toolbar, and tab slots, and stays pinned under the app header as you scroll.",
      },
      {
        kind: "improved",
        title: "Settings drawer",
        text: "Rebuilt with one selected treatment across every picker, options that preview themselves, and a Reset footer that counts what differs from the defaults.",
      },
      {
        kind: "new",
        title: "Feature ledger",
        text: "A machine-readable roadmap file tracks every shipped and planned capability right alongside the code.",
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-07-16",
    title: "Make the board yours",
    summary:
      "The dashboard grid gains a Customize toolbar and cleaner, unified chrome — powered by a reusable grid board under the hood.",
    changes: [
      {
        kind: "new",
        title: "Customize toolbar",
        text: "Show or hide each dashboard widget and reset the board back to its default arrangement.",
      },
      {
        kind: "improved",
        title: "Grid chrome",
        text: "A themeable corner resize grip, standard card surfaces on grid widgets, and no more drag icon cluttering the top-right corner.",
      },
      {
        kind: "improved",
        title: "Grid board internals",
        text: "All grid behavior now runs through one reusable board component, so every grid page shares the same look and feel.",
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-07-13",
    title: "Hardening the foundations",
    summary:
      "A groundwork release — validated configuration, a CI gate on every change, and polished error states across the app.",
    changes: [
      {
        kind: "new",
        title: "Status pages",
        text: "Consistent 404 pages inside and outside the shell, an error screen with one-click retry, and a loading skeleton while pages stream in.",
      },
      {
        kind: "new",
        title: "Validated env vars",
        text: "Environment variables are checked against a zod schema at startup, so a bad config fails the build instead of surfacing at runtime.",
      },
      {
        kind: "new",
        title: "CI gate",
        text: "Every push and pull request now runs lint, type checks, and a production build on GitHub Actions.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-10",
    title: "Hello, dashboard",
    summary:
      "The first cut of the template — a themeable Next.js dashboard shell with a live settings drawer, ready to build on.",
    changes: [
      {
        kind: "new",
        title: "Dashboard shell",
        text: "An app shell with vertical, mini-rail, and horizontal nav layouts, Priority+ overflow for the top bar, and a small-screen drawer.",
      },
      {
        kind: "new",
        title: "Settings drawer",
        text: "Live theme controls — light/dark/system, contrast, compact density, nav layout and color, color presets plus a custom brand color, radius steps, a font picker (Outfit by default), and a max-width toggle — persisted across reloads.",
      },
      {
        kind: "new",
        title: "Token-driven theming",
        text: "Card and overlay elevation, chart series, and borders all run on design tokens, so presets and contrast re-skin the whole app consistently.",
      },
      {
        kind: "new",
        title: "Widgets & demos",
        text: "An analytics dashboard, line and bar chart pages, a drag-and-resize gridstack board, avatar fallbacks, and a display-card gallery.",
      },
      {
        kind: "new",
        title: "Solar icons",
        text: "Iconify-compiled Solar duotone glyphs across nav, settings, and headers.",
      },
      {
        kind: "new",
        title: "This page",
        text: "Curated release notes on a timeline, rendered from a typed changelog module.",
      },
    ],
  },
];
