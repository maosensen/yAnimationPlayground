# 代码视频生产参考

v0.5 使用同一份 36 秒产品叙事，对 Remotion 与 HyperFrames 建立可重复的
预览、渲染和验收流程。目标不是选出抽象意义上的“最好”，而是明确它们在后续
Studio 与自动化生产中的位置。

## 最终结论

- **默认选择 Remotion**：当视频属于 React / TypeScript 产品体系，需要 typed
  props、组件复用、服务端渲染或成熟生态时，Remotion 是当前更稳妥的生产基线。
- **重点观察 HyperFrames**：当输入天然是 HTML / CSS / GSAP，或者希望 Agent
  直接生成可检查的 HTML 时间轴时，HyperFrames 的表达模型更直接，可视化 Studio
  也更接近创作工作流。
- **不要把二者装进 Web 应用**：它们负责离线视频输出，不负责网页中的即时交互。
  共享 brief、token、源素材和验收契约即可，运行时依赖继续留在独立 workspace。

## 共享生产契约

`packages/video-contract/` 是两套实现共同消费的输入层：

| 项目 | 当前值 |
|---|---|
| 时长 | 36 秒 / 1080 帧 |
| 帧率 | 30 FPS |
| 横版 | 1920 × 1080，左右叙事布局 |
| 竖版 | 1080 × 1920，上下响应式布局 |
| 安全区 | 横竖版分别声明四边像素值 |
| 字体 | Inter |
| 音频 | 48 kHz 单声道确定性环境音轨 |
| 内容 | 5 个连续场景、字幕时间与固定 seed |

共享层只包含数据契约和源输入，不包含跨运行时组件。若把 React 组件与 HTML
片段强行抽象为同一个 API，最终只会得到能力最低公分母，并削弱本次比较价值。

## 标准工作流

```sh
# 1. 校验契约、生成音轨并同步两个工程
pnpm video:prepare

# 2. 检查 Remotion Composition 与 HyperFrames 时间轴
pnpm video:check

# 3. 渲染两套运行时的横竖双版
pnpm video:render

# 4. 校验尺寸、时长、帧率、视频编码与音轨
pnpm video:inspect
```

输出位于 `apps/remotion/output/` 与 `apps/hyperframes/output/`，不会进入 Git。
媒体验收报告写入 `notes/evidence/v0.5-render-report.json`。

## 本地预览

### Remotion

```sh
pnpm --filter @yanimation/remotion dev
```

打开 <http://localhost:4405>，切换 `LivingSignalsLandscape` 与
`LivingSignalsPortrait`。两套 Composition 使用同一个 React 组件，布局根据画布
方向重新编排，不是对横版进行等比压缩。

### HyperFrames

```sh
pnpm --filter @yanimation/hyperframes dev
pnpm --filter @yanimation/hyperframes dev:portrait
```

横版 Studio 位于 <http://localhost:4406>，竖版位于 <http://localhost:4407>。
HyperFrames 对每个项目要求唯一根入口，因此两个宽高比保持独立项目目录，但都由
同一生成器和同一份 JSON 契约创建。

## 对比矩阵

| 维度 | Remotion | HyperFrames |
|---|---|---|
| 时间模型 | 帧编号 | 秒 + 可 seek 时间轴 |
| 创作载体 | React 组件 | 原生 HTML |
| 动画方式 | `useCurrentFrame`、插值、弹簧 | paused GSAP timeline 与 adapter |
| 类型能力 | TypeScript props 与组件接口 | JSON 契约在生成阶段校验 |
| 预览 | Remotion Studio | HyperFrames Studio + 可视时间轴 |
| 复用方向 | React UI、数据层、组件生态 | HTML、CSS、GSAP、Agent 生成内容 |
| 确定性 | 每帧由输入与 frame 计算 | 引擎 seek 每一帧并捕获 Chrome 输出 |
| 运维路径 | 本地、服务端、Lambda / Cloud Run 生态成熟 | 本地、Docker、Producer API，当前仍快速迭代 |
| 当前风险 | React bundle 与渲染依赖较重 | 版本尚早，结构规则与 CLI 变化需要持续跟踪 |

## 验收结果

四条参考成片均通过以下门禁：

- H.264 视频与 AAC 音轨存在；
- 30 FPS；
- 横版 1920 × 1080、竖版 1080 × 1920；
- 目标时长 36 秒（Remotion 容器时长 36.053 秒，HyperFrames 36.000 秒）；
- HyperFrames `check` 的运行时、布局、运动与 47 项文字对比度检查全部通过；
- 两套 Studio 已实机播放，关键帧已从最终 MP4 再次抽取检查。

## 不进入本仓库的内容

非线性时间轴编辑器、项目持久化、多人协作、云渲染队列、计费和生产素材管理属于
未来独立 Studio 仓库。本仓库只保留可以迁移给 Studio 的验证结果、契约与参考作品。
