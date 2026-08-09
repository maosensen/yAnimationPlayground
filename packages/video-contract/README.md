# Video production contract

This package is the shared source of truth for the v0.5 code-video milestone.
It deliberately contains data rather than renderer components:

- `production-contract.json` defines frame rate, duration, formats, safe areas,
  typography, palette, audio, and output naming.
- `product-story.json` defines the creative brief, scene timing, copy, captions,
  and deterministic seed.
- `generate:audio` creates the same deterministic ambient audio bed for both
  renderers without committing a large binary asset.

Remotion imports the JSON contract directly. HyperFrames generates its static
HTML compositions from the same JSON files before preview or render. Renderer-
specific layout and animation remain owned by their respective workspaces.
