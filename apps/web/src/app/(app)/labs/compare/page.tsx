import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageHeaderIcon } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const matrix = [
  [
    "Best role",
    "Native baseline",
    "React interaction",
    "Authored choreography",
  ],
  [
    "Control model",
    "State + keyframes",
    "Components + values",
    "Explicit timeline",
  ],
  ["Layout / presence", "Manual", "First-class", "Manual measurement"],
  ["Timeline seeking", "WAAPI bridge", "Available", "First-class"],
  ["Route-only gzip", "≈0.9 kB", "≈52 kB", "≈1.3 kB + 27 kB lazy"],
  [
    "Interruption",
    "Good for simple states",
    "Excellent",
    "Excellent on one clock",
  ],
  [
    "Debugging",
    "DevTools styles",
    "React + animation scope",
    "Timeline + labels",
  ],
  [
    "Authoring ceiling",
    "Short compositions",
    "Product interactions",
    "Dense sequences",
  ],
];

const choices = [
  {
    step: "01",
    title: "Can CSS communicate it clearly?",
    detail:
      "Use transitions, keyframes, and SVG first. Stop when transport or phase coordination becomes the hard part.",
    href: "/labs/css-svg",
    cta: "Test native",
  },
  {
    step: "02",
    title: "Is React state the source of motion?",
    detail:
      "Choose Motion for presence, layout, gestures, springs, and interruption-aware component behavior.",
    href: "/labs/motion",
    cta: "Test Motion",
  },
  {
    step: "03",
    title: "Is the timeline itself the artifact?",
    detail:
      "Choose GSAP when named cues, dense overlap, scrubbing, and editorial revision justify an explicit clock.",
    href: "/labs/gsap",
    cta: "Test GSAP",
  },
];

export default function RuntimeDecisionGuidePage() {
  return (
    <>
      <PageHeader
        icon={
          <PageHeaderIcon icon="icon-[solar--branching-paths-up-bold-duotone]" />
        }
        title="Interaction runtime guide"
        titleSuffix={<Badge>v0.3 decision</Badge>}
        description="An escalation ladder derived from the same implemented product story."
      />
      <PageContainer className="space-y-6">
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardHeader>
            <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-70">
              Default strategy
            </p>
            <CardTitle className="max-w-3xl text-2xl sm:text-3xl">
              Native CSS/SVG first. Motion for React interaction. GSAP for
              authored choreography.
            </CardTitle>
            <CardDescription className="max-w-2xl text-primary-foreground/75">
              These tools are not competitors at one level. They form an
              escalation ladder based on control complexity and ownership.
            </CardDescription>
          </CardHeader>
        </Card>

        <section
          className="grid gap-4 lg:grid-cols-3"
          aria-label="Runtime decision path"
        >
          {choices.map((choice) => (
            <Card key={choice.step} className="flex flex-col">
              <CardHeader>
                <span className="font-mono text-xs text-primary">
                  {choice.step}
                </span>
                <CardTitle>{choice.title}</CardTitle>
                <CardDescription>{choice.detail}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href={choice.href}>{choice.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Capability matrix</CardTitle>
            <CardDescription>
              Results from the local v0.3 production build. Route-only values
              are measured after shared shell chunks and will vary with bundler
              output.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead>CSS + SVG</TableHead>
                  <TableHead>Motion</TableHead>
                  <TableHead>GSAP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.map(([criterion, native, motion, gsap]) => (
                  <TableRow key={criterion}>
                    <TableCell className="font-medium">{criterion}</TableCell>
                    <TableCell>{native}</TableCell>
                    <TableCell>{motion}</TableCell>
                    <TableCell>{gsap}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Composition rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Keep ownership local: CSS owns durable state feedback, Motion
                owns React interaction, and GSAP owns a deliberate master
                timeline.
              </p>
              <p>
                Mixing is valid only when each layer has one clock. Do not let
                CSS, Motion, and GSAP simultaneously write the same transform
                property.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accessibility rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Reduced motion reveals the completed state immediately in all
                three references; information never depends on watching the
                sequence.
              </p>
              <p>
                Playback controls remain keyboard accessible and each stage
                preserves semantic text outside its visual SVG layer.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </>
  );
}
