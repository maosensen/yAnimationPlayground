# Motion tokens

Runtime-neutral motion contracts validated by the playground's browser and
video labs. Durations use milliseconds at the source so CSS, JavaScript, and
frame-based renderers can share one value without assuming a runtime.

Public contracts include:

- ordered duration, stagger, and travel-distance scales;
- cubic-bezier and physics-spring presets;
- semantic choreography recipes that reference primitive tokens;
- a documented reduced-motion policy;
- deterministic millisecond-to-second and millisecond-to-frame adapters;
- an optional CSS custom-property export at `@yanimation/motion-tokens/styles.css`.

Run `pnpm --filter @yanimation/motion-tokens test` to verify the contract.
