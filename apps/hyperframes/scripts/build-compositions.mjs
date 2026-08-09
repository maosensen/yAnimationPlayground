import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const workspaceDirectory = new URL("../../../", import.meta.url);
const contract = JSON.parse(
  await readFile(
    new URL(
      "../../../packages/video-contract/src/production-contract.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const story = JSON.parse(
  await readFile(
    new URL(
      "../../../packages/video-contract/src/product-story.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const timelineScript = await readFile(
  new URL("../src/timeline.js", import.meta.url),
  "utf8",
);

execFileSync(
  "pnpm",
  ["--filter", "@yanimation/video-contract", "generate:audio"],
  {
    cwd: workspaceDirectory,
    stdio: "inherit",
  },
);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const visualMarkup = (visual) => {
  if (visual === "orbit") {
    return `<div class="orbit" aria-hidden="true">
      <div class="orbit-ring orbit-ring-a"></div>
      <div class="orbit-ring orbit-ring-b"></div>
      <div class="orbit-ring orbit-ring-c"></div>
      <div class="orbit-core"></div>
      ${Array.from({ length: 8 }, (_, index) => `<span class="orbit-dot orbit-dot-${index + 1}"></span>`).join("\n      ")}
    </div>`;
  }

  if (visual === "bars") {
    return `<div class="meaning-bars" aria-hidden="true">
      ${[42, 68, 54, 88, 62, 76, 48]
        .map(
          (height, index) =>
            `<span class="meaning-bar${index === 3 ? " is-key" : ""}" style="--bar-height:${height}%"></span>`,
        )
        .join("\n      ")}
    </div>`;
  }

  if (visual === "runtimes") {
    return `<div class="runtime-map" aria-hidden="true">
      ${["CSS / SVG", "MOTION", "GSAP", "D3", "LOTTIE", "CANVAS"]
        .map(
          (runtime, index) =>
            `<div class="runtime-card"><span>0${index + 1}</span><strong>${runtime}</strong></div>`,
        )
        .join("\n      ")}
    </div>`;
  }

  if (visual === "frames") {
    return `<div class="frame-stack" aria-hidden="true">
      ${[438, 439, 440]
        .map(
          (frame, index) =>
            `<div class="frame-card frame-card-${index + 1}" data-layout-allow-occlusion><div><span>FRAME 0${frame}</span><span>30 FPS</span></div><i></i></div>`,
        )
        .join("\n      ")}
    </div>`;
  }

  return `<div class="format-pair" aria-hidden="true">
    <div class="format-frame landscape-frame"><strong>16:9</strong><span>ADAPTIVE</span></div>
    <div class="format-frame portrait-frame"><strong>9:16</strong><span>ADAPTIVE</span></div>
  </div>`;
};

const sceneMarkup = story.scenes
  .map(
    (scene, index) => `<section
      id="scene-${scene.id}"
      class="clip scene scene-${scene.visual}"
      data-scene-index="${index}"
      data-start="${scene.start}"
      data-duration="${scene.duration}"
      data-track-index="${index + 1}"
    >
      <div class="copy-block">
        <p class="eyebrow">${escapeHtml(scene.eyebrow)}</p>
        <h1>${escapeHtml(scene.title)}</h1>
        <p class="body-copy">${escapeHtml(scene.body)}</p>
      </div>
      <div class="visual-block">${visualMarkup(scene.visual)}</div>
    </section>`,
  )
  .join("\n");

const makeComposition = (formatName) => {
  const format = contract.formats[formatName];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Living Signals — ${formatName}</title>
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body class="format-${formatName}">
    <main
      id="root"
      class="composition"
      data-composition-id="living-signals-${formatName}"
      data-start="0"
      data-duration="${contract.durationInSeconds}"
      data-width="${format.width}"
      data-height="${format.height}"
      style="--safe-top:${format.safeArea.top}px;--safe-right:${format.safeArea.right}px;--safe-bottom:${format.safeArea.bottom}px;--safe-left:${format.safeArea.left}px"
    >
      <div class="grid" aria-hidden="true"></div>
      <header><span>yAnimationPlayground / v0.5</span><span>HYPERFRAMES / SEEKABLE HTML</span></header>
      ${sceneMarkup}
      <div class="progress-track" aria-hidden="true"><div class="progress-value"></div></div>
      <audio
        id="ambient-bed"
        data-start="0"
        data-duration="${contract.durationInSeconds}"
        data-track-index="0"
        data-volume="${contract.audio.volume}"
        src="./assets/${contract.audio.fileName}"
      ></audio>
    </main>
    <script src="./vendor/gsap.min.js"></script>
    <script>
${timelineScript}
    </script>
  </body>
</html>
`;
};

const appDirectory = new URL("../", import.meta.url);
await rm(new URL("index.html", appDirectory), { force: true });
await rm(new URL("portrait.html", appDirectory), { force: true });
await rm(new URL("compositions/", appDirectory), {
  recursive: true,
  force: true,
});

const audioSource = new URL(
  "../../../packages/video-contract/generated/living-signals-bed.wav",
  import.meta.url,
);
const gsapSource = new URL(await import.meta.resolve("gsap/dist/gsap.min.js"));
const stylesSource = new URL("../src/styles.css", import.meta.url);

for (const formatName of ["landscape", "portrait"]) {
  const projectDirectory = new URL(
    `../projects/${formatName}/`,
    import.meta.url,
  );
  const assetsDirectory = new URL("assets/", projectDirectory);
  const vendorDirectory = new URL("vendor/", projectDirectory);
  const sourceDirectory = new URL("src/", projectDirectory);
  await mkdir(assetsDirectory, { recursive: true });
  await mkdir(vendorDirectory, { recursive: true });
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(
    new URL("index.html", projectDirectory),
    makeComposition(formatName),
  );
  await copyFile(
    audioSource,
    new URL(contract.audio.fileName, assetsDirectory),
  );
  await copyFile(gsapSource, new URL("gsap.min.js", vendorDirectory));
  await copyFile(stylesSource, new URL("styles.css", sourceDirectory));
}
console.info("Generated HyperFrames landscape and portrait compositions.");
