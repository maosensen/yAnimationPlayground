import { execFileSync } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";

const workspaceDirectory = new URL("../../../", import.meta.url);
execFileSync(
  "pnpm",
  ["--filter", "@yanimation/video-contract", "generate:audio"],
  {
    cwd: workspaceDirectory,
    stdio: "inherit",
  },
);

const source = new URL(
  "../../../packages/video-contract/generated/living-signals-bed.wav",
  import.meta.url,
);
const publicDirectory = new URL("../public/", import.meta.url);
await mkdir(publicDirectory, { recursive: true });
await copyFile(source, new URL("living-signals-bed.wav", publicDirectory));
console.info("Synced shared audio into the Remotion public directory.");
