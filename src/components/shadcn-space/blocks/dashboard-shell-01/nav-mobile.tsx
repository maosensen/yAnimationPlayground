"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo/logo";
import type { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Small-screen fallback for the "horizontal" shell layout.
 *
 * A horizontal bar can't work below md, so a hamburger opens a left
 * off-canvas Sheet with a vertical list (a lightweight stand-in for
 * NavMain, which depends on the Sidebar context and can't render here).
 * Section labels render as group headings; the sheet closes on navigation.
 */
export function NavMobile({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close once navigation lands (pathname changes).
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname change is the close trigger
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const hasActiveChild = (item: NavItem): boolean =>
    item.children?.some(
      (child) => child.href === pathname || hasActiveChild(child),
    ) ?? false;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className={cn("md:hidden", className)}
        >
          <span
            className="icon-[solar--hamburger-menu-linear] size-5"
            aria-hidden
          />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-3">
          {items.map((item) => {
            // Section label → group heading
            if (item.isSection && item.label) {
              return (
                <span
                  key={item.label}
                  className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-foreground/55 first:pt-1"
                >
                  {item.label}
                </span>
              );
            }
            if (!item.title) return null;
            if (!item.children?.length) {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href ?? "#"}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/60 hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(item.icon, "size-5 shrink-0")}
                      aria-hidden
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            }
            const childActive = hasActiveChild(item);
            return (
              <Collapsible
                key={item.title}
                defaultOpen={childActive}
                className="group/collapsible"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium hover:bg-accent hover:text-foreground",
                    childActive
                      ? "text-primary hover:text-primary"
                      : "text-foreground/60",
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(item.icon, "size-5 shrink-0")}
                      aria-hidden
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                  <span
                    className="icon-[solar--alt-arrow-right-linear] ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    aria-hidden
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-5 flex flex-col gap-0.5 border-l py-1 pl-3">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.title}
                          href={child.href ?? "#"}
                          className={cn(
                            "flex h-9 items-center gap-3 rounded-lg px-3 text-sm",
                            active
                              ? "bg-primary/5 font-medium text-primary"
                              : "text-foreground/60 hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <span className="truncate">{child.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
