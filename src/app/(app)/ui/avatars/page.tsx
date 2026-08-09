import type { ReactNode } from "react";
import { DisplayCard } from "@/components/display-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

/** "James Lee" → "JL" */
function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const PEOPLE = [
  "James Lee",
  "John Sir",
  "Michael Smith",
  "Emily Johnson",
  "Sarah Davis",
  "Chris Wilson",
  "Daniel Garcia",
  "Patricia Harris",
];

const CONTACTS = [
  { name: "Vertex Financial Services", role: "Account · Finance" },
  { name: "Global Dynamics Corp", role: "Account · Manufacturing" },
  { name: "Innovatech Industries", role: "Account · Technology" },
  { name: "Pioneer Technologies", role: "Account · Technology" },
  { name: "Heritage Manufacturing", role: "Account · Manufacturing" },
  { name: "Summit Software Systems", role: "Account · SaaS" },
];

// Distinct seed strings — each maps to a deterministic color and doubles as a
// stable React key (no array-index keys).
const GRADIENT_SWATCHES = [
  "aurora",
  "cobalt",
  "ember",
  "fern",
  "grape",
  "ivy",
  "jade",
  "koi",
];
const SOLID_SWATCHES = [
  "amber",
  "azure",
  "berry",
  "clay",
  "dusk",
  "fog",
  "gold",
  "haze",
];

const codeFooter = (snippet: string) => (
  <>
    <span className="icon-[solar--code-2-bold-duotone] size-4" aria-hidden />
    <span>{snippet}</span>
  </>
);

export default function AvatarsPage() {
  return (
    <>
      <PageHeader
        title="Avatars"
        description="AvatarFallback gains a variant prop. The default text keeps the muted initials placeholder; solid and gradient generate a colored background from a seed (the initials by default), so each identity keeps a stable, SSR-safe color."
      />

      <PageContainer className="space-y-6">
        <Section title="Default (text)">
          <DisplayCard
            title="Initials placeholder"
            titleAs="h3"
            subtitle="No variant — the muted background and foreground tokens, exactly as before"
            footer={codeFooter("<AvatarFallback>CN</AvatarFallback>")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Avatar>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>
                  <span
                    className="icon-[solar--user-linear] size-4"
                    aria-hidden
                  />
                </AvatarFallback>
              </Avatar>
            </div>
          </DisplayCard>
        </Section>

        <Section title="Solid">
          <DisplayCard
            title="Random-looking solid fill"
            titleAs="h3"
            subtitle="Hue is hashed from the seed; lightness and chroma are fixed so the set stays harmonious"
            footer={codeFooter(
              '<AvatarFallback variant="solid" seed="James Lee">JL</AvatarFallback>',
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              {PEOPLE.map((name) => (
                <Avatar key={name}>
                  <AvatarFallback variant="solid" seed={name}>
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </DisplayCard>
        </Section>

        <Section title="Gradient">
          <DisplayCard
            title="Diagonal two-tone gradient"
            titleAs="h3"
            subtitle="Two related hues at 135°, mirroring the CRM-style account/lead avatars"
            footer={codeFooter(
              '<AvatarFallback variant="gradient" seed="James Lee">JL</AvatarFallback>',
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              {PEOPLE.map((name) => (
                <Avatar key={name}>
                  <AvatarFallback variant="gradient" seed={name}>
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </DisplayCard>
        </Section>

        <Section title="Without initials">
          <DisplayCard
            title="Pure color, no text"
            titleAs="h3"
            subtitle="Leave the children empty for a decorative swatch — distinct seeds keep them apart. With no text, pass aria-label so the avatar isn't silent to screen readers."
            footer={codeFooter(
              '<AvatarFallback variant="gradient" seed="acct-01" aria-label="Acct 01" />',
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              {GRADIENT_SWATCHES.map((s) => (
                <Avatar key={s}>
                  <AvatarFallback variant="gradient" seed={s} aria-label={s} />
                </Avatar>
              ))}
              {SOLID_SWATCHES.map((s) => (
                <Avatar key={s}>
                  <AvatarFallback variant="solid" seed={s} aria-label={s} />
                </Avatar>
              ))}
            </div>
          </DisplayCard>
        </Section>

        <Section title="Sizes">
          <DisplayCard
            title="Inherits the Avatar size"
            titleAs="h3"
            subtitle="The fallback fills its parent, so the size prop on Avatar drives it"
            footer={codeFooter('<Avatar size="lg">…</Avatar>')}
          >
            <div className="flex flex-wrap items-end gap-4">
              <Avatar size="sm">
                <AvatarFallback variant="gradient" seed="Sarah Davis">
                  SD
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback variant="gradient" seed="Sarah Davis">
                  SD
                </AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback variant="gradient" seed="Sarah Davis">
                  SD
                </AvatarFallback>
              </Avatar>
            </div>
          </DisplayCard>
        </Section>

        <Section title="Stable per identity">
          <DisplayCard
            title="Same seed → same color"
            titleAs="h3"
            subtitle="Rendering the same seed three times yields three identical avatars — the color is deterministic, not random per render"
          >
            <div className="flex flex-wrap items-center gap-3">
              {["a", "b", "c"].map((k) => (
                <Avatar key={k}>
                  <AvatarFallback variant="gradient" seed="Emily Johnson">
                    EJ
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </DisplayCard>
        </Section>

        <Section title="Contact list">
          <DisplayCard
            title="In context"
            titleAs="h3"
            subtitle="A realistic list where each row's avatar color is keyed off its name"
          >
            <ul className="divide-y divide-border overflow-hidden rounded-lg border">
              {CONTACTS.map((contact) => (
                <li key={contact.name} className="flex items-center gap-3 p-3">
                  <Avatar size="lg">
                    <AvatarFallback variant="gradient" seed={contact.name}>
                      {initials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {contact.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {contact.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </DisplayCard>
        </Section>
      </PageContainer>
    </>
  );
}
