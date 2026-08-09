# yTemplate

[English](./README.md) | 简体中文

一个个人 Next.js 起步模板，内置一套有明确取舍的技术栈和开箱即用的 Dashboard 壳层，让新项目跳过繁琐配置、直接开始写业务功能。

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8) ![Biome](https://img.shields.io/badge/Biome-2.x-60a5fa) ![pnpm](https://img.shields.io/badge/pnpm-10-f69220)

## 特性

- **Next.js 16** — App Router、TypeScript、Turbopack、React Compiler
- **Tailwind CSS v4 + shadcn/ui** — 全套组件随仓库分发（`src/components/ui/`），通过 CSS 变量定制主题
- **Dashboard 壳层** — 侧边栏 + 顶栏布局（`shadcn-space/dashboard-shell-01`），数据驱动导航、明暗主题切换、附带分析面板和图表示例页
- **品牌主题** — 蓝色 `#2b7eff` 主色 + 同色相派生的 5 档图表色阶，支持明暗双模式
- **Biome** — lint 和格式化一个工具搞定（不用 ESLint/Prettier）
- **常用库齐备** — `pino`（日志）、`zustand`（客户端状态）、`@tanstack/react-query`（服务端状态）、`react-hook-form` + `zod`（表单）、`date-fns`、`motion`、`next-themes`、`recharts`

## 快速开始

需要 **Node.js >= 20** 和 **pnpm 10.x**。

```sh
pnpm install
pnpm dev
```

打开 [http://localhost:3005](http://localhost:3005) —— 开发服务器与 `pnpm start`
默认端口都是 **3005**。

## 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | Turbopack 开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm start` | 运行生产构建 |
| `pnpm check-types` | TypeScript 类型检查（`tsc --noEmit`） |
| `pnpm lint` | Biome lint + 格式检查 |
| `pnpm lint:fix` | 应用 Biome 自动修复 |
| `pnpm format` | 仅格式化 |

## 项目结构

```
src/
├── app/
│   ├── (app)/                # 被 Dashboard 壳层包裹的路由
│   │   ├── page.tsx          # / — 分析面板
│   │   └── charts/           # /charts/line、/charts/bar
│   ├── layout.tsx            # 根布局（字体、providers）
│   └── globals.css           # Tailwind v4 + 主题 token
├── components/
│   ├── ui/                   # shadcn 组件（归本仓库所有，可自由修改）
│   ├── shadcn-space/blocks/  # Dashboard 区块（侧边栏、顶栏、图表）
│   ├── providers.tsx         # QueryClient → Theme provider 栈
│   └── theme-toggle.tsx      # 明暗切换按钮
└── lib/                      # logger、query client、zustand stores、utils
```

## 添加组件

```sh
pnpm dlx shadcn@latest add <component-name>
```

生成的组件位于 `src/components/ui/`，可自由编辑。`components.json` 中已预配置 `@shadcn-space` registry，用于安装 dashboard 区块。

## 约定

所有编码约定、库选型以及面向 AI 编码助手的规则统一记录在 **[AGENTS.md](./AGENTS.md)** —— 本仓库的唯一权威来源。
