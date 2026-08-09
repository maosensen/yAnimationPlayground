import { readFile } from "node:fs/promises";

const contract = JSON.parse(
  await readFile(
    new URL("../src/production-contract.json", import.meta.url),
    "utf8",
  ),
);
const story = JSON.parse(
  await readFile(new URL("../src/product-story.json", import.meta.url), "utf8"),
);

const fail = (message) => {
  throw new Error(`Video contract invalid: ${message}`);
};

if (contract.durationInFrames !== contract.durationInSeconds * contract.fps) {
  fail("durationInFrames must equal durationInSeconds × fps");
}

for (const [formatName, format] of Object.entries(contract.formats)) {
  if (!(format.width > 0 && format.height > 0)) {
    fail(`${formatName} dimensions must be positive`);
  }
  for (const edge of ["top", "right", "bottom", "left"]) {
    if (!(format.safeArea[edge] >= 0)) {
      fail(`${formatName}.safeArea.${edge} must be non-negative`);
    }
  }
}

let cursor = 0;
for (const scene of story.scenes) {
  if (scene.start !== cursor) {
    fail(`scene ${scene.id} must start at ${cursor}s`);
  }
  if (!(scene.duration > 0)) {
    fail(`scene ${scene.id} must have a positive duration`);
  }
  cursor += scene.duration;
}

if (cursor !== contract.durationInSeconds) {
  fail(`scene duration total must equal ${contract.durationInSeconds}s`);
}

for (const caption of story.captions) {
  if (!(caption.start >= 0 && caption.end > caption.start)) {
    fail(`caption “${caption.text}” has invalid timing`);
  }
  if (caption.end > contract.durationInSeconds) {
    fail(`caption “${caption.text}” exceeds the composition duration`);
  }
}

console.info(
  `Video contract valid: ${story.scenes.length} scenes, ${contract.durationInSeconds}s, ${contract.fps}fps.`,
);
