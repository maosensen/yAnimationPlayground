"use client";

import { signalAtlasReference } from "@yanimation/animation-pipeline/reference";
import { Reveal } from "@yanimation/motion-kit/reveal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const {
  creativeBrief,
  productionDraft,
  storyboard,
  assetManifest,
  implementationScaffold,
  qaReport,
  invalidQaReport,
  provenanceManifest,
} = signalAtlasReference;

const stageDefinitions = [
  {
    id: "brief",
    index: "01",
    label: "创意简报",
    artifact: "creative-brief.json",
    description: "人工定义目标与边界",
  },
  {
    id: "storyboard",
    index: "02",
    label: "故事板",
    artifact: "storyboard.json",
    description: "AI 提议，人工批准节奏",
  },
  {
    id: "assets",
    index: "03",
    label: "资产清单",
    artifact: "asset-manifest.json",
    description: "引用、授权与就绪状态",
  },
  {
    id: "implementation",
    index: "04",
    label: "实现脚手架",
    artifact: "implementation-scaffold.json",
    description: "场景分配到真实运行时",
  },
  {
    id: "qa",
    index: "05",
    label: "执行 QA",
    artifact: "qa-report.json",
    description: "规则检测，不替代人审",
  },
] as const;

type StageId = (typeof stageDefinitions)[number]["id"];
type ReviewMode = "reference" | "missing-asset";

const qaCategoryLabels = {
  schema: "结构",
  timeline: "时间线",
  assets: "资产",
  implementation: "实现",
  accessibility: "无障碍",
  review: "审查",
} as const;

const toneLabels: Record<string, string> = {
  precise: "精确",
  calm: "克制",
  technical: "技术感",
  confident: "坚定",
};

const visualDirectionLabels: Record<string, string> = {
  "signal-field": "分散事件逐渐收束为三条稳定轨迹，表达从噪声中识别信号。",
  "atlas-grid": "五个生产阶段连接成可审查地图，顺序清楚但不暗示全自动化。",
  "review-stack": "编译产物堆叠为审查证据，最后收束到 QA 状态与指纹。",
};

const assetLabels: Record<
  string,
  { kind: string; origin: string; role: string }
> = {
  "inter-font": {
    kind: "字体",
    origin: "仓库依赖",
    role: "视频与界面共用的显示字体",
  },
  "signal-sample": {
    kind: "数据",
    origin: "确定性生成",
    role: "开场信号场的固定坐标样本",
  },
  "artifact-index": {
    kind: "数据",
    origin: "内联",
    role: "编译产物名称与状态索引",
  },
};

const targetStrategyLabels: Record<string, string> = {
  "remotion-proof":
    "逐帧 React 组合直接读取编译后的故事板与溯源清单，生成横竖两种确定性成片。",
  "web-review-workbench":
    "服务端预渲染静态产物，只把阶段切换与故障注入保留为小型客户端交互。",
};

const qaMessages: Record<string, { pass: string; fail: string }> = {
  "schema.valid": {
    pass: "创意简报与生产草案使用同一个项目 ID。",
    fail: "创意简报与生产草案的项目 ID 不一致。",
  },
  "ids.unique": {
    pass: "场景、资产与图层 ID 在各自命名空间中保持唯一。",
    fail: "检测到重复的场景、资产或图层 ID。",
  },
  "timeline.contiguous": {
    pass: "场景从 0 秒开始连续衔接，并在 12 秒准确结束。",
    fail: "场景时间线存在空隙、重叠或总时长不一致。",
  },
  "assets.references": {
    pass: "所有图层引用都能在资产清单中解析。",
    fail: "找不到资产引用：asset-that-does-not-exist。",
  },
  "assets.readiness": {
    pass: "所有资产均已确认授权并标记为可实现。",
    fail: "至少有一项资产仍处于阻塞状态。",
  },
  "implementation.scenes": {
    pass: "每个故事板场景都已分配到实现目标。",
    fail: "仍有故事板场景没有对应实现目标。",
  },
  "implementation.formats": {
    pass: "每种请求规格都声明了对应输出组合。",
    fail: "至少一种请求规格没有输出组合。",
  },
  "motion.vocabulary": {
    pass: "每个图层都使用共享的语义化运动意图。",
    fail: "至少一个图层使用了未知运动意图。",
  },
  "accessibility.fallbacks": {
    pass: "每个图层都定义了减少动效时的降级方式。",
    fail: "至少一个图层缺少减少动效降级方式。",
  },
  "review.gates": {
    pass: "故事板、资产与实现三个检查点均由人工批准。",
    fail: "一个或多个必要的人工检查点尚未批准。",
  },
};

