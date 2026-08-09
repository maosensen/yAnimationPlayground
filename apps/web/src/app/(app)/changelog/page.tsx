import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { type ChangeKind, changelog } from "@/lib/changelog";
import { cn } from "@/lib/utils";
import pkg from "../../../../package.json";

export const metadata: Metadata = {
  title: "Changelog",
};

/**
 * Changelog — curated release notes on a timeline. Each release opens with a
 * mono version chip, date, headline and summary, followed by a card of
 * titled, categorized changes (data in src/lib/changelog.ts). The running
 * version gets a "Current" badge.
 */

// Colored category tags. "New" borrows the accent so it matches the version
// chip; the other two keep distinct hues for scanning.
const kindMeta: Record<ChangeKind, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-primary/10 text-primary dark:bg-primary/15",
  },
  improved: {
    label: "Improved",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
  },
  fixed: {
    label: "Fixed",
    className:
      "bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  },
};

function formatDate(iso: string): string {
  // Parse as local midnight so the formatted day never shifts across time zones.
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        title="Changelog"
        description="Highlights from each release"
      />
      <PageContainer>
        <ol className="max-w-2xl">
          {changelog.map((release, index) => (
            <li key={release.version} className="relative pb-10 pl-7 last:pb-2">
              {/* Timeline rail: an accent dot per release, joined by a
                  hairline down to the next entry. */}
              <span
                aria-hidden
                className="absolute top-1 left-0 size-[11px] rounded-full bg-primary ring-4 ring-primary/15"
              />
              {index < changelog.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-5 bottom-0 left-[5px] w-px bg-border/70"
                />
              )}

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium font-mono text-primary text-xs dark:bg-primary/15">
                  v{release.version}
                </span>
                <span className="font-mono text-muted-foreground text-xs">
                  {formatDate(release.date)}
                </span>
                {release.version === pkg.version && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary dark:bg-primary/15">
                    Current
                  </span>
                )}
              </div>

              <h2 className="mt-3 font-bold text-foreground text-xl tracking-tight">
                {release.title}
              </h2>
              {release.summary && (
                <p className="mt-1.5 max-w-prose text-muted-foreground text-sm leading-relaxed">
                  {release.summary}
                </p>
              )}

              <ul className="mt-4 divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
                {release.changes.map((change) => (
                  <li key={change.text} className="flex gap-4 px-4 py-4">
                    <span className="w-[4.75rem] shrink-0 pt-0.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 font-medium text-[10px] uppercase tracking-wider",
                          kindMeta[change.kind].className,
                        )}
                      >
                        {kindMeta[change.kind].label}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      {change.title && (
                        <div className="font-semibold text-foreground text-sm">
                          {change.title}
                        </div>
                      )}
                      <p
                        className={cn(
                          "text-muted-foreground text-sm leading-relaxed",
                          change.title && "mt-1",
                        )}
                      >
                        {change.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </PageContainer>
    </>
  );
}
