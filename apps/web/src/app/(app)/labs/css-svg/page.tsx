import { CssSvgBenchmark } from "@/components/labs/interaction/css-svg-benchmark";
import { InteractionLabPage } from "@/components/labs/interaction/interaction-lab-page";
import { NativeInteractionProbe } from "@/components/labs/interaction/native-interaction-probe";
import { labs } from "@/lib/labs";

export default function CssSvgLabPage() {
  return (
    <InteractionLabPage
      lab={labs["css-svg"]}
      benchmark={<CssSvgBenchmark />}
      capabilities={[
        {
          title: "Zero-runtime baseline",
          detail:
            "Transitions and keyframes stay in the browser animation stack.",
          icon: "icon-[solar--leaf-bold-duotone]",
        },
        {
          title: "Vector-native",
          detail:
            "Path drawing, gradients, masks, and transforms share one SVG scene.",
          icon: "icon-[solar--pen-bold-duotone]",
        },
        {
          title: "State by attributes",
          detail:
            "DOM state and media preferences can drive small compositions.",
          icon: "icon-[solar--settings-minimalistic-bold-duotone]",
        },
      ]}
      probe={<NativeInteractionProbe />}
      recommendation="Start here for durable UI feedback and short, state-driven sequences. The flagship remains compact, but imperative playback requires the Web Animations API and exposes the point where CSS alone stops being the simplest control model."
      useWhen={[
        "The animation has a small number of states and a clear end state.",
        "Bundle cost, progressive enhancement, and long-term durability dominate.",
      ]}
      avoidWhen={[
        "Editorial timing changes often across many overlapping phases.",
        "A React component needs interruption-aware layout or presence semantics.",
      ]}
    />
  );
}
