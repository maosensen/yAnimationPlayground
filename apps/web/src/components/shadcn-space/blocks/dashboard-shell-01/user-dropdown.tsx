"use client";

import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  label: string;
  /** Iconify Tailwind class, e.g. "icon-[solar--user-circle-bold-duotone]" */
  icon: string;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: "icon-[solar--user-circle-bold-duotone]" },
  { label: "My Subscription", icon: "icon-[solar--card-2-bold-duotone]" },
  { label: "My Invoice", icon: "icon-[solar--bill-list-bold-duotone]" },
];

const SETTINGS_ITEMS: MenuItem[] = [
  {
    label: "Account Settings",
    icon: "icon-[solar--settings-bold-duotone]",
  },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: "icon-[solar--logout-2-bold-duotone]",
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

const UserDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-3xs rounded-2xl data-open:slide-in-from-bottom-20! data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          {/* User Info */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="data-[size=lg]:size-8">
                  <AvatarImage src="/user-avatar.png" alt="David McMichael" />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
              </div>

              <div className="flex flex-col">
                <span className="text-popover-foreground text-sm font-medium">
                  David McMichael
                </span>
                <span className="text-muted-foreground text-sm">
                  david@shadcnspace.com
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Main Links */}
          <DropdownMenuGroup>
            {PROFILE_ITEMS.map(({ label, icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <span
                  className={`${icon} size-5 text-muted-foreground`}
                  aria-hidden
                />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <span
                  className={`${icon} size-5 text-muted-foreground`}
                  aria-hidden
                />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem variant="destructive" className={itemClass}>
            <span className={`${LOGOUT_ITEM.icon} size-5`} aria-hidden />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
