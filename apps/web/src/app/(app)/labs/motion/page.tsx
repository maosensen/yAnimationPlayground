import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { MotionBenchmark } from "@/components/labs/interaction/motion-benchmark";
import { MotionInteractionProbe } from "@/components/labs/interaction/motion-interaction-probe";
import { labs } from "@/lib/labs";

export default function MotionLabPage() {
  return (
    <InteractionLabPage
      lab={labs.motion}
      benchmark={<MotionBenchmark />}
      capabilities={[
        {
          title: "React-native state",
          detail:
            "Presence, layout, and gestures compose with component state.",
          icon: "icon-[solar--code-circle-bold-duotone]",
        },
        {
          title: "Interruptible motion",
          detail:
            "Springs and value animation retarget without rebuilding a timeline.",
          icon: "icon-[solar--cursor-square-bold-duotone]",
        },
        {
          title: "Scoped sequences",
          detail:
            "useAnimate adds local choreography without leaking selectors globally.",
          icon: "icon-[solar--layers-minimalistic-bold-duotone]",
        },
      ]}
      probe={<MotionInteractionProbe />}
      recommendation="Use Motion as the default upgrade when animation is a consequence of React state. It expresses gestures, presence, layout, and interruption more directly than timeline-centric code while still supporting short sequences."
      useWhen={[
        "The interaction is owned by React state, layout, gesture, or component presence.",
        "Animations must retarget gracefully while the user is still interacting.",
      ]}
      avoidWhen={[
        "A simple CSS transition communicates the state change just as clearly.",
        "The work is an editorial sequence with many precise cross-layer cues.",
      ]}
    />
  );
}
