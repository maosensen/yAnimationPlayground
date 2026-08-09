import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NativeInteractionProbe() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Native interaction probe</CardTitle>
        <CardDescription>
          Hover or focus the cards. CSS owns state feedback while SVG supplies
          vector geometry and masking without a client runtime.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {["Transition", "Path", "Mask"].map((label, index) => (
          <button
            type="button"
            key={label}
            className="group relative min-h-32 overflow-hidden rounded-lg bg-muted/40 p-4 text-left ring-1 ring-border transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-primary/10 focus-visible:-translate-y-1 focus-visible:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              className="absolute right-0 bottom-0 h-24 w-24 text-primary opacity-20 transition-[transform,opacity] duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:opacity-40 group-focus-visible:scale-125 group-focus-visible:rotate-12 group-focus-visible:opacity-40"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <title>Decorative masked circle</title>
              <defs>
                <mask id={`native-probe-mask-${index}`}>
                  <rect width="100" height="100" fill="white" />
                  <circle cx="50" cy="50" r="18" fill="black" />
                </mask>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="currentColor"
                mask={`url(#native-probe-mask-${index})`}
              />
            </svg>
            <span className="font-medium">{label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Browser-native feedback
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
