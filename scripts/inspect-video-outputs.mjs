import { execFileSync } from "node:child_process";
import { access, mkdir, writeFile } from "node:fs/promises";

const expected = [
  {
    renderer: "remotion",
    format: "landscape",
    path: "apps/remotion/output/living-signals-landscape.mp4",
    width: 1920,
    height: 1080,
  },
  {
    renderer: "remotion",
    format: "portrait",
    path: "apps/remotion/output/living-signals-portrait.mp4",
    width: 1080,
    height: 1920,
  },
  {
    renderer: "hyperframes",
    format: "landscape",
    path: "apps/hyperframes/output/living-signals-landscape.mp4",
    width: 1920,
    height: 1080,
  },
  {
    renderer: "hyperframes",
    format: "portrait",
    path: "apps/hyperframes/output/living-signals-portrait.mp4",
    width: 1080,
    height: 1920,
  },
];

const inspect = async (target) => {
  await access(target.path);
  const output = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate",
      "-of",
      "json",
      target.path,
    ],
    { encoding: "utf8" },
  );
  const result = JSON.parse(output);
  const video = result.streams.find((stream) => stream.codec_type === "video");
  const audio = result.streams.find((stream) => stream.codec_type === "audio");
  const duration = Number(result.format.duration);

  if (
    !video ||
    video.width !== target.width ||
    video.height !== target.height
  ) {
    throw new Error(
      `${target.path}: expected ${target.width}×${target.height} video`,
    );
  }
  if (video.r_frame_rate !== "30/1") {
    throw new Error(
      `${target.path}: expected 30fps, received ${video.r_frame_rate}`,
    );
  }
  if (Math.abs(duration - 36) > 0.2) {
    throw new Error(
      `${target.path}: expected a 36s duration, received ${duration}s`,
    );
  }
  if (!audio) {
    throw new Error(`${target.path}: expected an audio stream`);
  }

  return {
    renderer: target.renderer,
    format: target.format,
    file: target.path,
    dimensions: `${video.width}×${video.height}`,
    duration: Number(duration.toFixed(3)),
    fps: video.r_frame_rate,
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
  };
};

const report = [];
for (const target of expected) {
  report.push(await inspect(target));
}

await mkdir("notes/evidence", { recursive: true });
await writeFile(
  "notes/evidence/v0.5-render-report.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), outputs: report }, null, 2)}\n`,
);
console.table(report);
console.info("Wrote notes/evidence/v0.5-render-report.json");
