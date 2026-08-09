import type { ReactNode } from "react";
import { DisplayCard } from "@/components/display-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DisplayCardPage() {
  return (
    <>
      <PageHeader
        title="Display Card"
        description="A container for laying out component and tool samples. Splits into three border-separated regions: header, content, and footer."
      />

      <PageContainer className="space-y-6">
        <Section title="Basic">
          <DisplayCard
            title="Button basics"
            titleAs="h3"
            subtitle="Default variants and sizes"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </DisplayCard>
        </Section>

        <Section title="With Footer">
          <DisplayCard
            title="Badge variants"
            titleAs="h3"
            subtitle="Use the footer for notes or code snippets"
            footer={
              <>
                <span
                  className="icon-[solar--code-2-bold-duotone] size-4"
                  aria-hidden
                />
                <span>{'<Badge variant="secondary">Label</Badge>'}</span>
              </>
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </DisplayCard>
        </Section>

        <Section title="With Header Actions">
          <DisplayCard
            title="Actions in the header"
            titleAs="h3"
            subtitle="The actions prop places buttons or links on the right"
            actions={
              <Button variant="outline" size="sm">
                View source
                <span
                  className="icon-[solar--arrow-right-up-linear] size-4"
                  aria-hidden
                />
              </Button>
            }
          >
            <p className="text-sm text-muted-foreground">
              Intended for controls that accompany a sample — variant toggles, a
              "show code" switch, and the like.
            </p>
          </DisplayCard>
        </Section>

        <Section title="Title Only (no subtitle)">
          <DisplayCard
            title="Omitting the subtitle shows the title alone"
            titleAs="h3"
          >
            <p className="text-sm text-muted-foreground">
              Both subtitle and footer are optional — neither renders when
              omitted.
            </p>
          </DisplayCard>
        </Section>

        <Section title="Grid">
          <div className="grid gap-4 md:grid-cols-2">
            <DisplayCard
              title="Card A"
              titleAs="h3"
              subtitle="Lay several out side by side to compare"
            >
              <p className="text-sm">
                The content area accepts any element you like.
              </p>
            </DisplayCard>
            <DisplayCard
              title="Card B"
              titleAs="h3"
              subtitle="With a footer"
              footer={<span>Note: the footer is for annotations or code.</span>}
            >
              <p className="text-sm">
                The three regions are clearly separated by borders.
              </p>
            </DisplayCard>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
