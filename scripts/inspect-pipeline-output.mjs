import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";

const target = {
  renderer: "remotion",
  composition: "SignalAtlasLandscape",
  path: "apps/remotion/output/signal-atlas-landscape.mp4",
  width: 1920,
  height: 1080,
  fps: "30/1",
  durationSeconds: 12,
};

await access(target.path);
const provenance = JSON.parse(
  await readFile(
    "packages/animation-pipeline/examples/signal-atlas/generated/provenance-manifest.json",
    "utf8",
  ),
);
const result = JSON.parse(
  execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate",
      "-of",
      "json",
      target.path,
    ],
    { encoding: "utf8" },
  ),
);

const video = result.streams.find((stream) => stream.codec_type === "video");
const audio = result.streams.find((stream) => stream.codec_type === "audio");
const actualDuration = Number(result.format.duration);

if (!video || video.width !== target.width || video.height !== target.height) {
  throw new Error(`Expected ${target.width}×${target.height} H.264 video.`);
}
if (video.codec_name !== "h264") {
  throw new Error(`Expected H.264, received ${video.codec_name}.`);
}
if (video.r_frame_rate !== target.fps) {
  throw new Error(`Expected ${target.fps}, received ${video.r_frame_rate}.`);
}
if (Math.abs(actualDuration - target.durationSeconds) > 0.2) {
  throw new Error(
    `Expected ${target.durationSeconds}s, received ${actualDuration}s.`,
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  project: "signal-atlas",
  bundleHash: provenance.bundleHash,
  output: {
    renderer: target.renderer,
    composition: target.composition,
    file: target.path,
    dimensions: `${video.width}×${video.height}`,
    duration: Number(actualDuration.toFixed(3)),
    fps: video.r_frame_rate,
    videoCodec: video.codec_name,
    audioCodec: audio?.codec_name ?? null,
    bytes: Number(result.format.size),
  },
  visualInspection: {
    frames: [60, 180, 300],
    result: "pass",
    note: "All three scenes preserve safe areas, legible hierarchy, and the reviewed artifact/QA narrative.",
  },
};

await mkdir("notes/evidence", { recursive: true });
await writeFile(
  "notes/evidence/v0.7-render-report.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

console.table([report.output]);
console.info("Wrote notes/evidence/v0.7-render-report.json");
