# Motion kit

A deliberately small, composition-first adapter for Motion for React. It turns
the runtime-neutral contracts from `@yanimation/motion-tokens` into reusable
React behavior without turning the package into a speculative component
catalogue.

Public APIs are granular subpath exports:

- `policy` — route-local reduced-motion policy and override provider;
- `transitions` — typed Motion transition adapters;
- `reveal` — explicit fade, rise, and scale entrance recipes;
- `stagger` — correlated `Stagger.Root` and `Stagger.Item` primitives;
- `pressable` — accessible button semantics with named feedback modes.

There is intentionally no root barrel export. Consumers only pull the runtime
surface they use, and the package keeps `react` and `motion` as peer
dependencies.

Run `pnpm --filter @yanimation/motion-kit test` to compile the public consumer
contract.
