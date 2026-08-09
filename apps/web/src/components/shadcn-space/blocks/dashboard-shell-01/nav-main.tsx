"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * Shared look for top-level rows, modeled on the Minimals nav: roomy rows,
 * muted resting state, soft primary tint when active. In the icon rail the
 * stock size-8!/p-2! would crop the size-5 icon, so padding drops to p-1.5.
 *
 * Resting rows sit at 60% opacity (≈ Minimals' text.secondary grey over a
 * light surface) and return to full color on hover. Opacity-based muting
 * keeps working on the dark "apparent" nav surface, where it reads as
 * dimmed white instead.
 */
const rowClass =
  "h-10 gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:p-1.5!";

const activeRowClass =
  "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary";

const NavIcon = ({ icon }: { icon?: string }) =>
  icon ? <span className={cn(icon, "size-5 shrink-0")} aria-hidden /> : null;

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  // In the icon rail the inline collapsible has nowhere to expand, so
  // submenus open as a dropdown flying out to the right instead.
  const iconRail = state === "collapsed" && !isMobile;

  const hasActiveChild = (item: NavItem): boolean =>
    item.children?.some(
      (child) => child.href === pathname || hasActiveChild(child),
    ) ?? false;

  // Recursive render function
  const renderItem = (item: NavItem) => {
    //  Section label
    if (item.isSection && item.label) {
      return (
        <SidebarGroup key={item.label} className="p-0 pt-4 first:pt-0">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/55">
            {item.label}
          </SidebarGroupLabel>
        </SidebarGroup>
      );
    }
    const hasChildren = !!item.children?.length;
    // Item with children → collapsible
    if (hasChildren && item.title) {
      const childActive = hasActiveChild(item);
      if (iconRail) {
        return (
          <SidebarGroup key={item.title} className="p-0 pb-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        rowClass,
                        "cursor-pointer",
                        childActive && "text-primary hover:text-primary",
                      )}
                    >
                      <NavIcon icon={item.icon} />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    sideOffset={10}
                  >
                    {item.children?.map((child) => (
                      <DropdownMenuItem key={child.title} asChild>
                        <Link
                          href={child.href ?? "#"}
                          className={cn(
                            child.href === pathname &&
                              "font-medium text-primary",
                          )}
                        >
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        );
      }
      return (
        <SidebarGroup key={item.title} className="p-0 pb-1">
          <SidebarMenu>
            <Collapsible
              defaultOpen={childActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      rowClass,
                      "cursor-pointer",
                      childActive && "text-primary hover:text-primary",
                    )}
                  >
                    <NavIcon icon={item.icon} />
                    <span className="truncate">{item.title}</span>
                    <span
                      className="icon-[solar--alt-arrow-right-linear] ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden"
                      aria-hidden
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="me-0 gap-0.5 pe-0">
                    {item.children?.map(renderItemSub)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      );
    }
    // Item without children
    if (item.title) {
      const isActive = pathname === item.href;

      return (
        <SidebarGroup key={item.title} className="p-0 pb-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(rowClass, isActive && activeRowClass)}
              >
                <Link href={item.href ?? "#"}>
                  <NavIcon icon={item.icon} />
                  <span className="w-full truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      );
    }
    return null;
  };
  // Recursive render function for sub-items
  const renderItemSub = (item: NavItem) => {
    const hasChildren = !!item.children?.length;
    if (hasChildren && item.title) {
      return (
        <SidebarMenuSubItem key={item.title}>
          <Collapsible
            defaultOpen={hasActiveChild(item)}
            className="group/collapsible"
          >
            <CollapsibleTrigger className="w-full">
              <SidebarMenuSubButton className="h-9 gap-3 rounded-lg px-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <NavIcon icon={item.icon} />
                <span className="truncate">{item.title}</span>
                <span
                  className="icon-[solar--alt-arrow-right-linear] ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  aria-hidden
                />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="me-0 gap-0.5 pe-0">
                {item.children?.map(renderItemSub)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuSubItem>
      );
    }
    if (item.title) {
      return (
        <SidebarMenuSubItem key={item.title} className="w-full">
          <SidebarMenuSubButton
            asChild
            isActive={pathname === item.href}
            className="h-9 w-full gap-3 rounded-lg px-3 text-sidebar-foreground/60 hover:text-sidebar-foreground data-[active=true]:bg-primary/5 data-[active=true]:font-medium data-[active=true]:text-primary"
          >
            <Link href={item.href ?? "#"}>
              {/* Minimals-style bullet: inherits row color, brightens when active */}
              <span
                className="size-1.5 shrink-0 rounded-full bg-current opacity-30 transition-all in-data-[active=true]:scale-125 in-data-[active=true]:opacity-100"
                aria-hidden
              />
              <span className="truncate">{item.title}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
    return null;
  };

  return <>{items.map(renderItem)}</>;
}