const getQaMessage = (item: (typeof qaReport.checks)[number]) =>
  qaMessages[item.id]?.[item.status === "fail" ? "fail" : "pass"] ??
  item.message;

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  );
}

function BriefPanel() {
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
        <p className="font-mono text-[0.68rem] tracking-wider text-primary uppercase">
          核心信息
        </p>
        <p className="mt-2 text-lg font-medium">{creativeBrief.coreMessage}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          说明结构化审查如何把分散的动画想法收束为可以直接实现的系统。
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        {[
          ["目标受众", "需要把复杂系统行为讲清楚的产品与动效团队"],
          ["行动号召", creativeBrief.callToAction],
          [
            "成片规格",
            `${creativeBrief.durationSeconds} 秒 / ${creativeBrief.fps} fps`,
          ],
          ["供应商策略", "模型中立，不要求 API Key"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm leading-6">{value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="text-xs text-muted-foreground">创意语气</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {creativeBrief.tone.map((tone) => (
            <Badge key={tone} variant="outline">
              {toneLabels[tone] ?? tone}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4 ring-1 ring-border">
        <span
          className="icon-[solar--user-check-bold-duotone] mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium">人工批准后才进入 AI 草案</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            范围、核心信息、时长、输出规格与模型中立边界均已确认。
          </p>
        </div>
      </div>
    </div>
  );
}

function StoryboardPanel({
  selectedSceneId,
  onSelectScene,
}: {
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  const selectedScene =
    storyboard.scenes.find((scene) => scene.id === selectedSceneId) ??
    storyboard.scenes[0];

  return (
    <div className="space-y-5">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {storyboard.scenes.map((scene) => (
          <div
            key={scene.id}
            className={cn(
              "border-r border-background last:border-r-0",
              selectedScene.id === scene.id ? "bg-primary" : "bg-primary/30",
            )}
            style={{
              width: `${(scene.duration / storyboard.durationSeconds) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3" role="tablist">
        {storyboard.scenes.map((scene, index) => {
          const active = scene.id === selectedScene.id;
          return (
            <Button
              key={scene.id}
              type="button"
              role="tab"
              aria-selected={active}
              variant={active ? "secondary" : "outline"}
              className="h-auto justify-start px-3 py-3 text-left"
              onClick={() => onSelectScene(scene.id)}
            >
              <span className="flex flex-col items-start">
                <span className="font-mono text-[0.65rem] text-primary">
                  场景 0{index + 1} · {scene.start}–
                  {scene.start + scene.duration}s
                </span>
                <span className="mt-1 line-clamp-1">{scene.copy.title}</span>
              </span>
            </Button>
          );
        })}
      </div>
      <Reveal key={selectedScene.id} preset="rise">
        <div className="rounded-lg bg-muted/40 p-5 ring-1 ring-border">
          <Badge variant="outline">{selectedScene.visual.kind}</Badge>
          <h3 className="mt-4 text-xl font-semibold">
            {selectedScene.copy.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {selectedScene.copy.body}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">视觉方向</p>
              <p className="mt-1 text-sm leading-6">
                {visualDirectionLabels[selectedScene.visual.kind] ??
                  selectedScene.visual.direction}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">图层与运动意图</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedScene.layers.map((layer) => (
                  <Badge key={layer.id} variant="secondary">
                    {layer.id} / {layer.motionIntent}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AssetsPanel() {
  return (
    <div className="space-y-3">
      {assetManifest.assets.map((asset) => (
        <div
          key={asset.id}
          className="grid gap-3 rounded-lg bg-muted/40 p-4 ring-1 ring-border sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{asset.id}</p>
              <Badge variant="outline">
                {assetLabels[asset.id]?.kind ?? asset.kind}
              </Badge>
              <Badge variant="secondary">
                {assetLabels[asset.id]?.origin ?? asset.origin}
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {assetLabels[asset.id]?.role ?? asset.role} · {asset.locator}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge>可实现</Badge>
            <p className="mt-2 text-xs text-muted-foreground">
              {asset.license}
            </p>
          </div>
        </div>
      ))}
      <div className="rounded-lg bg-primary/10 p-4 text-sm leading-6 ring-1 ring-primary/20">
        资产不允许隐藏在提示词里：每一个引用都有稳定
        ID、来源、定位方式、授权和就绪状态。
      </div>
    </div>
  );
}

function ImplementationPanel() {
  return (
    <div className="space-y-4">
      {implementationScaffold.targets.map((target) => (
        <div
          key={target.id}
          className="rounded-lg bg-muted/40 p-5 ring-1 ring-border"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge>{target.runtime}</Badge>
                <p className="font-medium">{target.id}</p>
              </div>
              <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground">
                {target.entryPoint}
              </p>
            </div>
            <Badge variant="outline">
              {target.sceneIds.length} 场景 / {target.outputs.length} 输出
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {targetStrategyLabels[target.id] ?? target.strategy}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {target.outputs.map((output) => (
              <Badge key={output.id} variant="secondary">
                {output.formatId} · {output.compositionId}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-lg bg-card p-4 ring-1 ring-border">
        <p className="text-xs text-muted-foreground">可复现命令</p>
        <code className="mt-2 block overflow-x-auto font-mono text-xs text-primary">
          pnpm pipeline:check && pnpm --filter @yanimation/remotion
          render:pipeline
        </code>
      </div>
    </div>
  );
}

function QaPanel({ mode }: { mode: ReviewMode }) {
  const report = mode === "reference" ? qaReport : invalidQaReport;
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-lg p-4 ring-1",
          report.status === "pass"
            ? "bg-primary/10 ring-primary/20"
            : "bg-destructive/10 ring-destructive/20",
        )}
      >
        <div>
          <p className="text-xs text-muted-foreground">当前审查结果</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold",
              report.status === "fail" && "text-destructive",
            )}
          >
            {report.status === "pass" ? "可进入实现" : "已阻断实现"}
          </p>
        </div>
        <Badge variant={report.status === "pass" ? "default" : "destructive"}>
          {report.summary.pass} 通过 / {report.summary.fail} 失败
        </Badge>
      </div>
      {report.checks.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-lg bg-muted/40 p-3 ring-1 ring-border"
        >
          <span
            className={cn(
              "mt-0.5 size-4 shrink-0",
              item.status === "pass"
                ? "icon-[solar--check-circle-bold] text-primary"
                : "icon-[solar--danger-triangle-bold] text-destructive",
            )}
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-[0.68rem]">{item.id}</code>
              <span className="text-[0.68rem] text-muted-foreground">
                {qaCategoryLabels[item.category]}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {getQaMessage(item)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StagePanel({
  stage,
  selectedSceneId,
  onSelectScene,
  mode,
}: {
  stage: StageId;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  mode: ReviewMode;
}) {
  if (stage === "brief") return <BriefPanel />;
  if (stage === "storyboard") {
    return (
      <StoryboardPanel
        selectedSceneId={selectedSceneId}
        onSelectScene={onSelectScene}
      />
    );
  }
  if (stage === "assets") return <AssetsPanel />;
  if (stage === "implementation") return <ImplementationPanel />;
  return <QaPanel mode={mode} />;
}

export function AiPipelineWorkbench() {
  const [activeStage, setActiveStage] = useState<StageId>("brief");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("reference");
  const [selectedSceneId, setSelectedSceneId] = useState(
    storyboard.scenes[0].id,
  );
  const activeDefinition =
    stageDefinitions.find((stage) => stage.id === activeStage) ??
    stageDefinitions[0];
  const activeReport = reviewMode === "reference" ? qaReport : invalidQaReport;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="参考项目"
          value={creativeBrief.title}
          detail={`${storyboard.scenes.length} 个场景，共 ${storyboard.durationSeconds} 秒`}
        />
        <MetricCard
          label="结构化产物"
          value="5"
          detail="简报、故事板、资产、脚手架、QA"
        />
        <MetricCard
          label="可执行门禁"
          value={qaReport.checks.length}
          detail="结构、时间线、引用、实现与审查"
        />
        <MetricCard
          label="确定性指纹"
          value={provenanceManifest.bundleHash.slice(0, 8)}
          detail={`seed ${provenanceManifest.seed} · pipeline ${provenanceManifest.pipelineVersion}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>生产阶段</CardTitle>
          <CardDescription>
            点击阶段查看输入与生成物；每一步都有稳定文件、审查责任和可执行规则。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-1">
            <div
              className="grid min-w-[48rem] grid-cols-5 gap-2"
              role="tablist"
              aria-label="AI 动画生产阶段"
            >
              {stageDefinitions.map((stage) => {
                const active = activeStage === stage.id;
                return (
                  <Button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    variant={active ? "secondary" : "outline"}
                    className="h-auto justify-start px-3 py-4 text-left"
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <span className="flex min-w-0 flex-col items-start">
                      <span className="font-mono text-[0.65rem] text-primary">
                        {stage.index} / 已审查
                      </span>
                      <span className="mt-1 font-medium">{stage.label}</span>
                      <span className="mt-1 line-clamp-1 text-[0.68rem] text-muted-foreground">
                        {stage.artifact}
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
          <Progress
            className="mt-4"
            value={
              ((stageDefinitions.findIndex(
                (stage) => stage.id === activeStage,
              ) +
                1) /
                stageDefinitions.length) *
              100
            }
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>
                  {activeDefinition.index} · {activeDefinition.label}
                </CardTitle>
                <CardDescription className="mt-1">
                  {activeDefinition.description}
                </CardDescription>
              </div>
              <Badge variant="outline">{activeDefinition.artifact}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Reveal key={activeStage} preset="rise">
              <StagePanel
                stage={activeStage}
                selectedSceneId={selectedSceneId}
                onSelectScene={setSelectedSceneId}
                mode={reviewMode}
              />
            </Reveal>
          </CardContent>
          <CardFooter className="text-xs leading-5 text-muted-foreground">
            AI
            负责提出结构化候选；人工负责批准意图、资产与实现边界；编译器负责重复执行事实校验。
          </CardFooter>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>故障注入验证</CardTitle>
            <CardDescription>
              切换到受控缺陷，验证管线不是无条件显示绿色。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={reviewMode === "reference" ? "default" : "outline"}
                onClick={() => setReviewMode("reference")}
              >
                标准参考
              </Button>
              <Button
                type="button"
                variant={
                  reviewMode === "missing-asset" ? "destructive" : "outline"
                }
                onClick={() => setReviewMode("missing-asset")}
              >
                注入缺失资产
              </Button>
            </div>
            <div
              className={cn(
                "rounded-lg p-4 ring-1",
                activeReport.status === "pass"
                  ? "bg-primary/10 ring-primary/20"
                  : "bg-destructive/10 ring-destructive/20",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  {activeReport.status === "pass" ? "管线通过" : "管线阻断"}
                </span>
                <Badge
                  variant={
                    activeReport.status === "pass" ? "default" : "destructive"
                  }
                >
                  {activeReport.summary.fail} 个失败
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {activeReport.status === "pass"
                  ? "参考草案通过全部结构与语义门禁，可以进入实现。"
                  : "草案虽然符合 JSON Schema，但引用了清单中不存在的资产，因此不能进入实现。"}
              </p>
            </div>
            <div className="space-y-2">
              {activeReport.checks
                .filter(
                  (item) =>
                    item.status === "fail" ||
                    [
                      "timeline.contiguous",
                      "assets.references",
                      "review.gates",
                    ].includes(item.id),
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 text-xs leading-5"
                  >
                    <span
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        item.status === "pass"
                          ? "icon-[solar--check-circle-bold] text-primary"
                          : "icon-[solar--danger-triangle-bold] text-destructive",
                      )}
                      aria-hidden
                    />
                    <span className="text-muted-foreground">
                      <code className="text-foreground">{item.id}</code>
                      <br />
                      {getQaMessage(item)}
                    </span>
                  </div>
                ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setActiveStage("qa")}
            >
              查看全部 {activeReport.checks.length} 条规则
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>这套流程解决什么，不解决什么</CardTitle>
          <CardDescription>
            v0.7 验证的是可移植生产契约，不是自动化 Studio。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-primary/10 p-4 ring-1 ring-primary/20">
            <p className="font-medium">适合现在沉淀</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>• 提示词输出结构、稳定 ID 与 JSON Schema</li>
              <li>• 故事板、资产和运行时分工的人工审查点</li>
              <li>• 确定性编译、漂移检测与渲染前 QA</li>
            </ul>
          </div>
          <div className="rounded-lg bg-muted/40 p-4 ring-1 ring-border">
            <p className="font-medium">留给独立 Studio</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>• 模型供应商编排、提示历史与额度管理</li>
              <li>• 可视化时间线、协作审片与项目持久化</li>
              <li>• 云资产生成、批量渲染、发布和计费</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <p className="text-center font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
        Draft {productionDraft.generator.model} · Bundle{" "}
        {provenanceManifest.bundleHash}
      </p>
    </div>
  );
}
