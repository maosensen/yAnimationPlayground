import { GsapBenchmark } from "@/components/labs/interaction/gsap-benchmark";
import { GsapTimelineProbe } from "@/components/labs/interaction/gsap-timeline-probe";
import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { labs } from "@/lib/labs";

export default function GsapLabPage() {
  return (
    <InteractionLabPage
      lab={labs.gsap}
      benchmark={<GsapBenchmark />}
      capabilities={[
        {
          title: "Master timeline",
          detail:
            "Labels, offsets, and nested timing expose the whole composition.",
          icon: "icon-[solar--clapperboard-play-bold-duotone]",
        },
        {
          title: "Precise transport",
          detail:
            "Seek, pause, reverse, replay, and speed are first-class controls.",
          icon: "icon-[solar--rewind-back-bold-duotone]",
        },
        {
          title: "DOM + SVG orchestration",
          detail:
            "One timeline coordinates text, cards, and vector signal geometry.",
          icon: "icon-[solar--routing-bold-duotone]",
        },
      ]}
      probe={<GsapTimelineProbe />}
      recommendation="Escalate to GSAP when the animation is an authored composition whose timeline is the product. Its labels and deterministic transport make dense, revised choreography easier to reason about; the dependency remains isolated to this route."
      useWhen={[
        "Many overlapping phases need named cues, scrubbing, reversing, or editorial revision.",
        "DOM, SVG, and future canvas layers must follow one explicit clock.",
      ]}
      avoidWhen={[
        "The motion is mostly a direct response to React layout or component presence.",
        "A handful of native transitions can express the same relationship.",
      ]}
    />
  );
}
