import { z } from "zod";

export const pipelineSchemaVersion = 1 as const;
export const pipelineVersion = "0.1.0" as const;

const StableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, "Use a stable kebab-case ID");

const ApprovalSchema = z.object({
  status: z.literal("approved"),
  reviewer: z.string().min(1),
  note: z.string().min(1),
});

const FormatSchema = z.object({
  id: z.enum(["landscape", "portrait", "square"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  safeArea: z.object({
    top: z.number().int().nonnegative(),
    right: z.number().int().nonnegative(),
    bottom: z.number().int().nonnegative(),
    left: z.number().int().nonnegative(),
  }),
});

export const CreativeBriefSchema = z.object({
  schemaVersion: z.literal(pipelineSchemaVersion),
  projectId: StableIdSchema,
  title: z.string().min(1),
  seed: z.number().int().nonnegative(),
  durationSeconds: z.number().positive(),
  fps: z.number().int().positive(),
  audience: z.string().min(1),
  objective: z.string().min(1),
  coreMessage: z.string().min(1),
  callToAction: z.string().min(1),
  tone: z.array(z.string().min(1)).min(2),
  formats: z.array(FormatSchema).min(1),
  constraints: z.object({
    copyLanguage: z.string().min(1),
    assetPolicy: z.enum(["repo-only", "repo-and-generated"]),
    reducedMotionRequired: z.literal(true),
    providerPolicy: z.literal("provider-neutral"),
  }),
  review: ApprovalSchema,
});

const LayerSchema = z.object({
  id: StableIdSchema,
  kind: z.enum(["text", "shape", "data", "image"]),
  role: z.string().min(1),
  assetId: StableIdSchema.optional(),
  motionIntent: z.enum(["feedback", "enter", "exit", "layout", "emphasis"]),
  accessibility: z.object({
    essential: z.boolean(),
    reducedMotion: z.enum(["preserve", "replace-with-opacity", "static"]),
    fallback: z.string().min(1),
  }),
});

const SceneSchema = z.object({
  id: StableIdSchema,
  start: z.number().nonnegative(),
  duration: z.number().positive(),
  intent: z.string().min(1),
  copy: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  visual: z.object({
    kind: z.enum(["signal-field", "atlas-grid", "review-stack"]),
    direction: z.string().min(1),
  }),
  layers: z.array(LayerSchema).min(1),
  acceptanceCriteria: z.array(z.string().min(1)).min(1),
});

const AssetSchema = z.object({
  id: StableIdSchema,
  kind: z.enum(["font", "data", "image", "audio", "svg"]),
  role: z.string().min(1),
  origin: z.enum(["repo", "inline", "generated"]),
  locator: z.string().min(1),
  license: z.string().min(1),
  reviewStatus: z.enum(["ready", "blocked"]),
});

const ImplementationTargetSchema = z.object({
  id: StableIdSchema,
  runtime: z.enum(["remotion", "web"]),
  entryPoint: z.string().min(1),
  strategy: z.string().min(1),
  sceneIds: z.array(StableIdSchema).min(1),
  outputs: z
    .array(
      z.object({
        id: StableIdSchema,
        formatId: z.enum(["landscape", "portrait", "square"]),
        compositionId: z.string().min(1),
      }),
    )
    .min(1),
});

export const ProductionDraftSchema = z.object({
  schemaVersion: z.literal(pipelineSchemaVersion),
  projectId: StableIdSchema,
  generator: z.object({
    kind: z.literal("ai-assisted"),
    provider: z.literal("provider-neutral"),
    model: z.string().min(1),
    promptContractVersion: z.literal("1.0.0"),
  }),
  scenes: z.array(SceneSchema).min(1),
  assets: z.array(AssetSchema),
  implementationTargets: z.array(ImplementationTargetSchema).min(1),
  review: z.object({
    status: z.literal("approved"),
    reviewer: z.string().min(1),
    checkpoints: z
      .array(
        z.object({
          stage: z.enum(["storyboard", "assets", "implementation"]),
          status: z.enum(["approved", "changes-requested"]),
          note: z.string().min(1),
        }),
      )
      .min(3),
  }),
});

export const QaCheckSchema = z.object({
  id: StableIdSchema,
  category: z.enum([
    "schema",
    "timeline",
    "assets",
    "implementation",
    "accessibility",
    "review",
  ]),
  status: z.enum(["pass", "warn", "fail"]),
  message: z.string().min(1),
  evidenceIds: z.array(z.string()),
});

export const QaReportSchema = z.object({
  schemaVersion: z.literal(pipelineSchemaVersion),
  projectId: StableIdSchema,
  status: z.enum(["pass", "fail"]),
  summary: z.object({
    pass: z.number().int().nonnegative(),
    warn: z.number().int().nonnegative(),
    fail: z.number().int().nonnegative(),
  }),
  checks: z.array(QaCheckSchema),
});

export type CreativeBrief = z.infer<typeof CreativeBriefSchema>;
export type ProductionDraft = z.infer<typeof ProductionDraftSchema>;
export type QaCheck = z.infer<typeof QaCheckSchema>;
export type QaReport = z.infer<typeof QaReportSchema>;

export type Storyboard = {
  schemaVersion: typeof pipelineSchemaVersion;
  projectId: string;
  title: string;
  seed: number;
  fps: number;
  durationSeconds: number;
  scenes: ProductionDraft["scenes"];
};

export type AssetManifest = {
  schemaVersion: typeof pipelineSchemaVersion;
  projectId: string;
  policy: CreativeBrief["constraints"]["assetPolicy"];
  assets: ProductionDraft["assets"];
};

export type ImplementationScaffold = {
  schemaVersion: typeof pipelineSchemaVersion;
  projectId: string;
  motionVocabulary: "@yanimation/motion-tokens";
  targets: ProductionDraft["implementationTargets"];
  sceneContracts: Array<{
    sceneId: string;
    layerIds: string[];
    assetIds: string[];
    motionIntents: string[];
    acceptanceCriteria: string[];
  }>;
};

export type ProvenanceManifest = {
  schemaVersion: typeof pipelineSchemaVersion;
  projectId: string;
  pipelineVersion: typeof pipelineVersion;
  seed: number;
  generator: ProductionDraft["generator"];
  review: ProductionDraft["review"];
  inputHashes: Record<"creativeBrief" | "productionDraft", string>;
  artifactHashes: Record<
    "storyboard" | "assetManifest" | "implementationScaffold" | "qaReport",
    string
  >;
  bundleHash: string;
};
