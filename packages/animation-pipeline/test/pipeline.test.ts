import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { compileProject, stableJson } from "../src/compiler.ts";

const readJson = async (relativePath: string) =>
  JSON.parse(
    await readFile(new URL(relativePath, import.meta.url), "utf8"),
  ) as unknown;

const brief = await readJson(
  "../examples/signal-atlas/source/creative-brief.json",
);
const draft = await readJson(
  "../examples/signal-atlas/source/production-draft.json",
);

test("the reviewed reference bundle passes every executable QA gate", () => {
  const compiled = compileProject(brief, draft);
  assert.equal(compiled.qaReport.status, "pass");
  assert.equal(compiled.qaReport.summary.fail, 0);
  assert.equal(compiled.qaReport.summary.pass, 10);
});

test("compilation is deterministic for identical structured inputs", () => {
  const first = compileProject(brief, draft);
  const second = compileProject(brief, draft);
  assert.equal(
    stableJson(first.provenanceManifest),
    stableJson(second.provenanceManifest),
  );
  assert.equal(first.provenanceManifest.bundleHash.length, 64);
});

test("semantic QA rejects a schema-valid missing asset reference", async () => {
  const invalidDraft = await readJson(
    "../examples/signal-atlas/fixtures/missing-asset-draft.json",
  );
  const compiled = compileProject(brief, invalidDraft);
  assert.equal(compiled.qaReport.status, "fail");
  assert.equal(
    compiled.qaReport.checks.find((item) => item.id === "assets.references")
      ?.status,
    "fail",
  );
});
