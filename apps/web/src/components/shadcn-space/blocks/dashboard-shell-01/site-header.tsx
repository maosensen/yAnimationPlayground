import { SettingsTrigger } from "@/components/settings/settings-drawer";
import NotificationDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/notification-dropdown";
import UserDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/user-dropdown";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Right-hand action cluster shared by every shell layout (vertical / mini /
 * horizontal). The leading element (sidebar trigger or brand) is supplied by
 * the shell itself.
 *
 * The icon row is one family (Solar, bold-duotone, `size-4.5`) so it reads as
 * a set: theming, light/dark, profiles — then this shell's own dashboard
 * affordances (notifications, account) after a divider.
 *
 * Glyphs ride `text-muted-foreground`, not the inherited foreground — at full
 * strength they read as harsh pure black in light mode. On the dark "apparent"
 * nav panel that token is re-pointed to the sidebar foreground (globals.css),
 * so the same class stays a soft light grey there.
 */
export function SiteHeader() {
  return (
    <div className="flex items-center gap-1.5">
      <SettingsTrigger />
      <ThemeToggle className="text-muted-foreground hover:text-foreground" />
      <SocialLinks />
      <span className="mx-1 h-4 w-px bg-border" aria-hidden />
      <NotificationDropdown
        defaultOpen={false}
        align="center"
        trigger={
          <div className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1 cursor-pointer">
            <span
              className="icon-[solar--bell-bing-bold-duotone] block size-4.5"
              aria-hidden
            />
          </div>
        }
      />
      <UserDropdown
        defaultOpen={false}
        align="center"
        trigger={
          <div className="rounded-full">
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src="/user-avatar.png" alt="David McMichael" />
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </div>
        }
      />
    </div>
  );
}
