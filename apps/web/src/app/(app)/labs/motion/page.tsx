import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function MotionLabPage() {
  return <LabOverview lab={labs.motion} />;
}
