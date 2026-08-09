import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function CanvasLabPage() {
  return <LabOverview lab={labs.canvas} />;
}
