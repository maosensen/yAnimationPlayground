# yAnimationPlayground

[English](./README.md) | 简体中文

一个通过小型、可比较实验系统学习浏览器动画与代码视频的 pnpm monorepo。
仓库保留一套生产质量的 Next.js + shadcn/ui 交互实验壳层，同时隔离视频渲染器和未来的共享 Motion 基础设施。

## 已包含内容

- **Web 实验室** — CSS + SVG、GSAP、Motion、D3、Lottie、Rive、Canvas 路由
- **生产级应用壳层** — Next.js 16、React 19、Tailwind CSS v4、shadcn/ui、React Compiler
- **完整保留主题系统** — 颜色预设、自定义品牌色、中性色族、对比度、阴影、导航、圆角与字体
- **视频工程隔离** — 为 Remotion 和 HyperFrames 预留独立 workspace
- **共享基础设施** — design tokens、motion tokens、动画 primitive 与 assets 包
- **工程门禁** — pnpm workspace、Biome、TypeScript、环境变量校验与 CI

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
│       └── canvas/
├── remotion/                  # 独立 React 视频工程
└── hyperframes/               # 独立 HTML-to-video 工程
packages/
├── design-tokens/             # 色彩、字体、间距、层级
├── motion-tokens/             # duration、easing、stagger、节奏
├── motion-kit/                # 可复用动画 primitive
└── assets/                    # 共享源素材与实验 fixture
notes/                         # 已完成实验的结论
```

完整 shadcn 组件库与当前可工作的主题实现仍保留在 `apps/web/src/`。
共享 package 会刻意从小开始：只有第二个真实消费者验证了契约，才从 Web 应用中提炼。

## 添加 UI 组件

```sh
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

生成的组件位于 `apps/web/src/components/ui/`，归本仓库所有并可自由修改。
`@shadcn-space` registry 继续配置在 `apps/web/components.json`。

## 开发约定

所有编码约定、库选型、workspace 边界和 AI 编码助手规则统一记录在
[AGENTS.md](./AGENTS.md)，它是本仓库的唯一权威来源。
