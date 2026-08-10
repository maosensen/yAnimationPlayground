import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const chunksRoot = path.join(root, "apps/web/.next/static/chunks");
const appRoot = path.join(root, "apps/web/.next/server/app");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

const chunkFiles = (await walk(chunksRoot)).filter((file) =>
  file.endsWith(".js"),
);
const threeChunks = [];

for (const file of chunkFiles) {
  const source = await readFile(file, "utf8");
  if (source.includes("WebGLRenderer") && source.includes("OrbitControls")) {
    threeChunks.push(file);
  }
}

if (threeChunks.length !== 1) {
  throw new Error(
    `Expected exactly one Three.js runtime chunk, found ${threeChunks.length}. Run pnpm build first.`,
  );
}

const [chunk] = threeChunks;
const chunkName = path.basename(chunk);
const manifestFiles = (await walk(appRoot)).filter((file) =>
  file.endsWith("react-loadable-manifest.json"),
);
const references = [];

for (const file of manifestFiles) {
  const source = await readFile(file, "utf8");
  if (source.includes(chunkName)) references.push(path.relative(root, file));
}

const expectedManifest =
  "apps/web/.next/server/app/(app)/labs/threejs/page/react-loadable-manifest.json";
if (references.length !== 1 || references[0] !== expectedManifest) {
  throw new Error(
    `Three.js chunk leaked outside its route. References: ${references.join(", ") || "none"}`,
  );
}

const bytes = await readFile(chunk);
const fileStats = await stat(chunk);
const result = {
  route: "/labs/threejs",
  chunk: path.relative(root, chunk),
  rawBytes: fileStats.size,
  gzipBytes: gzipSync(bytes).byteLength,
  referencedBy: references,
  isolated: true,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
