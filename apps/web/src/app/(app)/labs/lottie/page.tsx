import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function LottieLabPage() {
  return <LabOverview lab={labs.lottie} />;
}
