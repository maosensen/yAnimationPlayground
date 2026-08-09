"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableAction {
  /** Iconify Tailwind class, e.g. "icon-[solar--add-folder-bold-duotone]" */
  icon: string;
  listtitle: string;
}

interface ProjectData {
  id: number;
  project: string;
  date: string;
  budget: string;
  icon: string;
  iconcolor: string;
  iconbg: string;
  avatar: string;
  name: string;
  handle: string;
  progress: number;
  progressColor: string;
}

const TopProductTable = () => {
  const tableActionData: TableAction[] = [
    { icon: "icon-[solar--add-folder-bold-duotone]", listtitle: "Add" },
    { icon: "icon-[solar--pen-2-bold-duotone]", listtitle: "Edit" },
    {
      icon: "icon-[solar--trash-bin-minimalistic-bold-duotone]",
      listtitle: "Delete",
    },
  ];

  const checkboxTableData: ProjectData[] = [
    {
      id: 1,
      project: "Web App Project",
      date: "04 June 2026",
      budget: "12,000",
      icon: "icon-[solar--window-frame-bold-duotone]",
      iconcolor: "text-orange-400",
      iconbg: "bg-orange-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-11.jpg",
      name: "Olivia Rhye",
      handle: "olivia@ui.com",
      progress: 60,
      progressColor: "**:data-[slot=progress-indicator]:bg-orange-400",
    },
    {
      id: 2,
      project: "MaterialM Admin",
      date: "09 January 2026",
      budget: "8000",
      icon: "icon-[solar--hand-stars-bold-duotone]",
      iconcolor: "text-sky-400",
      iconbg: "bg-sky-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-8.jpg",
      name: "Barbara Steele",
      handle: "steele@ui.com",
      progress: 30,
      progressColor: "**:data-[slot=progress-indicator]:bg-primary",
    },
    {
      id: 3,
      project: "Digital Marketing",
      date: "15 April 2026",
      budget: "15,000",
      icon: "icon-[solar--volume-loud-bold-duotone]",
      iconcolor: "text-teal-400",
      iconbg: "bg-teal-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
      name: "Leonard Gordon",
      handle: "olivia@ui.com",
      progress: 45,
      progressColor: "**:data-[slot=progress-indicator]:bg-amber-300",
    },
    {
      id: 4,
      project: "Shadcn Space Design",
      date: "30 March 2026",
      budget: "1000",
      icon: "icon-[solar--filters-bold-duotone]",
      iconcolor: "text-red-500",
      iconbg: "bg-red-500/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-4.jpg",
      name: "Evelyn Pope",
      handle: "steele@ui.com",
      progress: 37,
      progressColor: "**:data-[slot=progress-indicator]:bg-red-500",
    },
    {
      id: 5,
      project: "Graphic Design",
      date: "23 October 2026",
      budget: "7000",
      icon: "icon-[solar--paint-roller-bold-duotone]",
      iconcolor: "text-primary",
      iconbg: "bg-primary/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-5.jpg",
      name: "Tommy Garza",
      handle: "olivia@ui.com",
      progress: 87,
      progressColor: "**:data-[slot=progress-indicator]:bg-teal-400",
    },
    {
      id: 6,
      project: "Digital Marketing",
      date: "15 April 2026",
      budget: "15,000",
      icon: "icon-[solar--volume-loud-bold-duotone]",
      iconcolor: "text-teal-400",
      iconbg: "bg-teal-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
      name: "Leonard Gordon",
      handle: "olivia@ui.com",
      progress: 45,
      progressColor: "**:data-[slot=progress-indicator]:bg-amber-300",
    },
  ];

  return (
    <Card className="w-full h-full py-6 gap-6">
      <CardHeader className="sm:flex items-center justify-between px-6">
        <div>
          <CardTitle className="leading-normal">Top Projects</CardTitle>
          <CardDescription>
            Checkout the statistics of top projects
          </CardDescription>
        </div>
        <InputGroup className="h-9 rounded-md w-fit">
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon>
            <span
              className="icon-[solar--magnifer-linear] size-4.5"
              aria-hidden
            />
          </InputGroupAddon>
        </InputGroup>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-0">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <Table className="min-w-2xl">
            <TableHeader>
              <TableRow className="hover:bg-transparent!">
                <TableHead className="p-3 ps-6">#</TableHead>
                <TableHead className="p-2">Project Name</TableHead>
                <TableHead className="p-2">Budget</TableHead>
                <TableHead className="p-2">Manager</TableHead>
                <TableHead className="p-2">Progress</TableHead>
                <TableHead className="p-3 pe-6 flex justify-end">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border dark:divide-darkborder">
              {checkboxTableData.map((item) => (
                <TableRow key={item.id}>
                  {/* Checkbox */}
                  <TableCell className="whitespace-nowrap p-3 ps-6">
                    <Checkbox className="cursor-pointer" />
                  </TableCell>

                  {/* project */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center",
                          item.iconbg,
                        )}
                      >
                        <span
                          className={cn(
                            item.icon,
                            "block size-4.5",
                            item.iconcolor,
                          )}
                          aria-hidden
                        />
                      </div>
                      <div className="">
                        <h6 className="text-sm font-medium">{item.project}</h6>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="whitespace-nowrap">
                    <p className="text-sm text-foreground">${item.budget}</p>
                  </TableCell>

                  {/* Customer */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        className="h-9 w-9 rounded-full"
                        width={36}
                        height={36}
                      />
                      <div className="truncate line-clamp-2 max-w-56">
                        <h6 className="text-base! font-normal!">{item.name}</h6>
                        <p className="text-sm text-muted-foreground">
                          {item.handle}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Progress */}
                  <TableCell className="whitespace-nowrap">
                    <Progress
                      value={item.progress}
                      className={cn(
                        "w-full h-1.5 [&>div]:h-1.5",
                        `${item.progressColor}`,
                      )}
                    />
                  </TableCell>

                  {/* Dropdown Menu */}
                  <TableCell className="whitespace-nowrap p-3 pe-6">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <span className="flex justify-center items-center rounded-full p-2 hover:bg-muted cursor-pointer">
                            <span
                              className="icon-[solar--menu-dots-bold] size-4 rotate-90"
                              aria-hidden
                            />
                          </span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {tableActionData.map((action) => (
                            <DropdownMenuItem
                              key={action.listtitle}
                              className="group flex gap-3 hover:bg-accent! cursor-pointer"
                            >
                              <span
                                className={`${action.icon} size-4`}
                                aria-hidden
                              />
                              <span>{action.listtitle}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductTable;
