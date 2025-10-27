
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, ChevronDown, ChevronRight, Minus, CheckCircle, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OnDevelopmentProject } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type RenderSubComponentProps = {
    row: any;
};

export const columns = (
    onEdit: (project: OnDevelopmentProject) => void,
): ColumnDef<OnDevelopmentProject & { onMarkAsCompleted: (id: string) => void }>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
          className="flex items-center"
        >
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      ) : (
        <Minus className="h-4 w-4 text-muted-foreground/50"/>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
        const project = row.original;
        return (
            <div className="font-medium flex items-center gap-2">
                <span>{row.getValue("name")}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "manager",
    header: "Project Manager",
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "details.assignedTeam",
    header: "Team",
    cell: ({ row }) => {
        const team = row.original.details.assignedTeam;
        const visibleMembers = team.slice(0, 2);
        const hiddenMembersCount = team.length - visibleMembers.length;
        
        return (
            <div className="flex items-center -space-x-2">
                <TooltipProvider>
                {visibleMembers.map((member, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Avatar className="w-8 h-8 border-2 border-card">
                                <AvatarFallback>{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{member}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                </TooltipProvider>
                 {hiddenMembersCount > 0 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8 border-2 border-card bg-muted text-muted-foreground">
                                    <AvatarFallback>+{hiddenMembersCount}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{team.slice(2).join(', ')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        )
    }
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return <Badge variant={priority === "High" ? "destructive" : priority === "Medium" ? "secondary" : "outline"} className="capitalize">{priority}</Badge>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
          <Edit className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const renderSubComponent = ({ row }: RenderSubComponentProps) => {
    const project = row.original as OnDevelopmentProject & { onMarkAsCompleted: (id: string) => void };
    const onMarkAsCompletedClick = () => {
        project.onMarkAsCompleted(project.id);
    }
    return (
        <Card className="bg-muted/50 border-none rounded-none">
            <CardContent className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">PROJECT MANAGER</p>
                    <p className="text-sm">{project.manager}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">CURRENT PHASE/SPRINT</p>
                    <p className="text-sm">{project.details.currentPhase}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">MILESTONE STATUS</p>
                    <p className="text-sm">{project.details.milestoneStatus}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">BLOCKERS</p>
                    <p className={cn("text-sm font-bold", project.details.blockers > 0 ? "text-destructive" : "text-green-500")}>
                        {project.details.blockers}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">TIME SPENT vs BUDGETED</p>
                    <p className="text-sm">{project.details.timeSpent} of {project.details.timeBudgeted} hours used</p>
                </div>
                <div className="space-y-1 col-span-2 lg:col-span-1">
                    <p className="text-xs font-semibold text-muted-foreground">ASSIGNED TEAM</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                        {project.details.assignedTeam.map((member, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Avatar className="w-8 h-8 border-2 border-card">
                                    <AvatarFallback>{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>

                                </Avatar>
                                <span className="text-sm">{member}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">INTERNAL STATUS NOTES</p>
                    <p className="text-sm text-muted-foreground italic">{project.details.statusNotes}</p>
                </div>
                <div className="col-span-full flex justify-end pt-2">
                    <Button onClick={onMarkAsCompletedClick}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
