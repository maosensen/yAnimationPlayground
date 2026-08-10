import { createHash } from "node:crypto";
import { choreography } from "@yanimation/motion-tokens";
import {
  type AssetManifest,
  type CreativeBrief,
  CreativeBriefSchema,
  type ImplementationScaffold,
  type ProductionDraft,
  ProductionDraftSchema,
  type ProvenanceManifest,
  pipelineSchemaVersion,
  pipelineVersion,
  type QaCheck,
  type QaReport,
  type Storyboard,
} from "./schema.ts";

const sortValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, sortValue(nested)]),
    );
  }
  return value;
};

export const stableJson = (value: unknown) =>
  `${JSON.stringify(sortValue(value), null, 2)}\n`;

export const hashValue = (value: unknown) =>
  createHash("sha256").update(stableJson(value)).digest("hex");

const unique = (values: string[]) => new Set(values).size === values.length;

const check = (
  id: string,
  category: QaCheck["category"],
  condition: boolean,
  success: string,
  failure: string,
  evidenceIds: string[],
): QaCheck => ({
  id,
  category,
  status: condition ? "pass" : "fail",
  message: condition ? success : failure,
  evidenceIds,
});

export const runQa = (
  brief: CreativeBrief,
  draft: ProductionDraft,
): QaReport => {
  const sceneIds = draft.scenes.map((scene) => scene.id);
  const assetIds = draft.assets.map((asset) => asset.id);
  const layerIds = draft.scenes.flatMap((scene) =>
    scene.layers.map((layer) => layer.id),
  );
  const referencedAssets = draft.scenes.flatMap((scene) =>
    scene.layers.flatMap((layer) => (layer.assetId ? [layer.assetId] : [])),
  );
  const availableAssets = new Set(assetIds);
  const missingAssets = referencedAssets.filter(
    (assetId) => !availableAssets.has(assetId),
  );
  const approvedStages = new Set(
    draft.review.checkpoints
      .filter((checkpoint) => checkpoint.status === "approved")
      .map((checkpoint) => checkpoint.stage),
  );

  let cursor = 0;
  let timelineContinuous = true;
  for (const scene of draft.scenes) {
    if (scene.start !== cursor) timelineContinuous = false;
    cursor += scene.duration;
  }

  const formatIds = new Set(brief.formats.map((format) => format.id));
  const coveredFormats = new Set(
    draft.implementationTargets.flatMap((target) =>
      target.outputs.map((output) => output.formatId),
    ),
  );
  const uncoveredFormats = [...formatIds].filter(
    (formatId) => !coveredFormats.has(formatId),
  );

  const implementedScenes = new Set(
    draft.implementationTargets.flatMap((target) => target.sceneIds),
  );
  const unimplementedScenes = sceneIds.filter(
    (sceneId) => !implementedScenes.has(sceneId),
  );

  const checks: QaCheck[] = [
    check(
      "schema.valid",
      "schema",
      brief.projectId === draft.projectId,
      "Creative brief and production draft share one project ID.",
      "Creative brief and production draft project IDs do not match.",
      [brief.projectId, draft.projectId],
    ),
    check(
      "ids.unique",
      "schema",
      unique(sceneIds) && unique(assetIds) && unique(layerIds),
      "Scene, asset, and layer IDs are unique within their namespaces.",
      "Duplicate scene, asset, or layer IDs were found.",
      [...sceneIds, ...assetIds, ...layerIds],
    ),
    check(
      "timeline.contiguous",
      "timeline",
      timelineContinuous && cursor === brief.durationSeconds,
      `Scenes form a contiguous ${brief.durationSeconds}s timeline.`,
      `Scenes must start at 0, remain contiguous, and end at ${brief.durationSeconds}s; received ${cursor}s.`,
      sceneIds,
    ),
    check(
      "assets.references",
      "assets",
      missingAssets.length === 0,
      "Every referenced asset resolves through the asset manifest.",
      `Missing asset references: ${missingAssets.join(", ") || "unknown"}.`,
      referencedAssets,
    ),
    check(
      "assets.readiness",
      "assets",
      draft.assets.every((asset) => asset.reviewStatus === "ready"),
      "Every asset is licensed and marked ready for implementation.",
      "At least one asset is blocked from implementation.",
      assetIds,
    ),
    check(
      "implementation.scenes",
      "implementation",
      unimplementedScenes.length === 0,
      "Every storyboard scene is assigned to an implementation target.",
      `Unassigned scenes: ${unimplementedScenes.join(", ")}.`,
      sceneIds,
    ),
    check(
      "implementation.formats",
      "implementation",
      uncoveredFormats.length === 0,
      "Every requested format has a declared output composition.",
      `Formats without output coverage: ${uncoveredFormats.join(", ")}.`,
      [...formatIds],
    ),
    check(
      "motion.vocabulary",
      "implementation",
      draft.scenes.every((scene) =>
        scene.layers.every((layer) => layer.motionIntent in choreography),
      ),
      "Every layer uses a shared semantic motion intent.",
      "At least one layer uses an unknown motion intent.",
      layerIds,
    ),
    check(
      "accessibility.fallbacks",
      "accessibility",
      draft.scenes.every((scene) =>
        scene.layers.every(
          (layer) => layer.accessibility.fallback.trim().length > 0,
        ),
      ),
      "Every layer defines a reduced-motion fallback.",
      "At least one layer lacks a reduced-motion fallback.",
      layerIds,
    ),
    check(
      "review.gates",
      "review",
      ["storyboard", "assets", "implementation"].every((stage) =>
        approvedStages.has(stage as "storyboard" | "assets" | "implementation"),
      ),
      "Storyboard, assets, and implementation checkpoints are human-approved.",
      "One or more required human review checkpoints are not approved.",
      [...approvedStages],
    ),
  ];

  const summary = checks.reduce(
    (counts, item) => {
      counts[item.status] += 1;
      return counts;
    },
    { pass: 0, warn: 0, fail: 0 },
  );

  return {
    schemaVersion: pipelineSchemaVersion,
    projectId: brief.projectId,
    status: summary.fail === 0 ? "pass" : "fail",
    summary,
    checks,
  };
};

