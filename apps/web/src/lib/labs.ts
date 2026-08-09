export type LabDefinition = {
  slug: string;
  name: string;
  description: string;
  focus: string[];
  icon: string;
  status: "reference" | "planned";
};

export const labs = {
  "css-svg": {
    slug: "css-svg",
    name: "CSS + SVG",
    description:
      "Establish the native browser baseline for vector motion and visual timing.",
    focus: ["CSS keyframes", "SVG paths", "Masks and gradients"],
    icon: "icon-[solar--pen-new-square-bold-duotone]",
    status: "reference",
  },
  gsap: {
    slug: "gsap",
    name: "GSAP",
    description:
      "Study timeline choreography, precise seeking, easing, and SVG motion.",
    focus: ["Timelines", "Stagger and easing", "Motion paths"],
    icon: "icon-[solar--clapperboard-play-bold-duotone]",
    status: "reference",
  },
  motion: {
    slug: "motion",
    name: "Motion",
    description:
      "Explore React-first interaction, gestures, layout transitions, and springs.",
    focus: ["Layout animation", "Gestures", "Spring dynamics"],
    icon: "icon-[solar--cursor-square-bold-duotone]",
    status: "reference",
  },
  d3: {
    slug: "d3",
    name: "D3",
    description:
      "Turn data into bespoke geometry before handing motion to the right runtime.",
    focus: ["Scales", "Shapes and layouts", "Data transitions"],
    icon: "icon-[solar--chart-square-bold-duotone]",
    status: "planned",
  },
  lottie: {
    slug: "lottie",
    name: "Lottie",
    description:
      "Evaluate vector animation delivery, playback control, and runtime limits.",
    focus: ["JSON playback", "Segments", "Asset performance"],
    icon: "icon-[solar--video-frame-play-horizontal-bold-duotone]",
    status: "planned",
  },
  rive: {
    slug: "rive",
    name: "Rive",
    description:
      "Build interactive vector graphics driven by state machines and runtime data.",
    focus: ["State machines", "Data binding", "Canvas and WebGL runtimes"],
    icon: "icon-[solar--gamepad-bold-duotone]",
    status: "planned",
  },
  canvas: {
    slug: "canvas",
    name: "Canvas",
    description:
      "Study immediate-mode drawing, dense scenes, particles, and frame budgets.",
    focus: ["Render loops", "Particles", "Performance profiling"],
    icon: "icon-[solar--layers-bold-duotone]",
    status: "planned",
  },
} satisfies Record<string, LabDefinition>;

export const labList = Object.values(labs);
