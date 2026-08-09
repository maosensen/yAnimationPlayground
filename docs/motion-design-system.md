# Motion design system

The v0.6 system separates stable motion facts from runtime behavior:

```
motion-tokens (milliseconds, curves, physics, intent, policy)
├── CSS custom properties
├── motion-kit (Motion for React adapter)
└── Remotion (frame conversion and easing adapter)
```

## Package boundary

`@yanimation/motion-tokens` is runtime-neutral. Durations are authored in
milliseconds because CSS consumes milliseconds directly, Motion can convert
them to seconds, and frame renderers can convert them deterministically with an
explicit fps. The package contains no React or animation-runtime dependency.

`@yanimation/motion-kit` is a small Motion for React adapter. React and Motion
are peer dependencies, and each primitive is exposed through a granular
subpath. There is intentionally no root barrel export, so a consumer chooses
the exact surface it imports.

## Public APIs

| Export | Responsibility |
|---|---|
| `@yanimation/motion-tokens` | Duration, easing, spring, stagger, distance, choreography, reduced-motion policy, and time conversion |
| `@yanimation/motion-tokens/styles.css` | CSS custom-property representation of time and easing primitives |
| `@yanimation/motion-kit/policy` | Route-local system/full/reduced policy and resolved preference hook |
| `@yanimation/motion-kit/transitions` | Token-backed Motion transition objects |
| `@yanimation/motion-kit/reveal` | Named fade, rise, and scale entrance variants |
| `@yanimation/motion-kit/stagger` | Correlated `Stagger.Root` and `Stagger.Item` composition |
| `@yanimation/motion-kit/pressable` | Semantic button with lift, compress, or quiet feedback |

Explicit variant names replace clusters of boolean props. Correlated pieces
use a compound component, while independent primitives remain independent
exports. Components accept children rather than render callbacks.

## Consumer proof

The API is stabilized only after these real integrations:

1. The motion-system workbench consumes the policy, reveal, stagger,
   pressable, transition adapters, and every token family.
2. The existing Motion interaction probe consumes policy, pressable, and
   transition adapters for a pre-existing UI rather than a purpose-built demo.
3. The Remotion composition consumes neutral duration and easing values and
   converts milliseconds to frames at the composition fps.
4. Global CSS imports the optional CSS token representation.

The web shell does not mount the Motion policy globally. It stays inside the
two routes that need it, preventing the animation runtime from entering every
route's client graph.

## Reduced-motion contract

Reduced motion is an information-preserving mode:

- transform-based entrance becomes a short opacity change;
- shared-layout movement snaps to the target;
- autoplay waits for an explicit request;
- decorative continuous loops are omitted;
- essential state, content, focus order, and final values remain present.

`MotionPolicyProvider` can follow the system preference or explicitly simulate
full/reduced behavior in the workbench. The override is a named preference,
not a boolean, so the source of the decision remains visible.

## Verification

`pnpm test:contracts` runs runtime invariants for the neutral tokens and
compiles a public consumer fixture for every motion-kit subpath. `pnpm check`
includes these contracts after lint and workspace type checking. The production
build and browser QA remain required because type contracts cannot validate
visual interruption, responsive layout, or reduced-motion behavior.
