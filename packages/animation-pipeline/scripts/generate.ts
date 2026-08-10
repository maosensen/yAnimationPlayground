import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { compileProject, stableJson } from "../src/compiler.ts";
import { CreativeBriefSchema, ProductionDraftSchema } from "../src/schema.ts";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleRoot = `${packageRoot}/examples/signal-atlas`;
const generatedRoot = `${exampleRoot}/generated`;
const schemaRoot = `${packageRoot}/schema`;
const checkOnly = process.argv.includes("--check");

const readJson = async (path: string) =>
  JSON.parse(await readFile(path, "utf8")) as unknown;

const brief = await readJson(`${exampleRoot}/source/creative-brief.json`);
const draft = await readJson(`${exampleRoot}/source/production-draft.json`);
const invalidDraft = await readJson(
  `${exampleRoot}/fixtures/missing-asset-draft.json`,
);

const compiled = compileProject(brief, draft);
const invalidCompiled = compileProject(brief, invalidDraft);

if (compiled.qaReport.status !== "pass") {
  throw new Error(
    "Reference pipeline must pass QA before artifacts are emitted.",
  );
}
if (invalidCompiled.qaReport.status !== "fail") {
  throw new Error("Controlled missing-asset fixture must fail semantic QA.");
}

const outputs = new Map<string, unknown>([
  [`${generatedRoot}/storyboard.json`, compiled.storyboard],
  [`${generatedRoot}/asset-manifest.json`, compiled.assetManifest],
  [
    `${generatedRoot}/implementation-scaffold.json`,
    compiled.implementationScaffold,
  ],
  [`${generatedRoot}/qa-report.json`, compiled.qaReport],
  [`${generatedRoot}/provenance-manifest.json`, compiled.provenanceManifest],
  [
    `${exampleRoot}/fixtures/missing-asset-qa-report.json`,
    invalidCompiled.qaReport,
  ],
  [
    `${schemaRoot}/creative-brief.schema.json`,
    {
      $id: "https://yanimation.dev/schemas/creative-brief.v1.json",
      ...z.toJSONSchema(CreativeBriefSchema, { target: "draft-2020-12" }),
    },
  ],
  [
    `${schemaRoot}/production-draft.schema.json`,
    {
      $id: "https://yanimation.dev/schemas/production-draft.v1.json",
      ...z.toJSONSchema(ProductionDraftSchema, { target: "draft-2020-12" }),
    },
  ],
]);

if (!checkOnly) {
  await Promise.all([
    mkdir(generatedRoot, { recursive: true }),
    mkdir(schemaRoot, { recursive: true }),
  ]);
}

for (const [path, value] of outputs) {
  const expected = stableJson(value);
  if (checkOnly) {
    const actual = await readFile(path, "utf8");
    if (actual !== expected) {
      throw new Error(`Generated artifact drift detected: ${path}`);
    }
  } else {
    await writeFile(path, expected);
  }
}

console.info(
  checkOnly
    ? `Pipeline artifacts are current (${compiled.provenanceManifest.bundleHash.slice(0, 12)}).`
    : `Generated Signal Atlas pipeline (${compiled.provenanceManifest.bundleHash.slice(0, 12)}).`,
);
