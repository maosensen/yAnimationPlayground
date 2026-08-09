import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function RiveLabPage() {
  return <LabOverview lab={labs.rive} />;
}
