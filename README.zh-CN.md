# yAnimationPlayground

[English](./README.md) | 简体中文

yAnimationPlayground 是一个通过小型、可比较实验系统学习浏览器动画与代码视频的 pnpm monorepo。
仓库保留一套生产质量的 Next.js + shadcn/ui 交互实验壳层，同时隔离视频渲染器和未来的共享 Motion 基础设施。

## 已包含内容

- **Web 实验室** — CSS + SVG、GSAP、Motion、D3、Lottie、Rive、Canvas 路由
- **生产级应用壳层** — Next.js 16、React 19、Tailwind CSS v4、shadcn/ui、React Compiler
- **完整保留主题系统** — 颜色预设、自定义品牌色、中性色族、对比度、阴影、导航、圆角与字体
- **代码视频管线** — 可运行的 Remotion 与 HyperFrames 横竖双版参考工程
- **AI 辅助生产** — 模型中立的简报到故事板编译流程，包含人工审查点、语义 QA、溯源清单与 Remotion 实现证明
- **共享基础设施** — design tokens、motion tokens、动画 primitive、assets 与视频生产契约
- **工程门禁** — pnpm workspace、Biome、TypeScript、环境变量校验与 CI

## 路线图

后续开发按“最终获得什么能力”组织，而不是按依赖库清单推进。v0.3 聚焦可比较的
交互动效实验，v0.4 聚焦数据与视觉运行时，v0.5 建立可重复的代码视频生产流程。
后续里程碑会把经过验证的结果沉淀为共享 package 和 AI 辅助工作流，但不会把本仓库
扩张成正式 Studio 产品。

版本范围、旗舰作品、完成标准以及 Playground 与未来 Studio 的边界详见
[docs/roadmap.md](./docs/roadmap.md)。

## 快速开始

需要 **Node.js >= 22** 和 **pnpm 10.x**。

```sh
pnpm install
pnpm dev
```

打开 [http://localhost:4394](http://localhost:4394)。

## 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 使用 Turbopack 启动 Next.js Web workspace |
| `pnpm build` | 构建 Web workspace 的生产版本 |
| `pnpm start` | 运行 Web 生产构建 |
| `pnpm check` | 执行仓库级 lint 与类型门禁 |
| `pnpm check-types` | 执行所有支持类型检查的 workspace |
| `pnpm lint` | 使用 Biome 检查整个 monorepo |
| `pnpm lint:fix` | 应用 Biome 安全修复 |
| `pnpm format` | 格式化支持的文件 |
| `pnpm pipeline:generate` | 把已审查的 Signal Atlas 源文件编译为可追踪生产产物 |
| `pnpm pipeline:check` | 校验 Schema、语义 QA 与生成物漂移 |
| `pnpm pipeline:inspect` | 验收 v0.7 Remotion 参考成片 |
| `pnpm video:prepare` | 校验并同步共享视频输入 |
| `pnpm video:check` | 检查两套视频渲染工程 |
| `pnpm video:render` | 渲染全部横版与竖版参考成片 |
| `pnpm video:inspect` | 校验尺寸、时长、帧率与音轨 |

## 仓库结构

```text
apps/
├── web/                       # Next.js + shadcn 交互实验平台
│   └── src/app/(app)/labs/
│       ├── css-svg/
│       ├── gsap/
│       ├── motion/
│       ├── d3/
│       ├── lottie/
│       ├── rive/
│       ├── canvas/
│       ├── code-video/
│       └── ai-pipeline/
├── remotion/                  # 独立 React 视频工程
└── hyperframes/               # 独立 HTML-to-video 工程
packages/
├── design-tokens/             # 色彩、字体、间距、层级
├── motion-tokens/             # duration、easing、stagger、节奏
├── motion-kit/                # 可复用动画 primitive
├── animation-pipeline/        # AI 输出 Schema、编译器、QA 与参考产物
├── assets/                    # 共享源素材与实验 fixture
└── video-contract/            # 共享 brief 与视频生产契约
notes/                         # 已完成实验的结论
```

完整 shadcn 组件库与当前可工作的主题实现仍保留在 `apps/web/src/`。
共享 package 会刻意从小开始：只有第二个真实消费者验证了契约，才从 Web 应用中提炼。

v0.5 的工作流、运行时比较、命令与成片验收结果详见
[docs/code-video-production.md](./docs/code-video-production.md)。
v0.7 的结构化 AI 边界、人工审查阶段、确定性编译器与 QA 策略详见
[docs/ai-assisted-production.md](./docs/ai-assisted-production.md)。

## 添加 UI 组件

```sh
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

生成的组件位于 `apps/web/src/components/ui/`，归本仓库所有并可自由修改。
`@shadcn-space` registry 继续配置在 `apps/web/components.json`。

## 开发约定

所有编码约定、库选型、workspace 边界和 AI 编码助手规则统一记录在
[AGENTS.md](./AGENTS.md)，它是本仓库的唯一权威来源。
