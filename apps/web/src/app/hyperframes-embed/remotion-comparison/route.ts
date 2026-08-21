import { readFileSync } from "node:fs";
import { join } from "node:path";

const compositionDirectory = join(
  process.cwd(),
  "../hyperframes/videos/remotion-comparison",
);
const compositionHtml = readFileSync(
  join(compositionDirectory, "index.html"),
  "utf8",
);
const gsapRuntime = readFileSync(
  join(compositionDirectory, "vendor/gsap.min.js"),
  "utf8",
);

const previewRuntime = `
<script>
  (() => {
    const root = document.querySelector("[data-composition-id]");
    const timeline = window.__timelines?.[root?.dataset.compositionId];
    const duration = Number(root?.dataset.duration ?? 0);
    const source = "yanimation-hf-preview";
    const clips = Array.from(root?.querySelectorAll(".clip") ?? []);
    let currentTime = 0;
    let playing = true;
    let lastTick = performance.now();

    if (!root || !timeline || !duration) {
      throw new Error("The embedded HyperFrames preview could not find its timeline.");
    }

    const fitComposition = () => {
      const width = Number(root.dataset.width ?? 1920);
      const height = Number(root.dataset.height ?? 1080);
      const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
      root.style.position = "absolute";
      root.style.left = String((window.innerWidth - width * scale) / 2) + "px";
      root.style.top = String((window.innerHeight - height * scale) / 2) + "px";
      root.style.transformOrigin = "top left";
      root.style.transform = "scale(" + scale + ")";
    };

    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    fitComposition();
    window.addEventListener("resize", fitComposition);

    const publish = () => {
      window.parent.postMessage(
        { source, type: "time", currentTime, duration, playing },
        "*",
      );
    };

    const seek = (nextTime) => {
      currentTime = Math.min(duration, Math.max(0, Number(nextTime) || 0));
      timeline.seek(currentTime, false);
      for (const clip of clips) {
        const start = Number(clip.dataset.start ?? 0);
        const end = start + Number(clip.dataset.duration ?? duration);
        const visible =
          currentTime >= start &&
          (currentTime < end || (currentTime === duration && end === duration));
        clip.style.display = visible ? "block" : "none";
      }
      publish();
    };

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (!message || message.source !== "yanimation-hf-player") return;

      if (message.type === "play") {
        playing = true;
        lastTick = performance.now();
        publish();
      }

      if (message.type === "pause") {
        playing = false;
        publish();
      }

      if (message.type === "seek") {
        seek(message.time);
        lastTick = performance.now();
      }

      if (message.type === "restart") {
        playing = true;
        lastTick = performance.now();
        seek(0);
      }
    });

    const tick = (now) => {
      if (playing) {
        currentTime += (now - lastTick) / 1000;
        if (currentTime >= duration) currentTime = 0;
        seek(currentTime);
      }
      lastTick = now;
      window.requestAnimationFrame(tick);
    };

    timeline.seek(0, false);
    publish();
    window.requestAnimationFrame(tick);
  })();
</script>`;

const previewHtml = compositionHtml
  .replace(
    '<script src="./vendor/gsap.min.js"></script>',
    `<script>${gsapRuntime}</script>`,
  )
  .replace("</body>", `${previewRuntime}</body>`);

export function GET() {
  return new Response(previewHtml, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
