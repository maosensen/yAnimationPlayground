# AI 辅助动画生产参考

v0.7 建立一条模型中立、可人工审查、可确定性重建的动画生产链：

```text
creative brief → structured AI draft → compiled artifacts → executable QA → runtime proof
```

核心目标不是“让 AI 自动做完动画”，而是把 AI 擅长的发散、归纳与初稿能力放在
明确的数据边界中，让人可以逐项批准，让程序可以重复检查，让实现者可以继续编辑。

## 最终结论

- **AI 输出必须先成为结构化草案**：提示词本身不是生产资产；只有通过版本化 JSON
  Schema 的草案，才可以进入故事板、资产与实现审查。
- **Schema 与语义 QA 必须分层**：结构合法不代表引用存在、时间连续、规格覆盖完整。
  `missing-asset` fixture 专门证明语义错误会被阻断。
- **人工批准是事实，不是模型字段**：模型可以提出候选，但 brief、storyboard、assets
  与 implementation 的批准责任必须由人承担。
- **生成物应提交并做漂移检查**：下游消费固定文件，CI 用相同输入重新编译并比较，
  从而发现手改生成物、隐藏状态或非确定性输出。
- **模型接入放在管线上游**：Web 与 Remotion 只消费审查后的 bundle，不携带模型 SDK、
  API Key 或供应商逻辑。

## 五个阶段

| 阶段 | 责任主体 | 核心输入 | 可审查产物 | 阻断条件 |
|---|---|---|---|---|
| 创意简报 | 人 | 目标、受众、信息、规格、约束 | `creative-brief.json` | 范围与责任未批准 |
| 生产草案 | AI / Agent 提议，人批准 | 简报 + prompt contract | `production-draft.json` | 不符合 Schema |
| 编译产物 | 确定性编译器 | 两份已审查 source | storyboard、assets、scaffold | 输入不合法 |
| 执行 QA | 规则引擎 | 编译产物与交叉引用 | `qa-report.json` | 任一 fail |
| 运行时证明 | 实现者 | 同一 reference bundle | Web 工作台 + Remotion 成片 | 产物不可消费或渲染不合格 |

这里的“生产草案”不是自动批准结果。参考文件中记录的 reviewer 代表模拟完成过人工审查
的稳定样例；正式 Studio 应把身份、时间与权限写入自己的持久化审查系统。

## 文件布局

```text
packages/animation-pipeline/
├── prompts/production-director.md
├── schema/
│   ├── creative-brief.schema.json
│   └── production-draft.schema.json
├── examples/signal-atlas/
│   ├── source/
│   │   ├── creative-brief.json
│   │   └── production-draft.json
│   ├── generated/
│   │   ├── storyboard.json
│   │   ├── asset-manifest.json
│   │   ├── implementation-scaffold.json
│   │   ├── qa-report.json
│   │   └── provenance-manifest.json
│   └── fixtures/
│       ├── missing-asset-draft.json
│       └── missing-asset-qa-report.json
├── src/schema.ts
├── src/compiler.ts
└── test/pipeline.test.ts
```

`source/` 可以由人、AI 或 Agent 编辑；`generated/` 只由编译器写入。两者都进入 Git，
因此 PR 可以同时审查意图变化与派生产物变化。

## 标准工作流

```sh
# 修改 source 后重新编译 Schema 与参考产物
pnpm pipeline:generate

# 执行类型、契约、语义 QA 与生成物漂移检查
pnpm pipeline:check

# 发现四个 Remotion Composition
pnpm --filter @yanimation/remotion compositions

# 渲染 Signal Atlas 横版实现证明
pnpm --filter @yanimation/remotion render:pipeline

# 使用 ffprobe 验收尺寸、帧率、时长与编码
pnpm pipeline:inspect
```

`pnpm check` 已包含 pipeline 测试与漂移检查，`pnpm video:prepare` 也会先确认 pipeline
产物仍与已审查输入一致。

## QA 策略

当前规则覆盖六类事实：

1. **结构**：brief / draft 的项目 ID 一致，scene / asset / layer ID 唯一。
2. **时间线**：从 0 秒开始、场景连续、总时长等于 brief。
3. **资产**：每个引用都存在于 manifest，且授权与就绪状态明确。
4. **实现**：所有场景和请求规格都有运行时目标与输出组合。
5. **无障碍**：每个图层都有 reduced-motion 降级描述。
6. **人工审查**：storyboard、assets、implementation 三个检查点全部批准。

参考 bundle 是 10/10 通过。受控 fixture 仍然符合 JSON Schema，但引用
`asset-that-does-not-exist`，因此 `assets.references` 失败并阻断实现。这条反例防止
工作台退化为只会显示绿色状态的演示。

## 确定性与溯源

编译器对规范化输入与每个生成物计算 SHA-256，最后形成 `bundleHash`。清单同时保存：

- creative brief 与 production draft 的输入 hash；
- storyboard、asset manifest、implementation scaffold、QA report 的产物 hash；
- pipeline 版本、seed、草案生成来源与人工检查点。

相同结构化输入必须得到相同 hash。`pipeline:check` 会逐字比较追踪文件与重新编译结果，
所以生成时间戳不会进入编译产物，文件空格变化也不会改变输入事实。

## Signal Atlas 实现证明

Signal Atlas 是 12 秒、30 FPS、三场景的 v0.7 旗舰样例。编译产物同时驱动：

- `/labs/ai-pipeline` 中文操作工作台；
- `SignalAtlasLandscape`（1920 × 1080）Remotion Composition；
- `SignalAtlasPortrait`（1080 × 1920）Remotion Composition。

横版成片已验证为 H.264、1920 × 1080、30 FPS、12.053 秒，并抽取三个场景的稳定帧
检查安全区、层级与 QA 叙事。报告位于 `notes/evidence/v0.7-render-report.json`。

## Studio 边界

以下能力不会进入本仓库：模型供应商路由、提示历史、资产生成额度、可视化时间线、项目
持久化、协作审片、云渲染、发布与计费。后续独立 Studio 可以消费这里的 Schema、
prompt contract、编译器与 bundle 格式，但需要拥有自己的产品数据模型与发布周期。
