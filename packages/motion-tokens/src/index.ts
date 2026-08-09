export type CubicBezier = readonly [number, number, number, number];

/** Durations are stored in milliseconds so CSS, browser, and video consumers agree. */
export const duration = {
  instant: 0,
  feedback: 120,
  fast: 180,
  standard: 280,
  deliberate: 420,
  expressive: 640,
  narrative: 900,
} as const;

export type DurationToken = keyof typeof duration;

export const easing = {
  linear: [0, 0, 1, 1],
  standard: [0.2, 0, 0, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.22, 1, 0.36, 1],
} as const satisfies Record<string, CubicBezier>;

export type EasingToken = keyof typeof easing;

/** Physics values stay unitless and can be adapted by any spring-capable runtime. */
export const spring = {
  feedback: { stiffness: 500, damping: 35, mass: 0.7 },
  spatial: { stiffness: 340, damping: 28, mass: 0.9 },
  gentle: { stiffness: 220, damping: 26, mass: 1 },
  expressive: { stiffness: 300, damping: 22, mass: 0.8 },
} as const;

export type SpringToken = keyof typeof spring;

export const stagger = {
  compact: 40,
  standard: 70,
  spacious: 110,
} as const;

export type StaggerToken = keyof typeof stagger;

export const distance = {
  subtle: 4,
  compact: 8,
  standard: 16,
  emphasized: 24,
} as const;

export type DistanceToken = keyof typeof distance;

/**
 * Semantic recipes reference primitive tokens instead of copying values.
 * Runtime adapters decide how those references map to their animation API.
 */
export const choreography = {
  feedback: {
    duration: "feedback",
    easing: "standard",
    spring: "feedback",
  },
  enter: {
    duration: "deliberate",
    easing: "enter",
    distance: "standard",
    stagger: "standard",
  },
  exit: {
    duration: "fast",
    easing: "exit",
    distance: "compact",
  },
  layout: {
    spring: "spatial",
  },
  emphasis: {
    duration: "expressive",
    easing: "emphasized",
    distance: "emphasized",
    stagger: "spacious",
  },
} as const satisfies Record<
  string,
  {
    duration?: DurationToken;
    easing?: EasingToken;
    spring?: SpringToken;
    stagger?: StaggerToken;
    distance?: DistanceToken;
  }
>;

export type ChoreographyIntent = keyof typeof choreography;

/** Accessibility decisions shared by UI documentation and runtime adapters. */
export const reducedMotionPolicy = {
  transform: "replace-with-opacity",
  layout: "snap-to-target",
  autoplay: "pause-until-requested",
  decorativeLoop: "omit",
  essentialState: "preserve-without-travel",
} as const;

export const millisecondsToSeconds = (milliseconds: number) =>
  milliseconds / 1000;

export const millisecondsToFrames = (milliseconds: number, fps: number) => {
  if (!(Number.isFinite(fps) && fps > 0)) {
    throw new RangeError("fps must be a positive finite number");
  }

  return Math.round(millisecondsToSeconds(milliseconds) * fps);
};
