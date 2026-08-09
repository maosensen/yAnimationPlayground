# Remotion workspace

Frame-driven React video compositions for the v0.5 reference film. This
workspace imports the shared brief and production contract while owning its
React composition and render lifecycle.

```sh
pnpm --filter @yanimation/remotion dev
pnpm --filter @yanimation/remotion compositions
pnpm --filter @yanimation/remotion render
```

- Studio: <http://localhost:4405>
- Outputs: `apps/remotion/output/`
- Composition IDs: `LivingSignalsLandscape`, `LivingSignalsPortrait`

`prepare:assets` generates the deterministic shared audio bed and copies it to
Remotion's public directory before preview or rendering.
