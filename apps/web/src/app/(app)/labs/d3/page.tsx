import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function D3LabPage() {
  return <LabOverview lab={labs.d3} />;
}
