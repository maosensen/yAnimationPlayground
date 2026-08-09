import { LabOverview } from "@/components/labs/lab-overview";
import { labs } from "@/lib/labs";

export default function GsapLabPage() {
  return <LabOverview lab={labs.gsap} />;
}
