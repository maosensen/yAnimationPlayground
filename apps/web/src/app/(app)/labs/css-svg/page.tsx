import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function CssSvgLabPage() {
  return <LabOverview lab={labs["css-svg"]} />;
}
