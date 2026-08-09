"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  textColor: string;
  bgColor: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--star-bold-duotone]" */
  icon: string;
  title: string;
  desc: string;
  time: string;
};

const PROFILE_ITEMS: MenuItem[] = [
  {
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    icon: "icon-[solar--star-bold-duotone]",
    title: "Event Today",
    desc: "Just reminder that you have to",
    time: "9:00 AM",
  },
  {
    textColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    icon: "icon-[solar--videocamera-record-bold-duotone]",
    title: "Team Meeting",
    desc: "Discuss project updates and next steps",
    time: "10:00 AM",
  },
  {
    textColor: "text-teal-400",
    bgColor: "bg-teal-400/10",
    icon: "icon-[solar--chef-hat-minimalistic-bold-duotone]",
    title: "Lunch Break",
    desc: "Take a break and recharge",
    time: "12:30 PM",
  },
  {
    textColor: "text-red-500",
    bgColor: "bg-red-500/10",
    icon: "icon-[solar--headphones-round-bold-duotone]",
    title: "Client Call",
    desc: "Monthly check-in with the client",
    time: "3:00 PM",
  },
  {
    textColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    icon: "icon-[solar--document-text-bold-duotone]",
    title: "Project Review",
    desc: "Review project deliverables with client",
    time: "4:00 PM",
  },
];

const NotificationDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
}: Props) => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="p-0 w-sm rounded-2xl data-open:slide-in-from-top-20! data-closed:slide-out-to-top-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          {/* title */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <p className="text-base font-medium text-popover-foreground">
                Notifications
              </p>
              <Badge className="font-normal leading-0">5 New</Badge>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          {/* Notifications */}
          <DropdownMenuGroup>
            {PROFILE_ITEMS.map(
              ({ bgColor, textColor, icon, title, desc, time }) => (
                <DropdownMenuItem
                  key={title}
                  className={
                    "mx-1.5 my-1 p-2 flex items-center justify-between cursor-pointer"
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl", bgColor, textColor)}>
                      <span className={cn(icon, "block size-5")} aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-popover-foreground">
                        {title}
                      </p>
                      <p className="max-w-52 truncate text-sm text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{time}</p>
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuGroup>

          {/* button */}
          <div className="mx-1.5 my-1 p-2">
            <Button className="rounded-xl w-full cursor-pointer h-9 hover:bg-primary/80">
              See All Notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationDropdown;
