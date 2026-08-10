# Remotion workspace

Frame-driven React video compositions for the v0.5 reference film and the v0.7
AI-assisted pipeline proof. This workspace imports reviewed shared contracts
while owning its React composition and render lifecycle.

```sh
pnpm --filter @yanimation/remotion dev
pnpm --filter @yanimation/remotion compositions
pnpm --filter @yanimation/remotion render
pnpm --filter @yanimation/remotion render:pipeline
```

- Studio: <http://localhost:4405>
- Outputs: `apps/remotion/output/`
- Composition IDs: `LivingSignalsLandscape`, `LivingSignalsPortrait`,
  `SignalAtlasLandscape`, `SignalAtlasPortrait`

`prepare:assets` generates the deterministic shared audio bed and copies it to
Remotion's public directory before preview or rendering.

Signal Atlas reads the tracked `@yanimation/animation-pipeline` reference
bundle directly. It adds no model SDK or network dependency to the renderer.
