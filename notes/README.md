# Lab notes

Each completed experiment leaves a note under `notes/<version>/<slug>.md`.
Notes describe evidence; reusable code belongs in `packages/` only after a
second real consumer proves the contract.

Use this structure:

```markdown
# Experiment title

## Question

What decision should this experiment make?

## Compared implementations

Keep the visual and behavioral contract constant when comparing runtimes.

## Measurements

Record bundle impact, frame behavior, authoring effort, and relevant output
properties on named reference environments.

## Visual and interaction findings

Document responsive behavior, reduced motion, interruption, and accessibility.

## Failure modes

Capture the approaches that failed and why.

## Decision

State the default choice, escalation path, and anti-use-cases.

## Reusable candidates

Name possible tokens, primitives, or assets, but extract them only after a
second consumer appears.
```
