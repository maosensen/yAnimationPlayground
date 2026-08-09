import { DisplayCard } from "@/components/display-card";
import GridstackAdvancedDemo from "@/components/gridstack/advanced-demo";
import GridstackBasicDemo from "@/components/gridstack/basic-demo";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";

export default function GridstackPage() {
  return (
    <>
      <PageHeader
        title="Gridstack"
        description="Draggable, resizable dashboard widgets powered by Gridstack. Drag a card to rearrange it, or drag its bottom-right corner to resize."
      />

      <PageContainer className="space-y-6">
        <DisplayCard
          title="Basic demo"
          subtitle="A fixed set of widgets declared in JSX; Gridstack takes over drag and resize."
        >
          <GridstackBasicDemo />
        </DisplayCard>

        <DisplayCard
          title="Advanced demo"
          subtitle="Add / remove widgets, compact, toggle float, and save / restore the layout."
        >
          <GridstackAdvancedDemo />
        </DisplayCard>
      </PageContainer>
    </>
  );
}
