# HyperFrames workspace

Deterministic HTML-to-video compositions for the v0.5 reference film. The
workspace generates static, inspectable HTML from the same production contract
and product-story brief consumed by Remotion.

```sh
pnpm --filter @yanimation/hyperframes dev
pnpm --filter @yanimation/hyperframes lint:composition
pnpm --filter @yanimation/hyperframes validate
pnpm --filter @yanimation/hyperframes render
```

- Landscape project: `projects/landscape/index.html` (16:9)
- Portrait project: `projects/portrait/index.html` (9:16)
- Landscape Studio: <http://localhost:4406>
- Portrait Studio: <http://localhost:4407>
- Outputs: `apps/hyperframes/output/`

`prepare:compositions` regenerates two isolated HyperFrames projects, copies
the pinned GSAP runtime, and syncs the deterministic shared audio. The split is
intentional: each aspect ratio remains a valid one-root HyperFrames project.
Do not hand-edit generated HTML; edit `scripts/build-compositions.mjs`,
`src/styles.css`, or `src/timeline.js` instead.
