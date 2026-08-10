# @yanimation/animation-pipeline

Provider-neutral contracts and deterministic tooling for the v0.7 AI-assisted
animation workflow.

## Stages

1. A human writes and approves `source/creative-brief.json`.
2. An AI or coding agent returns `source/production-draft.json` through the
   versioned prompt and JSON Schema contract.
3. A human reviews storyboard, assets, and implementation assignments.
4. `pnpm pipeline:generate` compiles immutable review artifacts.
5. `pnpm pipeline:check` rejects schema errors, semantic QA failures, and drift.
6. Web and Remotion consumers read the same tracked reference bundle.

The compiler does not call a model and does not require credentials. Model
orchestration, prompt history, collaborative review, and persistence stay in a
future studio repository.

## Commands

```sh
pnpm pipeline:generate
pnpm pipeline:check
pnpm --filter @yanimation/animation-pipeline test
```

Generated files are committed intentionally. The drift check proves that the
reviewed inputs, not hidden mutable state, define the production package.