export const compileProject = (briefInput: unknown, draftInput: unknown) => {
  const brief = CreativeBriefSchema.parse(briefInput);
  const draft = ProductionDraftSchema.parse(draftInput);

  const storyboard: Storyboard = {
    schemaVersion: pipelineSchemaVersion,
    projectId: brief.projectId,
    title: brief.title,
    seed: brief.seed,
    fps: brief.fps,
    durationSeconds: brief.durationSeconds,
    scenes: draft.scenes,
  };

  const assetManifest: AssetManifest = {
    schemaVersion: pipelineSchemaVersion,
    projectId: brief.projectId,
    policy: brief.constraints.assetPolicy,
    assets: draft.assets,
  };

  const implementationScaffold: ImplementationScaffold = {
    schemaVersion: pipelineSchemaVersion,
    projectId: brief.projectId,
    motionVocabulary: "@yanimation/motion-tokens",
    targets: draft.implementationTargets,
    sceneContracts: draft.scenes.map((scene) => ({
      sceneId: scene.id,
      layerIds: scene.layers.map((layer) => layer.id),
      assetIds: scene.layers.flatMap((layer) =>
        layer.assetId ? [layer.assetId] : [],
      ),
      motionIntents: [
        ...new Set(scene.layers.map((layer) => layer.motionIntent)),
      ],
      acceptanceCriteria: scene.acceptanceCriteria,
    })),
  };

  const qaReport = runQa(brief, draft);
  const artifactHashes = {
    storyboard: hashValue(storyboard),
    assetManifest: hashValue(assetManifest),
    implementationScaffold: hashValue(implementationScaffold),
    qaReport: hashValue(qaReport),
  };
  const provenanceManifest: ProvenanceManifest = {
    schemaVersion: pipelineSchemaVersion,
    projectId: brief.projectId,
    pipelineVersion,
    seed: brief.seed,
    generator: draft.generator,
    review: draft.review,
    inputHashes: {
      creativeBrief: hashValue(brief),
      productionDraft: hashValue(draft),
    },
    artifactHashes,
    bundleHash: hashValue(artifactHashes),
  };

  return {
    brief,
    draft,
    storyboard,
    assetManifest,
    implementationScaffold,
    qaReport,
    provenanceManifest,
  };
};
